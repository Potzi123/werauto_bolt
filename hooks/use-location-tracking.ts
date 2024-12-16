"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useProfile } from "@/lib/hooks/use-profile";
import { useSupabase } from "@/lib/supabase-provider";

export function useLocationTracking() {
  const [isTracking, setIsTracking] = useState(false);
  const [watchId, setWatchId] = useState<number | null>(null);
  const { toast } = useToast();
  const { profile, updateProfile } = useProfile();
  const { supabase } = useSupabase();

  const updateLocation = async (position: GeolocationPosition) => {
    const { latitude, longitude } = position.coords;
    try {
      // Get address from coordinates using Google Maps Geocoding API
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
      );
      const data = await response.json();
      const address = data.results[0]?.formatted_address;

      if (address) {
        await updateProfile({ location: address });
      }
    } catch (error) {
      console.error("Failed to update location:", error);
    }
  };

  const handleError = (error: GeolocationPositionError) => {
    toast({
      title: "Location Error",
      description: error.message,
      variant: "destructive",
    });
    setIsTracking(false);
  };

  const toggleTracking = () => {
    if (!isTracking) {
      if ("geolocation" in navigator) {
        const id = navigator.geolocation.watchPosition(updateLocation, handleError, {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        });
        setWatchId(id);
        setIsTracking(true);
        toast({
          title: "Location Tracking",
          description: "Location tracking enabled",
        });
      } else {
        toast({
          title: "Error",
          description: "Geolocation is not supported by your browser",
          variant: "destructive",
        });
      }
    } else {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
        setWatchId(null);
      }
      setIsTracking(false);
      toast({
        title: "Location Tracking",
        description: "Location tracking disabled",
      });
    }
  };

  useEffect(() => {
    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [watchId]);

  return { isTracking, toggleTracking };
}