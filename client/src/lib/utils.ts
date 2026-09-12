import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, parseISO } from "date-fns"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a date string into a human-readable format
 * @param dateString - ISO date string or Date object
 * @param formatStr - format string for date-fns (default: 'MMM dd, yyyy')
 * @returns Formatted date string
 */
export function formatDate(dateString?: string | Date | null, formatStr = 'MMM dd, yyyy'): string {
  if (!dateString) return '';
  
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
    return format(date, formatStr);
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
}

/**
 * Downloads an image as a file.
 * For external (cross-origin) URLs the request is routed through the backend
 * proxy at /api/image-download-proxy so the browser never has to make a
 * cross-origin fetch (which Cloudinary / Openinary block via CORS).
 * Local /uploads/ paths are fetched directly.
 */
export async function downloadImageAsBlob(url: string, filename: string): Promise<void> {
  const fetchUrl = url.startsWith('/') ? url : `/api/image-download-proxy?url=${encodeURIComponent(url)}`;
  const response = await fetch(fetchUrl);
  if (!response.ok) throw new Error(`Failed to fetch image: ${response.status}`);
  const blob = await response.blob();
  const objectUrl = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = objectUrl;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(objectUrl);
}

/**
 * Formats a number as Indian currency (₹)
 * @param amount - Number to format as currency
 * @returns Formatted currency string
 */
export function formatIndianCurrency(amount: number | string): string {
  // Convert to number if string
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  // Format with Indian locale and currency symbol
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numericAmount);
}
