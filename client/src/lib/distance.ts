// Haversine formula to calculate distance between two points on Earth
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in kilometers
  
  return Math.round(distance * 10) / 10; // Round to 1 decimal place
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}

// Parse location string to coordinates
export function parseLocationToCoords(location: string): { lat: number; lng: number } | null {
  // Common Indian locations with approximate coordinates
  const locationMap: Record<string, { lat: number; lng: number }> = {
    'Punjab, India': { lat: 31.1471, lng: 75.3412 },
    'Himachal Pradesh, India': { lat: 31.1048, lng: 77.1734 },
    'Gujarat, India': { lat: 22.2587, lng: 71.1924 },
    'Uttarakhand, India': { lat: 30.0668, lng: 79.0193 },
    'Rajasthan, India': { lat: 27.0238, lng: 74.2179 },
    'Maharashtra, India': { lat: 19.7515, lng: 75.7139 },
    'Karnataka, India': { lat: 15.3173, lng: 75.7139 },
    'Delhi, India': { lat: 28.7041, lng: 77.1025 },
    'Mumbai, India': { lat: 19.0760, lng: 72.8777 },
    'Bangalore, India': { lat: 12.9716, lng: 77.5946 },
    'Chennai, India': { lat: 13.0827, lng: 80.2707 },
    'Kolkata, India': { lat: 22.5726, lng: 88.3639 },
    'Hyderabad, India': { lat: 17.3850, lng: 78.4867 },
    'Pune, India': { lat: 18.5204, lng: 73.8567 },
    'Ahmedabad, India': { lat: 23.0225, lng: 72.5714 }
  };

  // Try exact match first
  if (locationMap[location]) {
    return locationMap[location];
  }

  // Try partial matches
  for (const [key, coords] of Object.entries(locationMap)) {
    if (location.toLowerCase().includes(key.toLowerCase()) || 
        key.toLowerCase().includes(location.toLowerCase())) {
      return coords;
    }
  }

  return null;
}

export function formatDistance(distanceKm: number): string {
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)}m away`;
  } else if (distanceKm < 10) {
    return `${distanceKm.toFixed(1)} km away`;
  } else {
    return `${Math.round(distanceKm)} km away`;
  }
}