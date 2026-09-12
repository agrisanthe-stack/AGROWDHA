import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Loader2 } from "lucide-react";
import { getCurrentUserLocation, formatDistance, LOCATION_CONSTANTS } from "@/lib/geolocation";

interface LocationCaptureProps {
  onLocationSet: (coordinates: { latitude: number; longitude: number }) => void;
  currentLocation?: { latitude: number; longitude: number } | null;
  className?: string;
}

export default function LocationCapture({
  onLocationSet,
  currentLocation,
  className = ""
}: LocationCaptureProps) {
  const { toast } = useToast();
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  // Auto-detect location when component mounts (if no location set)
  useEffect(() => {
    if (!currentLocation) {
      handleGetLocation(true); // Silent auto-detection
    }
  }, []);

  const handleGetLocation = async (silent = false) => {
    setIsGettingLocation(true);

    try {
      const location = await getCurrentUserLocation();
      
      if (location) {
        onLocationSet(location);
        
        if (!silent) {
          toast({
            title: "Location detected",
            description: `Showing products within ${LOCATION_CONSTANTS.MAX_RANGE_KM}km of your location`,
          });
        }
      } else {
        if (!silent) {
          toast({
            title: "Location access needed",
            description: "Please allow location access to see nearby farms and products",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      if (!silent) {
        toast({
          title: "Location error",
          description: "Failed to get your location. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsGettingLocation(false);
    }
  };


  return (
    <div className={className}>
      {currentLocation ? (
        // Location is set - show current location status
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-800">
                  Location Detected
                </span>
              </div>
              <span className="text-xs text-green-600">
                Showing farms within {LOCATION_CONSTANTS.MAX_RANGE_KM}km radius
              </span>
            </div>
          </CardContent>
        </Card>
      ) : (
        // No location - show detection in progress or failed state
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-blue-600" />
              <div>
                {isGettingLocation ? (
                  <>
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      <span className="text-sm font-medium text-blue-800">
                        Detecting your location...
                      </span>
                    </div>
                    <p className="text-xs text-blue-600">
                      This helps us show you farms within {LOCATION_CONSTANTS.MAX_RANGE_KM}km
                    </p>
                  </>
                ) : (
                  <>
                    <span className="text-sm font-medium text-blue-800">
                      Location access needed
                    </span>
                    <p className="text-xs text-blue-600">
                      Please allow location access to find farms near you within {LOCATION_CONSTANTS.MAX_RANGE_KM}km
                    </p>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}