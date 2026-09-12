import { useState, useEffect } from 'react';

interface LocationData {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

interface LocationState {
  location: LocationData | null;
  loading: boolean;
  error: string | null;
  permission: 'granted' | 'denied' | 'prompt' | null;
}

export function useLocation() {
  const [state, setState] = useState<LocationState>({
    location: null,
    loading: false,
    error: null,
    permission: null
  });

  const requestLocation = async () => {
    if (!navigator.geolocation) {
      setState(prev => ({
        ...prev,
        error: 'Geolocation is not supported by this browser',
        loading: false
      }));
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      // Check current permission status
      if ('permissions' in navigator) {
        const permission = await navigator.permissions.query({ name: 'geolocation' });
        setState(prev => ({ ...prev, permission: permission.state }));
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          setState({
            location: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracy: position.coords.accuracy
            },
            loading: false,
            error: null,
            permission: 'granted'
          });
        },
        (error) => {
          let errorMessage = 'Failed to get location';
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location access denied by user';
              setState(prev => ({ ...prev, permission: 'denied' }));
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information unavailable';
              break;
            case error.TIMEOUT:
              errorMessage = 'Location request timed out';
              break;
          }
          setState(prev => ({
            ...prev,
            error: errorMessage,
            loading: false
          }));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      );
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Failed to request location permission',
        loading: false
      }));
    }
  };

  return {
    ...state,
    requestLocation
  };
}