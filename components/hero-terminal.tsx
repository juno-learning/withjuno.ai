"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useTheme } from "next-themes";
import katex from "katex";
import "katex/dist/katex.min.css";

type TerminalLine =
  | { type: "input"; text: string }
  | { type: "output"; text: string; highlight?: boolean }
  | { type: "math"; latex: string }
  | { type: "divider" }
  | { type: "blank" };

const LINES: TerminalLine[] = [
  { type: "input", text: "juno-help" },
  { type: "blank" },
  {
    type: "output",
    text: "How do I find the derivative of f(x) = x\u00B3 \u2212 4x\u00B2 + 6x \u2212 2?",
    highlight: true,
  },
  { type: "blank" },
  { type: "divider" },
  {
    type: "output",
    text: "Here is an AI-generated explanation from Juno. Think critically!",
  },
  { type: "blank" },
  { type: "output", text: "Let\u2019s work through this step by step." },
  { type: "blank" },
  { type: "output", text: "Remember the power rule for differentiation:" },
  { type: "math", latex: "\\frac{d}{dx}\\left(x^n\\right) = n \\cdot x^{\\,n-1}" },
  { type: "blank" },
  { type: "output", text: "Try applying it to each term:" },
  { type: "math", latex: "\\frac{d}{dx}(x^3) = 3x^2" },
  { type: "math", latex: "\\frac{d}{dx}(-4x^2) = -8x" },
  { type: "math", latex: "\\frac{d}{dx}(6x) = 6" },
  { type: "math", latex: "\\frac{d}{dx}(-2) = 0" },
  { type: "blank" },
  { type: "output", text: "Combining these:" },
  { type: "math", latex: "f'(x) = 3x^2 - 8x + 6" },
  { type: "blank" },
  {
    type: "output",
    text: "Now here\u2019s a question for you: at what values of x is f\u2032(x) = 0?",
    highlight: true,
  },
  {
    type: "output",
    text: "This will help you find where the function changes direction.",
  },
];

function MathBlock({ latex, isDark }: { latex: string; isDark: boolean }) {
  const html = katex.renderToString(latex, {
    displayMode: true,
    throwOnError: false,
    output: "html",
  });

  return (
    <div
      className="my-1 px-4 py-2 rounded-md"
      style={{
        background: isDark ? "rgba(51,102,255,0.08)" : "rgba(51,102,255,0.06)",
      }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

function Cursor() {
  return <span className="terminal-cursor">&#9612;</span>;
}

export function HeroTerminal({
  startAnimation,
}: {
  startAnimation: boolean;
}) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [visibleLines, setVisibleLines] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => setMounted(true), []);
  const isDark = mounted && resolvedTheme === "dark";

  const runAnimation = useCallback(async () => {
    const controller = new AbortController();
    abortRef.current = controller;
    const signal = controller.signal;

    const sleep = (ms: number) =>
      new Promise<void>((resolve) => {
        const t = setTimeout(resolve, ms);
        signal.addEventListener("abort", () => {
          clearTimeout(t);
          resolve();
        }, { once: true });
      });

    for (let i = 0; i < LINES.length; i++) {
      if (signal.aborted) break;
      const line = LINES[i];

      if (line.type === "input") {
        // Type character by character
        setIsTyping(true);
        setTypedText("");
        setVisibleLines(i);

        await sleep(400);
        for (let c = 0; c < line.text.length; c++) {
          if (signal.aborted) break;
          setTypedText(line.text.slice(0, c + 1));
          await sleep(60 + Math.random() * 40);
        }
        setIsTyping(false);
        setVisibleLines(i + 1);
        await sleep(600);
      } else if (line.type === "blank" || line.type === "divider") {
        setVisibleLines(i + 1);
        await sleep(50);
      } else if (line.type === "math") {
        setVisibleLines(i + 1);
        await sleep(300);
      } else {
        // output
        setVisibleLines(i + 1);
        await sleep(120);
      }
    }
  }, []);

  useEffect(() => {
    if (!startAnimation) return;
    runAnimation();
    return () => {
      abortRef.current?.abort();
    };
  }, [startAnimation, runAnimation]);

  // Auto-scroll
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [visibleLines, typedText]);

  const bg = isDark ? "#0e1113" : "#ffffff";
  const textColor = isDark ? "#e0e0e0" : "#1a1a2e";
  const mutedColor = isDark ? "#7a8599" : "#6b7280";
  const promptColor = isDark ? "#FAA619" : "#3366FF";
  const highlightColor = isDark ? "#e8e8e8" : "#000000";

  return (
    <div
      className="h-full w-full flex flex-col rounded-3xl overflow-hidden font-mono text-[13px] leading-relaxed"
      style={{ background: bg, color: textColor }}
    >
      {/* Window chrome */}
      <div
        className="flex items-center gap-2 px-4 py-3 shrink-0"
        style={{
          background: isDark ? "#161a1e" : "#f5f5f5",
          borderBottom: `1px solid ${isDark ? "#2a2f38" : "#e5e7eb"}`,
        }}
      >
        <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
        <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
        <div className="w-3 h-3 rounded-full bg-[#28c840]" />
        <span
          className="ml-3 text-xs"
          style={{ color: mutedColor }}
        >
          juno-help
        </span>
      </div>

      {/* Terminal body */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-5 py-4 space-y-0.5"
      >
        {LINES.map((line, i) => {
          // Show the currently-typing input line
          if (line.type === "input" && i === visibleLines && isTyping) {
            return (
              <div key={i} className="flex items-center gap-2">
                <span style={{ color: promptColor }}>$</span>
                <span>
                  {typedText}
                  <Cursor />
                </span>
              </div>
            );
          }

          // Only show completed lines
          if (i >= visibleLines) return null;

          if (line.type === "input") {
            return (
              <div key={i} className="flex items-center gap-2">
                <span style={{ color: promptColor }}>$</span>
                <span>{line.text}</span>
              </div>
            );
          }

          if (line.type === "blank") {
            return <div key={i} className="h-3" />;
          }

          if (line.type === "divider") {
            return (
              <div
                key={i}
                className="my-1"
                style={{
                  borderBottom: `1px solid ${isDark ? "#2a2f38" : "#e0e0e0"}`,
                }}
              />
            );
          }

          if (line.type === "math") {
            return <MathBlock key={i} latex={line.latex} isDark={isDark} />;
          }

          // output
          return (
            <div
              key={i}
              style={{
                color: line.highlight ? highlightColor : textColor,
                fontWeight: line.highlight ? 500 : 400,
              }}
            >
              {line.text}
            </div>
          );
        })}
      </div>
    </div>
  );
}
