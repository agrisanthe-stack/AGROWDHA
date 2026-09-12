/**
 * Geolocation utility functions for distance calculations
 */

export interface Coordinates {
  latitude: number;
  longitude: number;
}

/**
 * Calculate the distance between two coordinates using the Haversine formula
 * @param point1 First coordinate point
 * @param point2 Second coordinate point
 * @returns Distance in kilometers
 */
export function calculateDistance(point1: Coordinates, point2: Coordinates): number {
  const R = 6371; // Earth's radius in kilometers
  
  const dLat = toRadians(point2.latitude - point1.latitude);
  const dLon = toRadians(point2.longitude - point1.longitude);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(point1.latitude)) * Math.cos(toRadians(point2.latitude)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
  return R * c; // Distance in kilometers
}

/**
 * Convert degrees to radians
 */
function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Check if two coordinates are within a specified distance range
 * @param point1 First coordinate point
 * @param point2 Second coordinate point
 * @param maxDistanceKm Maximum distance in kilometers
 * @returns boolean indicating if points are within range
 */
export function isWithinRange(
  point1: Coordinates, 
  point2: Coordinates, 
  maxDistanceKm: number
): boolean {
  const distance = calculateDistance(point1, point2);
  return distance <= maxDistanceKm;
}

/**
 * Get current user location using browser's Geolocation API
 * @returns Promise resolving to user coordinates or null if failed
 */
export function getCurrentUserLocation(): Promise<Coordinates | null> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(null);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      },
      () => {
        resolve(null);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    );
  });
}

/**
 * Filter an array of items with coordinates by distance from a reference point
 * @param items Array of items with coordinate properties
 * @param userLocation User's coordinates
 * @param maxDistanceKm Maximum distance in kilometers
 * @param getCoordinates Function to extract coordinates from each item
 * @returns Filtered array of items within range, with distance added
 */
export function filterByDistance<T>(
  items: T[],
  userLocation: Coordinates,
  maxDistanceKm: number,
  getCoordinates: (item: T) => Coordinates | null
): (T & { distance: number })[] {
  return items
    .map(item => {
      const coordinates = getCoordinates(item);
      if (!coordinates) return null;
      
      const distance = calculateDistance(userLocation, coordinates);
      return {
        ...item,
        distance
      };
    })
    .filter((item): item is T & { distance: number } => 
      item !== null && item.distance <= maxDistanceKm
    )
    .sort((a, b) => a.distance - b.distance); // Sort by distance, closest first
}

/**
 * Format distance for display
 * @param distanceKm Distance in kilometers
 * @returns Formatted distance string
 */
export function formatDistance(distanceKm: number): string {
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)}m`;
  } else if (distanceKm < 10) {
    return `${distanceKm.toFixed(1)}km`;
  } else {
    return `${Math.round(distanceKm)}km`;
  }
}

/**
 * Constants for the application
 */
export const LOCATION_CONSTANTS = {
  MAX_RANGE_KM: 150,
  DEFAULT_COORDINATES: {
    // Default to Bangalore, India coordinates if no location available
    latitude: 12.9716,
    longitude: 77.5946
  }
} as const;