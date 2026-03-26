"use client";

import { MeshGradient } from "@paper-design/shaders-react";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

export function ResearchDithering() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isDarkMode = mounted && resolvedTheme === "dark";

  return (
    <div
      className="w-full rounded-2xl overflow-hidden"
      style={{ height: 380 }}
    >
      {mounted && (
        <MeshGradient
          style={{ height: "100%", width: "100%" }}
          colors={
            isDarkMode
              ? ["#0a1628", "#1a3a6b", "#3366FF", "#33A9FF"]
              : ["#EDF2FF", "#3366FF", "#33A9FF", "#c2d9ff"]
          }
          speed={0.15}
          distortion={0.4}
          swirl={0.1}
        />
      )}
    </div>
  );
}
