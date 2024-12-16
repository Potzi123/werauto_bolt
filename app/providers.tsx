"use client";

import { ThemeProvider } from "@/components/theme-provider";
import SupabaseProvider from "@/lib/supabase-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SupabaseProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
    </SupabaseProvider>
  );
}