import QRCode from 'qrcode';
import { Jimp } from 'jimp';
import { v2 as cloudinary } from 'cloudinary';
import { config } from './config/environment';
import path from 'path';
import fs from 'fs';

if (config.storage.type === 'cloudinary') {
  cloudinary.config({
    cloud_name: config.cloudinary.cloudName,
    api_key: config.cloudinary.apiKey,
    api_secret: config.cloudinary.apiSecret
  });
}

const PRODUCTION_BASE_URL = 'https://farmersanthe.com';

const BASE_ALLOWED_LOGO_HOSTS = [
  'res.cloudinary.com',
  'encrypted-tbn0.gstatic.com',
  'lh3.googleusercontent.com',
  'storage.googleapis.com',
  's3.amazonaws.com',
  'images.unsplash.com',
  'quintessentials.co',
];

function getOpeninaryHost(): string | null {
  try {
    const url = config.openinary.url;
    if (!url) return null;
    return new URL(url).hostname.toLowerCase();
  } catch {
    return null;
  }
}

function isAllowedLogoUrl(urlString: string): boolean {
  try {
    const parsed = new URL(urlString);
    if (parsed.protocol !== 'https:') return false;
    const host = parsed.hostname.toLowerCase();
    const openinaryHost = getOpeninaryHost();
    const allowedHosts = [
      ...BASE_ALLOWED_LOGO_HOSTS,
      ...(openinaryHost ? [openinaryHost] : []),
      ...config.qrCode.extraLogoHosts,
    ];
    return allowedHosts.some(allowed => host === allowed || host.endsWith('.' + allowed));
  } catch {
    return false;
  }
}

async function fetchLogoBuffer(orgLogoUrl: string): Promise<Buffer | null> {
  if (orgLogoUrl.startsWith('/uploads/') || orgLogoUrl.startsWith('/public/uploads/')) {
    try {
      const filename = path.basename(orgLogoUrl);
      const localPath = path.join(process.cwd(), 'public', 'uploads', filename);
      if (fs.existsSync(localPath)) {
        return fs.readFileSync(localPath);
      }
      console.warn('Local logo file not found:', localPath);
      return null;
    } catch (err) {
      console.warn('Failed to read local logo file:', err);
      return null;
    }
  }

  if (isAllowedLogoUrl(orgLogoUrl)) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);
    try {
      const logoResponse = await fetch(orgLogoUrl, { signal: controller.signal });
      clearTimeout(timeoutId);
      if (!logoResponse.ok) {
        console.warn(`Logo fetch failed (${logoResponse.status}):`, orgLogoUrl);
        return null;
      }
      return Buffer.from(await logoResponse.arrayBuffer());
    } catch (err) {
      clearTimeout(timeoutId);
      console.warn('Logo fetch error:', err);
      return null;
    }
  }

  console.warn('Logo URL not in allowlist and not a local path, skipping composite:', orgLogoUrl);
  return null;
}

async function uploadToOpeninary(buffer: Buffer, orgSlug: string): Promise<string> {
  const baseUrl = config.openinary.url;
  const apiKey = config.openinary.apiKey;

  if (!baseUrl || !apiKey) {
    throw new Error('OPENINARY_URL and OPENINARY_API_KEY must be set');
  }

  const form = new FormData();
  const blob = new Blob([buffer], { type: 'image/png' });
  form.append('file', blob, `qr-${orgSlug}.png`);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000);

  try {
    const cleanBase = baseUrl.replace(/\/+$/, '').replace(/\/api\/upload$/, '');
    const uploadUrl = `${cleanBase}/api/upload`;
    const response = await fetch(uploadUrl, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${apiKey}` },
      body: form,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Openinary responded ${response.status}: ${text}`);
    }

    const data: any = await response.json();
    const imageUrl: string = data.url || data.publicUrl || data.secure_url || data.src;
    if (!imageUrl) {
      throw new Error(`Openinary response missing URL field: ${JSON.stringify(data)}`);
    }

    console.log(`Openinary QR upload success: ${imageUrl}`);
    return imageUrl;
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
}

export async function generateAndUploadQRCode(
  orgSlug: string,
  orgLogoUrl?: string | null
): Promise<string | null> {
  try {
    const storefrontUrl = `${PRODUCTION_BASE_URL}/org/${orgSlug}`;
    const QR_SIZE = 600;

    const qrBuffer = await QRCode.toBuffer(storefrontUrl, {
      width: QR_SIZE,
      margin: 2,
      color: { dark: '#1a1a1a', light: '#ffffff' }
    });

    let finalBuffer: Buffer;

    if (orgLogoUrl) {
      try {
        const logoBuffer = await fetchLogoBuffer(orgLogoUrl);
        if (logoBuffer) {
          const qrImage = await Jimp.fromBuffer(qrBuffer);
          const logoImage = await Jimp.fromBuffer(logoBuffer);

          const logoSize = Math.round(QR_SIZE * 0.22);
          logoImage.resize({ w: logoSize, h: logoSize });

          const padSize = logoSize + 20;
          const padX = Math.round((QR_SIZE - padSize) / 2);
          const padY = Math.round((QR_SIZE - padSize) / 2);

          for (let py = padY; py < padY + padSize; py++) {
            for (let px = padX; px < padX + padSize; px++) {
              if (px >= 0 && px < QR_SIZE && py >= 0 && py < QR_SIZE) {
                qrImage.setPixelColor(0xffffffff, px, py);
              }
            }
          }

          const x = Math.round((QR_SIZE - logoSize) / 2);
          const y = Math.round((QR_SIZE - logoSize) / 2);
          qrImage.composite(logoImage, x, y);

          finalBuffer = await qrImage.getBuffer('image/png');
        } else {
          finalBuffer = qrBuffer;
        }
      } catch (logoError) {
        console.warn('Logo composite failed, using plain QR:', logoError);
        finalBuffer = qrBuffer;
      }
    } else {
      finalBuffer = qrBuffer;
    }

    if (config.storage.type === 'cloudinary') {
      const b64 = finalBuffer.toString('base64');
      const dataUri = `data:image/png;base64,${b64}`;
      const result = await cloudinary.uploader.upload(dataUri, {
        folder: 'qr-codes',
        public_id: `qr-${orgSlug}`,
        overwrite: true,
        resource_type: 'image'
      });
      return result.secure_url;
    } else if (config.storage.type === 'openinary') {
      return await uploadToOpeninary(finalBuffer, orgSlug);
    } else {
      const uploadsDir = config.storage.uploadDir;
      if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
      const filename = `qr-${orgSlug}.png`;
      const filePath = path.join(uploadsDir, filename);
      fs.writeFileSync(filePath, finalBuffer);
      return `/uploads/${filename}`;
    }
  } catch (error) {
    console.error('QR code generation error:', error);
    return null;
  }
}
