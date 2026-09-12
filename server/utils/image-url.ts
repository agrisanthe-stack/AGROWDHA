import { config } from '../config/environment';

/**
 * Turns image references stored by the app into fetchable URLs.
 *
 * Openinary commonly returns a path such as /t/image.jpg while Cloudinary
 * returns an absolute URL. Keep absolute URLs untouched and resolve relative
 * Openinary paths against the configured Openinary host.
 */
export function resolveStoredImageUrl(imageUrl: string | null | undefined): string | null {
  if (!imageUrl || typeof imageUrl !== 'string') return null;

  const trimmed = imageUrl.trim();
  if (!trimmed) return null;

  try {
    return new URL(trimmed).toString();
  } catch {
    // Relative Openinary/local paths are expected here.
  }

  if (trimmed.startsWith('/uploads/')) {
    return trimmed;
  }

  if (config.openinary.url) {
    try {
      return new URL(trimmed.startsWith('/') ? trimmed : `/${trimmed}`, config.openinary.url).toString();
    } catch {
      // Fall through and let callers report an unavailable image.
    }
  }

  return trimmed;
}