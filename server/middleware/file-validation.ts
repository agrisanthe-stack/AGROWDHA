import fs from 'fs';
import path from 'path';

export function validateUploadedFile(filePath: string): boolean {
  try {
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.error(`File validation failed: File does not exist at ${filePath}`);
      return false;
    }

    // Check file size (not empty)
    const stats = fs.statSync(filePath);
    if (stats.size === 0) {
      console.error(`File validation failed: File is empty at ${filePath}`);
      return false;
    }

    // Check file permissions (readable)
    try {
      fs.accessSync(filePath, fs.constants.R_OK);
    } catch (error) {
      console.error(`File validation failed: File not readable at ${filePath}`);
      return false;
    }

    return true;
  } catch (error) {
    console.error(`File validation error for ${filePath}:`, error);
    return false;
  }
}

export function ensureFileIntegrity(imageUrl: string): boolean {
  if (!imageUrl || !imageUrl.startsWith('/uploads/')) {
    return false;
  }
  
  const filename = path.basename(imageUrl);
  const filePath = path.join(process.cwd(), 'public', 'uploads', filename);
  
  return validateUploadedFile(filePath);
}

export function cleanupInvalidImageReferences(imageUrls: string[]): string[] {
  return imageUrls.filter(url => ensureFileIntegrity(url));
}