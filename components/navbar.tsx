"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import { Car, Users, Settings } from "lucide-react";
import { SignOutButton } from "./sign-out-button";
import { ThemeToggle } from "./theme-toggle";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold">
            CarPool
          </Link>
          
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant={pathname === "/dashboard" ? "default" : "ghost"}>
                <Car className="mr-2 h-4 w-4" />
                Dashboard
              </Button>
            </Link>
            
            <Link href="/groups">
              <Button variant={pathname === "/groups" ? "default" : "ghost"}>
                <Users className="mr-2 h-4 w-4" />
                Groups
              </Button>
            </Link>
            
            <Link href="/settings">
              <Button variant={pathname === "/settings" ? "default" : "ghost"}>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
            </Link>
            
            <ThemeToggle />
            <SignOutButton />
          </div>
        </div>
      </div>
    </nav>
  );
}