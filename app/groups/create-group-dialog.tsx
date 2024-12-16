"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LocationSearch } from "@/components/location-search";
import { useToast } from "@/components/ui/use-toast";
import { useSupabase } from "@/lib/supabase-provider";
import { useProfile } from "@/lib/hooks/use-profile";

export function CreateGroupDialog() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [destination, setDestination] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { profile } = useProfile();
  const { supabase } = useSupabase();
  const { toast } = useToast();

  const handleCreate = async () => {
    if (!name.trim() || !description.trim() || !destination.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from("groups")
        .insert([
          {
            name,
            description,
            destination,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      if (data) {
        await supabase.from("group_members").insert([
          {
            group_id: data.id,
            user_id: profile?.id,
          },
        ]);
      }

      toast({
        title: "Success",
        description: "Group created successfully",
      });

      setName("");
      setDescription("");
      setDestination("");
      setIsOpen(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Create New Group</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Group</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Group Name</label>
            <Input
              placeholder="Enter group name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Input
              placeholder="Enter group description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Destination</label>
            <LocationSearch
              onLocationSelect={(location) => setDestination(location)}
              initialLocation=""
              placeholder="Search for a destination..."
            />
          </div>
          <Button onClick={handleCreate} className="w-full">
            Create Group
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}