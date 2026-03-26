"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { JunoLogo } from "@/components/juno-logo";

export function TopNav() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => setMounted(true), []);
  const isDarkMode = resolvedTheme === "dark";

  // Lock body scroll when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <>
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
          {/* Mobile hamburger */}
          <Button
            variant="ghost"
            size="icon"
            className="sm:hidden"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </Button>
        </div>
      </nav>

      {/* Full-screen mobile menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-[100] bg-background flex flex-col sm:hidden">
          <div className="flex items-center justify-between px-8 py-4">
            <Link href="/" onClick={() => setMenuOpen(false)}>
              <JunoLogo />
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </Button>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center gap-8">
            <Link
              href="/"
              onClick={() => setMenuOpen(false)}
              className="text-2xl text-foreground transition-colors hover:text-primary"
              style={{ fontFamily: "var(--font-serif), serif" }}
            >
              Home
            </Link>
            <Link
              href="/research"
              onClick={() => setMenuOpen(false)}
              className="text-2xl text-foreground transition-colors hover:text-primary"
              style={{ fontFamily: "var(--font-serif), serif" }}
            >
              Research
            </Link>
            <Link
              href="/about"
              onClick={() => setMenuOpen(false)}
              className="text-2xl text-foreground transition-colors hover:text-primary"
              style={{ fontFamily: "var(--font-serif), serif" }}
            >
              About
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
