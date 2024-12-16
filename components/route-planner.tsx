"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { RouteMap } from './route-map';
import type { Database } from "@/lib/database.types";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];
type GroupMember = {
  profile: Profile;
  status: 'driver' | 'passenger' | 'bus';
};

interface RoutePlannerProps {
  groupMembers: GroupMember[];
  destination: string;
  driverId: string;
}

export function RoutePlanner({ groupMembers, destination, driverId }: RoutePlannerProps) {
  const [optimizedRoute, setOptimizedRoute] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    calculateRoute();
  }, [groupMembers, destination]);

  const calculateRoute = () => {
    // Filter out the driver and bus riders
    const passengers = groupMembers.filter(
      member => member.status === 'passenger' && member.profile.location
    );

    // Get the driver's location
    const driver = groupMembers.find(member => member.profile.id === driverId);
    
    if (!driver?.profile.location) {
      toast({
        title: "Error",
        description: "Driver location not set",
        variant: "destructive",
      });
      return;
    }

    // Create route array starting with driver's location
    const route = [driver.profile.location];
    
    // Add passenger locations
    passengers.forEach(passenger => {
      if (passenger.profile.location) {
        route.push(passenger.profile.location);
      }
    });

    // Add final destination
    route.push(destination);
    
    setOptimizedRoute(route);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Optimized Route</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="h-[400px]">
          <RouteMap
            origin={optimizedRoute[0] || ''}
            destinations={optimizedRoute.slice(1)}
          />
        </div>
        <div className="space-y-2">
          <h3 className="font-semibold">Route Details:</h3>
          <ol className="list-decimal list-inside space-y-1">
            {optimizedRoute.map((location, index) => (
              <li key={index} className="text-sm">
                {index === 0 && "Start: "}
                {index === optimizedRoute.length - 1 && "Destination: "}
                {location}
              </li>
            ))}
          </ol>
        </div>
      </CardContent>
    </Card>
  );
}