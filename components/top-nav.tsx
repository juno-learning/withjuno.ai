"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { JunoLogo } from "@/components/juno-logo";

export function TopNav() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isDarkMode = resolvedTheme === "dark";

  return (
    <nav className="sticky top-0 z-50 w-full flex items-center justify-between px-8 lg:px-12 py-4 bg-background/80 backdrop-blur-sm">
      <Link href="/">
        <JunoLogo />
      </Link>
      <div className="flex items-center gap-6">
        <div className="hidden sm:flex items-center gap-6">
          <Link
            href="/research"
            className="text-sm transition-colors text-foreground/70 hover:text-foreground"
          >
            Research
          </Link>
          <Link
            href="/about"
            className="text-sm transition-colors text-foreground/70 hover:text-foreground"
          >
            About
          </Link>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(isDarkMode ? "light" : "dark")}
          aria-label="Toggle theme"
        >
          {!mounted ? null : isDarkMode ? (
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="5" />
              <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
            </svg>
          ) : (
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          )}
        </Button>
      </div>
    </nav>
  );
}
