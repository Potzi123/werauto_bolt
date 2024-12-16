"use client";

import { useEffect, useRef, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import { useProfile } from "@/lib/hooks/use-profile";

interface MapComponentProps {
  location: string | null;
}

export function MapComponent({ location }: MapComponentProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [marker, setMarker] = useState<google.maps.Marker | null>(null);
  const { profile } = useProfile();

  useEffect(() => {
    const initMap = async () => {
      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
        version: "weekly",
      });

      const { Map } = await loader.importLibrary("maps");

      if (mapRef.current && !map) {
        const initialMap = new Map(mapRef.current, {
          center: { lat: 0, lng: 0 },
          zoom: 12,
          styles: [
            {
              featureType: "poi",
              elementType: "labels",
              stylers: [{ visibility: "off" }],
            },
          ],
        });
        setMap(initialMap);
      }
    };

    initMap();
  }, [map]);

  useEffect(() => {
    if (map && location) {
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ address: location }, (results, status) => {
        if (status === "OK" && results?.[0]) {
          const position = results[0].geometry.location;
          map.setCenter(position);
          
          // Update or create marker
          if (marker) {
            marker.setPosition(position);
          } else {
            const newMarker = new google.maps.Marker({
              position,
              map,
              title: "Your Location",
              animation: google.maps.Animation.DROP,
              icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 10,
                fillColor: "#1E40AF",
                fillOpacity: 1,
                strokeColor: "#FFFFFF",
                strokeWeight: 2,
              },
            });
            setMarker(newMarker);
          }
        }
      });
    }
  }, [map, location, marker]);

  return <div ref={mapRef} className="w-full h-full rounded-lg shadow-lg" />;
}