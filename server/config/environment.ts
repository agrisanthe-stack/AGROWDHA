import dotenv from 'dotenv';
import path from 'path';

// Determine environment mode
const nodeEnv = process.env.NODE_ENV || 'development';

// Load appropriate environment variables
if (nodeEnv === 'production') {
  dotenv.config({ path: path.resolve(process.cwd(), '.env.production') });
} else {
  dotenv.config({ path: path.resolve(process.cwd(), '.env.development') });
}

// Determine which storage backend to use based on env vars
function resolveStorageType(): string {
  if (process.env.OPENINARY_URL && process.env.OPENINARY_API_KEY) return 'openinary';
  if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) return 'cloudinary';
  return 'local';
}

export const config = {
  nodeEnv,
  database: {
    url: process.env.NEON_DATABASE_URL || process.env.DATABASE_URL
  },
  storage: {
    type: resolveStorageType(),
    uploadDir: path.join(process.cwd(), 'public', 'uploads')
  },
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET
  },
  openinary: {
    url: process.env.OPENINARY_URL,       // e.g. http://localhost:3000
    apiKey: process.env.OPENINARY_API_KEY  // generated in Openinary dashboard
  },
  server: {
    port: process.env.PORT || 5000
  },
  qrCode: {
    extraLogoHosts: (process.env.QR_LOGO_EXTRA_HOSTS || '')
      .split(',')
      .map(h => h.trim())
      .filter(Boolean)
  }
};

export default config;