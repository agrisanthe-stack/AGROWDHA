import multer from 'multer';
import path from 'path';
import fs from 'fs';
import http from 'http';
import https from 'https';
import { v2 as cloudinary } from 'cloudinary';
import { config } from '../config/environment';

// Configure Cloudinary (only when credentials are present)
if (config.storage.type === 'cloudinary') {
  cloudinary.config({
    cloud_name: config.cloudinary.cloudName,
    api_key: config.cloudinary.apiKey,
    api_secret: config.cloudinary.apiSecret
  });
}

// Multer always saves to disk first (then we forward to the chosen backend)
const localStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

export const upload = multer({
  storage: localStorage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

export class StorageService {
  static async uploadImage(file: Express.Multer.File, folder?: string): Promise<string> {
    if (config.storage.type === 'cloudinary') {
      return this.uploadToCloudinary(file, folder);
    } else if (config.storage.type === 'openinary') {
      return this.uploadToOpeninary(file);
    } else {
      return this.uploadLocally(file);
    }
  }

  // ─── Cloudinary ────────────────────────────────────────────────────────────
  private static async uploadToCloudinary(file: Express.Multer.File, folder?: string): Promise<string> {
    try {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: folder || 'santhe',
        resource_type: 'image',
        use_filename: true,
        unique_filename: true
      });

      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }

      return result.secure_url;
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      throw new Error('Failed to upload image to Cloudinary');
    }
  }

  // ─── Openinary (self-hosted) ────────────────────────────────────────────────
  // Uses raw Node http.request with manually constructed multipart body.
  // This gives us byte-perfect control and an explicit Content-Length header,
  // avoiding all known issues with node-fetch, form-data, and native FormData.
  private static uploadToOpeninary(file: Express.Multer.File): Promise<string> {
    const baseUrl = config.openinary.url;
    const apiKey  = config.openinary.apiKey;

    if (!baseUrl || !apiKey) {
      return Promise.reject(new Error('OPENINARY_URL and OPENINARY_API_KEY must be set'));
    }

    if (!fs.existsSync(file.path)) {
      return Promise.reject(new Error(`Upload failed: temp file not found at ${file.path}`));
    }
    const fileSize = fs.statSync(file.path).size;
    if (fileSize === 0) {
      return Promise.reject(new Error(`Upload failed: temp file is empty at ${file.path}`));
    }

    const cleanBase = baseUrl.replace(/\/+$/, '').replace(/\/api\/upload$/, '');
    const uploadUrl = `${cleanBase}/api/upload`;
    console.log(`[Openinary] Uploading ${file.originalname} (${fileSize} bytes) → ${uploadUrl}`);

    return new Promise((resolve, reject) => {
      const fileBuffer = fs.readFileSync(file.path);

      // Build raw multipart body
      const boundary = `SantheBoundary${Date.now()}${Math.random().toString(36).slice(2)}`;
      const partHeader = Buffer.from(
        `--${boundary}\r\n` +
        `Content-Disposition: form-data; name="files"; filename="${file.originalname}"\r\n` +
        `Content-Type: ${file.mimetype}\r\n` +
        `\r\n`
      );
      const partFooter = Buffer.from(`\r\n--${boundary}--\r\n`);
      const body = Buffer.concat([partHeader, fileBuffer, partFooter]);

      const parsedUrl = new URL(uploadUrl);
      const transport = parsedUrl.protocol === 'https:' ? https : http;

      const options = {
        hostname: parsedUrl.hostname,
        port: parsedUrl.port ? parseInt(parsedUrl.port) : (parsedUrl.protocol === 'https:' ? 443 : 80),
        path: parsedUrl.pathname + (parsedUrl.search || ''),
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': `multipart/form-data; boundary=${boundary}`,
          'Content-Length': body.length,
        },
      };

      const req = transport.request(options, (res) => {
        const chunks: Buffer[] = [];
        res.on('data', (chunk: Buffer) => chunks.push(chunk));
        res.on('end', () => {
          const responseText = Buffer.concat(chunks).toString('utf8');
          console.log(`[Openinary] Response ${res.statusCode}: ${responseText}`);

          // Clean up temp file
          if (fs.existsSync(file.path)) fs.unlinkSync(file.path);

          if (res.statusCode !== 200 && res.statusCode !== 201) {
            return reject(new Error(`Openinary responded ${res.statusCode}: ${responseText}`));
          }

          let data: any;
          try { data = JSON.parse(responseText); }
          catch { return reject(new Error(`Openinary returned non-JSON: ${responseText}`)); }

          // Openinary returns { success:true, files:[{ url:"/t/filename.jpg", ... }] }
          const relativePath: string =
            data.files?.[0]?.url ||   // normal Openinary response
            data.url || data.publicUrl || data.secure_url || data.src;

          if (!relativePath) {
            return reject(new Error(`Openinary response missing URL field: ${JSON.stringify(data)}`));
          }

          // Build the publicly accessible URL.
          // The path from Openinary is relative (e.g. "/t/foo.jpg").
          // Nginx proxies /t/ → http://openinary:3000/t/ so we just store the relative path.
          const imageUrl = relativePath.startsWith('http') ? relativePath : relativePath;

          console.log(`[Openinary] Upload success: ${imageUrl}`);
          resolve(imageUrl);
        });
      });

      req.on('error', (err) => {
        if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
        console.error('[Openinary] Request error:', err);
        reject(new Error(`Failed to upload image to Openinary: ${err.message}`));
      });

      req.write(body);
      req.end();
    });
  }

  // ─── Local disk ────────────────────────────────────────────────────────────
  private static uploadLocally(file: Express.Multer.File): string {
    const filePath = file.path;
    if (!fs.existsSync(filePath)) {
      throw new Error(`Upload failed: File not saved to ${filePath}`);
    }
    const stats = fs.statSync(filePath);
    if (stats.size === 0) {
      throw new Error(`Upload failed: File is empty at ${filePath}`);
    }
    console.log(`File saved locally: ${file.filename} (${stats.size} bytes)`);
    return `/uploads/${file.filename}`;
  }

  // ─── Delete ────────────────────────────────────────────────────────────────
  static async deleteImage(imageUrl: string): Promise<void> {
    if (!imageUrl) return;

    if (config.storage.type === 'cloudinary' && imageUrl.includes('cloudinary.com')) {
      // ── Cloudinary ──
      const urlParts = imageUrl.split('/');
      const filename = urlParts[urlParts.length - 1];
      const publicId = filename.split('.')[0];
      const folder = urlParts[urlParts.length - 2];
      const fullPublicId = folder ? `${folder}/${publicId}` : publicId;
      try {
        await cloudinary.uploader.destroy(fullPublicId);
        console.log(`[Cloudinary] Deleted: ${fullPublicId}`);
      } catch (error) {
        console.error('[Cloudinary] Delete error:', error);
      }

    } else if (config.storage.type === 'openinary' && config.openinary.url && config.openinary.apiKey) {
      // ── Openinary ──
      // Image URLs look like: http://openinary:3000/.../filename.jpg
      // Delete endpoint:      DELETE /api/images/:id  (id = filename without extension)
      try {
        const urlParts = imageUrl.split('/');
        const filenameWithExt = urlParts[urlParts.length - 1];
        const imageId = filenameWithExt.split('.')[0]; // strip extension

        const cleanBase = config.openinary.url.replace(/\/+$/, '').replace(/\/api\/upload$/, '');
        const deleteUrl = `${cleanBase}/api/images/${imageId}`;

        console.log(`[Openinary] Deleting image id=${imageId} → ${deleteUrl}`);

        const response = await (globalThis as any).fetch(deleteUrl, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${config.openinary.apiKey}` },
        });

        const responseText = await response.text();
        if (response.ok) {
          console.log(`[Openinary] Deleted: ${imageId}`);
        } else {
          console.warn(`[Openinary] Delete responded ${response.status}: ${responseText}`);
        }
      } catch (error) {
        console.error('[Openinary] Delete error:', error);
      }

    } else if (imageUrl.startsWith('/uploads/')) {
      // ── Local disk ──
      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      const filePath = path.join(uploadDir, path.basename(imageUrl));
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log(`[Local] Deleted: ${filePath}`);
      }
    }
  }

  static getImageUrl(imagePath: string): string {
    return imagePath;
  }
}

export default StorageService;
