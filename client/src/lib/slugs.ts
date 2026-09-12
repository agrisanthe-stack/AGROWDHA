/**
 * Generate a URL-friendly slug from a string
 */
export function createSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Generate a product slug with ID for uniqueness
 */
export function createProductSlug(id: number, name: string, category?: string): string {
  const nameSlug = createSlug(name);
  const categorySlug = category ? createSlug(category) : '';
  
  if (categorySlug) {
    return `${categorySlug}-${nameSlug}-${id}`;
  }
  return `${nameSlug}-${id}`;
}

/**
 * Extract ID from a product slug
 */
export function extractIdFromSlug(slug: string): number | null {
  if (!slug) return null;
  const match = slug.match(/-(\d+)$/);
  return match ? parseInt(match[1], 10) : null;
}

/**
 * Generate a farmer slug with ID for uniqueness
 */
export function createFarmerSlug(id: number, farmName: string, location?: string): string {
  const nameSlug = createSlug(farmName);
  const locationSlug = location ? createSlug(location) : '';
  
  if (locationSlug) {
    return `${nameSlug}-${locationSlug}-${id}`;
  }
  return `${nameSlug}-${id}`;
}