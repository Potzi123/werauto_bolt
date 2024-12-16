"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useProfile } from "@/lib/hooks/use-profile";
import { useSupabase } from "@/lib/supabase-provider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import type { Database } from "@/lib/database.types";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];
type Group = Database["public"]["Tables"]["groups"]["Row"];

export default function Admin() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const { profile } = useProfile();
  const { supabase } = useSupabase();
  const { toast } = useToast();

  useEffect(() => {
    if (profile?.is_admin) {
      fetchUsers();
      fetchGroups();
    }
  }, [profile]);

  const fetchUsers = async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive",
      });
    } else {
      setUsers(data || []);
    }
  };

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

  const toggleUserAdmin = async (userId: string, isAdmin: boolean) => {
    const { error } = await supabase
      .from("profiles")
      .update({ is_admin: isAdmin })
      .eq("id", userId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update user admin status",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "User admin status updated successfully",
      });
      fetchUsers();
    }
  };

  const deleteGroup = async (groupId: string) => {
    const { error } = await supabase
      .from("groups")
      .delete()
      .eq("id", groupId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete group",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Group deleted successfully",
      });
      fetchGroups();
    }
  };

  if (!profile?.is_admin) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-xl">You don't have permission to access this page.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {users.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">{user.username}</p>
                  <p className="text-sm text-muted-foreground">{user.location || "No location set"}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={user.is_admin}
                    onCheckedChange={(checked) => toggleUserAdmin(user.id, checked)}
                  />
                  <Label>Admin</Label>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Group Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {groups.map((group) => (
              <div key={group.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">{group.name}</p>
                  <p className="text-sm text-muted-foreground">{group.description}</p>
                </div>
                <Button
                  variant="destructive"
                  onClick={() => deleteGroup(group.id)}
                >
                  Delete Group
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}