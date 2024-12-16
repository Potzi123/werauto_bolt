"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSupabase } from "@/lib/supabase-provider";
import { useToast } from "@/components/ui/use-toast";
import { useLocationPermission } from "@/hooks/use-location-permission";
import { useProfile } from "@/lib/hooks/use-profile";
import { GroupMembersList } from "@/components/group-members-list";
import { RoutePlanner } from "@/components/route-planner";
import { useRealtimeMembers } from "@/hooks/use-realtime-members";
import type { Database } from "@/lib/database.types";

type Group = Database["public"]["Tables"]["groups"]["Row"];

export default function Dashboard() {
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [userGroups, setUserGroups] = useState<Group[]>([]);
  const [rideStatus, setRideStatus] = useState<'driver' | 'passenger' | 'bus'>('passenger');
  const { profile } = useProfile();
  const { permission, requestPermission } = useLocationPermission();
  const { supabase } = useSupabase();
  const { toast } = useToast();
  
  // Use the real-time members hook
  const groupMembers = useRealtimeMembers(selectedGroup?.id || null);

  useEffect(() => {
    requestPermission();
    if (profile) {
      fetchUserGroups();
    }
  }, [profile]);

  const fetchUserGroups = async () => {
    const { data, error } = await supabase
      .from('group_members')
      .select(`
        group_id,
        groups (*)
      `)
      .eq('user_id', profile?.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch groups",
        variant: "destructive",
      });
    } else {
      const groups = data.map(item => item.groups).filter(Boolean);
      setUserGroups(groups);
      if (groups.length > 0 && !selectedGroup) {
        setSelectedGroup(groups[0]);
      }
    }
  };

  const updateRideStatus = async (status: 'driver' | 'passenger' | 'bus') => {
    if (!profile?.location) {
      toast({
        title: "Error",
        description: "Please set your location in settings first",
        variant: "destructive",
      });
      return;
    }

    try {
      await supabase
        .from('rides')
        .upsert({
          driver_id: profile.id,
          status,
          group_id: selectedGroup?.id || null,
          departure_location: profile.location,
          arrival_location: selectedGroup?.destination || '',
          departure_time: new Date().toISOString(),
        });

      setRideStatus(status);

      toast({
        title: "Success",
        description: "Ride status updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Select Group</CardTitle>
        </CardHeader>
        <CardContent>
          <Select
            value={selectedGroup?.id}
            onValueChange={(value) => {
              const group = userGroups.find(g => g.id === value);
              setSelectedGroup(group || null);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a group" />
            </SelectTrigger>
            <SelectContent>
              {userGroups.map((group) => (
                <SelectItem key={group.id} value={group.id}>
                  {group.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {selectedGroup && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Your Ride Status</CardTitle>
            </CardHeader>
            <CardContent>
              <Select
                value={rideStatus}
                onValueChange={(value: 'driver' | 'passenger' | 'bus') => updateRideStatus(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your ride type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="driver">I'm driving</SelectItem>
                  <SelectItem value="passenger">I need a ride</SelectItem>
                  <SelectItem value="bus">I'm taking the bus</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <GroupMembersList
            members={groupMembers}
            groupName={selectedGroup.name}
          />

          {rideStatus === 'driver' && (
            <RoutePlanner
              groupMembers={groupMembers}
              destination={selectedGroup.destination}
              driverId={profile?.id || ''}
            />
          )}
        </>
      )}
    </div>
  );
}