"use client";

import { useEffect, useRef, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import { Card } from "@/components/ui/card";

interface RouteMapProps {
  origin: string;
  destinations: string[];
}

export function RouteMap({ origin, destinations }: RouteMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [directionsService, setDirectionsService] = useState<google.maps.DirectionsService | null>(
    null
  );
  const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer | null>(
    null
  );

  useEffect(() => {
    const initMap = async () => {
      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
        version: "weekly",
        libraries: ["places"],
      });

      const { Map } = await loader.importLibrary("maps");
      const { DirectionsService, DirectionsRenderer } = await loader.importLibrary("routes");

      if (mapRef.current && !map) {
        const newMap = new Map(mapRef.current, {
          center: { lat: 0, lng: 0 },
          zoom: 12,
        });
        setMap(newMap);
        setDirectionsService(new DirectionsService());
        setDirectionsRenderer(new DirectionsRenderer({ map: newMap }));
      }
    };

    initMap();
  }, [map]);

  useEffect(() => {
    if (!directionsService || !directionsRenderer || !origin || destinations.length === 0) return;

    const waypoints = destinations.slice(0, -1).map((destination) => ({
      location: destination,
      stopover: true,
    }));

    directionsService.route(
      {
        origin,
        destination: destinations[destinations.length - 1],
        waypoints,
        optimizeWaypoints: true,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === "OK" && result) {
          directionsRenderer.setDirections(result);
        }
      }
    );
  }, [origin, destinations, directionsService, directionsRenderer]);

  return (
    <Card className="w-full h-[400px] overflow-hidden">
      <div ref={mapRef} className="w-full h-full" />
    </Card>
  );
}