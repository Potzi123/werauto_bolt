"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useProfile } from "@/lib/hooks/use-profile";
import { LocationSearch } from "@/components/location-search";
import { useLocationTracking } from "@/hooks/use-location-tracking";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function Settings() {
  const { profile, updateProfile } = useProfile();
  const { toast } = useToast();
  const [username, setUsername] = useState(profile?.username || "");
  const [car, setCar] = useState(profile?.car || "");
  const { isTracking, toggleTracking } = useLocationTracking();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile({
        username,
        car,
      });
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error) {
      // Error handling is done in updateProfile
    }
  };

  const handleLocationSelect = async (location: string) => {
    try {
      await updateProfile({
        location,
      });
      toast({
        title: "Success",
        description: "Location updated successfully",
      });
    } catch (error) {
      // Error handling is done in updateProfile
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Username</Label>
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
              />
            </div>
            <div className="space-y-2">
              <Label>Car</Label>
              <Input
                value={car}
                onChange={(e) => setCar(e.target.value)}
                placeholder="Car model (e.g., Toyota Camry)"
              />
            </div>
            <Button type="submit">Save Changes</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Location Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Home Location</Label>
            <LocationSearch
              onLocationSelect={handleLocationSelect}
              initialLocation={profile?.location || ""}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              checked={isTracking}
              onCheckedChange={toggleTracking}
              id="location-tracking"
            />
            <Label htmlFor="location-tracking">Enable real-time location tracking</Label>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}