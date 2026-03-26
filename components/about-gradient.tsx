"use client";

import { GrainGradient } from "@paper-design/shaders-react";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

export function AboutGradient() {
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
        <GrainGradient
          style={{ height: "100%", width: "100%" }}
          colorBack={isDarkMode ? "#060d1a" : "#c2d4ff"}
          colors={
            isDarkMode
              ? ["#1a3a6b", "#3366FF", "#33A9FF"]
              : ["#3366FF", "#5b8aff", "#33A9FF"]
          }
          speed={0.3}
          softness={0.6}
          intensity={0.5}
          noise={0.2}
          shape="corners"
        />
      )}
    </div>
  );
}
