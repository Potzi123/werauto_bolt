"use client";

import { useEffect, useState } from "react";
import { useSupabase } from "@/lib/supabase-provider";
import { useToast } from "@/components/ui/use-toast";
import type { Database } from "@/lib/database.types";

type Ride = Database["public"]["Tables"]["rides"]["Row"];

export function useRides() {
  const { supabase } = useSupabase();
  const { toast } = useToast();
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRides = async () => {
      try {
        const { data, error } = await supabase
          .from("rides")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;
        setRides(data || []);
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRides();

    // Subscribe to changes
    const channel = supabase
      .channel("rides")
      .on("postgres_changes", { event: "*", schema: "public", table: "rides" }, fetchRides)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, toast]);

  const createRide = async (ride: Omit<Ride, "id" | "created_at">) => {
    try {
      const { error } = await supabase
        .from("rides")
        .insert([ride]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Ride created successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  return { rides, loading, createRide };
}