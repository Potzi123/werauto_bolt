"use client";

import { useState, useEffect } from "react";
import { useSupabase } from "@/lib/supabase-provider";
import { useToast } from "@/components/ui/use-toast";
import type { Database } from "@/lib/database.types";

type GroupMember = {
  profile: Database["public"]["Tables"]["profiles"]["Row"];
  status: 'driver' | 'passenger' | 'bus';
};

export function useRealtimeMembers(groupId: string | null) {
  const [members, setMembers] = useState<GroupMember[]>([]);
  const { supabase } = useSupabase();
  const { toast } = useToast();

  useEffect(() => {
    if (!groupId) return;

    const fetchMembers = async () => {
      const { data, error } = await supabase
        .from('group_members')
        .select(`
          user_id,
          profiles (*)
        `)
        .eq('group_id', groupId);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to fetch group members",
          variant: "destructive",
        });
        return;
      }

      const membersWithStatus = await Promise.all(
        data.map(async (member) => {
          const { data: rideData } = await supabase
            .from('rides')
            .select('status')
            .eq('driver_id', member.user_id)
            .eq('group_id', groupId)
            .single();

          return {
            profile: member.profiles,
            status: rideData?.status || 'passenger'
          };
        })
      );

      setMembers(membersWithStatus);
    };

    fetchMembers();

    // Subscribe to changes in group_members
    const membersChannel = supabase
      .channel('group-members')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'group_members',
          filter: `group_id=eq.${groupId}`
        },
        fetchMembers
      )
      .subscribe();

    // Subscribe to changes in rides
    const ridesChannel = supabase
      .channel('group-rides')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'rides',
          filter: `group_id=eq.${groupId}`
        },
        fetchMembers
      )
      .subscribe();

    // Subscribe to changes in profiles
    const profilesChannel = supabase
      .channel('member-profiles')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles'
        },
        fetchMembers
      )
      .subscribe();

    return () => {
      supabase.removeChannel(membersChannel);
      supabase.removeChannel(ridesChannel);
      supabase.removeChannel(profilesChannel);
    };
  }, [groupId, supabase, toast]);

  return members;
}