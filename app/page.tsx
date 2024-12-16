import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Car } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center text-center">
      <Car className="h-20 w-20 mb-8" />
      <h1 className="text-4xl font-bold mb-4">Welcome to CarPool</h1>
      <p className="text-xl text-muted-foreground mb-8 max-w-lg">
        Connect with fellow commuters, share rides, and make your daily commute more efficient and environmentally friendly.
      </p>
      <div className="flex gap-4">
        <Link href="/login">
          <Button size="lg">Sign In</Button>
        </Link>
        <Link href="/register">
          <Button size="lg" variant="outline">Register</Button>
        </Link>
      </div>
    </div>
  );
}