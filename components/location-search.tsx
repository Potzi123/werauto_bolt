"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";

interface LocationSearchProps {
  onLocationSelect: (location: string) => void;
  initialLocation?: string;
  placeholder?: string;
}

interface Prediction {
  description: string;
  place_id: string;
}

export function LocationSearch({ 
  onLocationSelect, 
  initialLocation = "", 
  placeholder = "Search location..."
}: LocationSearchProps) {
  const [search, setSearch] = useState(initialLocation);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(false);
  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    const fetchPredictions = async () => {
      if (!debouncedSearch) {
        setPredictions([]);
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(
          `/api/places/autocomplete?input=${encodeURIComponent(debouncedSearch)}`
        );
        const data = await response.json();
        setPredictions(data.predictions || []);
      } catch (error) {
        console.error("Failed to fetch predictions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPredictions();
  }, [debouncedSearch]);

  const handleSelect = (prediction: Prediction) => {
    setSearch(prediction.description);
    setPredictions([]);
    onLocationSelect(prediction.description);
  };

  return (
    <div className="relative">
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder={placeholder}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full"
        />
        {loading && <Loader2 className="animate-spin" />}
      </div>
      {predictions.length > 0 && (
        <Card className="absolute z-10 w-full mt-1 max-h-60 overflow-auto">
          <div className="p-2">
            {predictions.map((prediction) => (
              <Button
                key={prediction.place_id}
                variant="ghost"
                className="w-full justify-start text-left"
                onClick={() => handleSelect(prediction)}
              >
                {prediction.description}
              </Button>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}