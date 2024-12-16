"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useProfile } from "@/lib/hooks/use-profile";
import { Badge } from "@/components/ui/badge";
import { useSupabase } from "@/lib/supabase-provider";
import { CreateGroupDialog } from "./create-group-dialog";
import type { Database } from "@/lib/database.types";

type Group = Database["public"]["Tables"]["groups"]["Row"];

export default function Groups() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [userGroups, setUserGroups] = useState<string[]>([]);
  const { profile } = useProfile();
  const { supabase } = useSupabase();
  const { toast } = useToast();

  useEffect(() => {
    fetchGroups();
    if (profile) {
      fetchUserGroups();
    }
  }, [profile]);

  const fetchGroups = async () => {
    const { data, error } = await supabase
      .from("groups")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch groups",
        variant: "destructive",
      });
    } else {
      setGroups(data || []);
    }
  };

  const fetchUserGroups = async () => {
    const { data, error } = await supabase
      .from("group_members")
      .select("group_id")
      .eq("user_id", profile?.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch user groups",
        variant: "destructive",
      });
    } else {
      setUserGroups(data.map(member => member.group_id));
    }
  };

  const joinGroup = async (groupId: string) => {
    if (userGroups.includes(groupId)) {
      toast({
        title: "Error",
        description: "You are already a member of this group",
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase
      .from("group_members")
      .insert([
        {
          group_id: groupId,
          user_id: profile?.id,
        },
      ]);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to join group",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Joined group successfully",
      });
      fetchUserGroups();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Groups</h1>
        <CreateGroupDialog />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {groups.map((group) => (
          <Card key={group.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle>{group.name}</CardTitle>
                {userGroups.includes(group.id) && (
                  <Badge variant="secondary">Member</Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">{group.description}</p>
              <p className="text-sm font-medium mb-4">
                Destination: {group.destination}
              </p>
              <Button 
                onClick={() => joinGroup(group.id)} 
                variant="outline" 
                className="w-full"
                disabled={userGroups.includes(group.id)}
              >
                {userGroups.includes(group.id) ? "Already Joined" : "Join Group"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}