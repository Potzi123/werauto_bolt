"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";

export function useLocationPermission() {
  const [permission, setPermission] = useState<PermissionState>("prompt");
  const { toast } = useToast();

  const requestPermission = async () => {
    if (!("geolocation" in navigator)) {
      toast({
        title: "Error",
        description: "Geolocation is not supported by your browser",
        variant: "destructive",
      });
      return false;
    }

    try {
      const result = await navigator.permissions.query({ name: "geolocation" });
      setPermission(result.state);

      if (result.state === "granted") {
        return true;
      }

      if (result.state === "prompt") {
        // Trigger the permission prompt by requesting position once
        await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });
        setPermission("granted");
        return true;
      }

      if (result.state === "denied") {
        toast({
          title: "Permission Denied",
          description: "Please enable location access in your browser settings",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      console.error("Error requesting location permission:", error);
      return false;
    }
  };

  return { permission, requestPermission };
}