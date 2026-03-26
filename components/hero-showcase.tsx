"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useTheme } from "next-themes";
import "katex/dist/katex.min.css";
import mathHtml from "./katex-prerendered.json";

// ─── Tab bar (floating, overlays content) ───────────────────────────────────

type ShowcaseTab = "maths" | "programming";

function TabBar({
  activeTab,
  onTabChange,
  isDark,
}: {
  activeTab: ShowcaseTab;
  onTabChange: (tab: ShowcaseTab) => void;
  isDark: boolean;
}) {
  const bg = isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.06)";
  const activeBg = isDark ? "rgba(255,255,255,0.18)" : "#ffffff";

  return (
    <div
      className="inline-flex rounded-full p-1 gap-0.5 backdrop-blur-sm"
      style={{ background: bg }}
    >
      {(["maths", "programming"] as const).map((tab) => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          className="px-5 py-1.5 rounded-full text-sm cursor-pointer transition-all duration-200"
          style={{
            background: activeTab === tab ? activeBg : "transparent",
            fontWeight: activeTab === tab ? 500 : 400,
            boxShadow:
              activeTab === tab ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
          }}
        >
          {tab === "maths" ? "Maths" : "Programming"}
        </button>
      ))}
    </div>
  );
}

// ─── Maths view (clean, compact, no terminal) ──────────────────────────────

function MathBlock({ html, isDark }: { html: string; isDark: boolean }) {
  return (
    <div
      className="my-1.5 px-3 py-2 rounded-md text-sm"
      style={{
        background: isDark ? "rgba(51,102,255,0.08)" : "rgba(51,102,255,0.05)",
      }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

function InlineMath({ html }: { html: string }) {
  return <span dangerouslySetInnerHTML={{ __html: html }} />;
}

function MathsView({
  startAnimation,
  isDark,
}: {
  startAnimation: boolean;
  isDark: boolean;
}) {
  const [visible, setVisible] = useState(0);
  const abortRef = useRef<AbortController | null>(null);

  const run = useCallback(async () => {
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    const sleep = (ms: number) =>
      new Promise<void>((r) => {
        const t = setTimeout(r, ms);
        ctrl.signal.addEventListener("abort", () => { clearTimeout(t); r(); }, { once: true });
      });
    for (let i = 1; i <= 6; i++) {
      if (ctrl.signal.aborted) break;
      setVisible(i);
      await sleep(i === 1 ? 500 : 350);
    }
  }, []);

  useEffect(() => {
    if (!startAnimation) return;
    run();
    return () => { abortRef.current?.abort(); };
  }, [startAnimation, run]);

  const textColor = isDark ? "#e0e0e0" : "#1a1a2e";
  const mutedColor = isDark ? "#9ca3af" : "#6b7280";
  const bubbleBg = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.04)";

  return (
    <div className="flex-1 px-6 py-4 overflow-hidden" style={{ color: textColor }}>
      {/* Student question */}
      {visible >= 1 && (
        <div className="flex justify-end mb-4">
          <div
            className="rounded-2xl rounded-tr-sm px-4 py-2.5 text-[13px]"
            style={{ background: bubbleBg, fontFamily: "var(--font-body-serif), serif" }}
          >
            What is the derivative of <InlineMath html={mathHtml.questionInline} />?
          </div>
        </div>
      )}

      {/* Juno response — guides without giving the answer */}
      {visible >= 2 && (
        <p className="text-[11px] mb-2" style={{ color: mutedColor }}>Juno AI</p>
      )}

      {visible >= 3 && (
        <p className="text-[13px] mb-2" style={{ fontFamily: "var(--font-body-serif), serif" }}>
          {`Good question. There\u2019s a rule that makes this straightforward\u2014the power rule:`}
        </p>
      )}

      {visible >= 4 && (
        <MathBlock html={mathHtml.powerRule} isDark={isDark} />
      )}

      {visible >= 5 && (
        <p className="text-[13px] mt-3" style={{ fontFamily: "var(--font-body-serif), serif" }}>
          Try applying it to each term. Start with <InlineMath html={mathHtml.termX3} />{`\u2014what do you get when you bring the exponent down and reduce it by one? Then do `}<InlineMath html={mathHtml.termNeg4x2} />{`. What happens to the constant `}<InlineMath html={mathHtml.term5} />{`?`}
        </p>
      )}

      {visible >= 6 && (
        <p className="text-[13px] mt-3" style={{ color: mutedColor, fontFamily: "var(--font-body-serif), serif" }}>
          {`Combine your results and you\u2019ll have f\u2032(x).`}
        </p>
      )}
    </div>
  );
}

// ─── Programming view (DCC Help terminal) ───────────────────────────────────

type TermLine =
  | { type: "input"; text: string; delay?: number }
  | { type: "output"; text: string; color?: string; delay?: number }
  | { type: "blank" };

const PROG_LINES: TermLine[] = [
  { type: "input", text: "dcc program.c -o program" },
  { type: "input", text: "./program", delay: 300 },
  {
    type: "output",
    text: "program.c:11:37 runtime error \u2014 index 5 out of bounds for type 'int [5]'",
    color: "#be3737",
  },
  {
    type: "output",
    text: "Get AI-generated help by running: dcc-help",
    delay: 0,
  },
  { type: "blank" },
  { type: "input", text: "dcc-help", delay: 800 },
  {
    type: "output",
    text: "Here is an AI generated explanation. Be careful \u2014 it may be wrong!",
    delay: 300,
  },
  { type: "blank" },
  {
    type: "output",
    text: "The array data has size 5 (valid indices 0\u20134). Your while loop lets i reach 5, then data[i] after the loop accesses index 5 \u2014 out of bounds.",
  },
  { type: "blank" },
  {
    type: "output",
    text: "To fix: move printf(\"Final value: %d\\n\", data[i]) inside the loop before i++, so i is always a valid index.",
  },
];

function Cursor() {
  return <span className="terminal-cursor">&#9612;</span>;
}

function ProgrammingView({
  startAnimation,
  isDark,
}: {
  startAnimation: boolean;
  isDark: boolean;
}) {
  const [visibleLines, setVisibleLines] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const run = useCallback(async () => {
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    const signal = ctrl.signal;
    const sleep = (ms: number) =>
      new Promise<void>((r) => {
        const t = setTimeout(r, ms);
        signal.addEventListener("abort", () => { clearTimeout(t); r(); }, { once: true });
      });

    for (let i = 0; i < PROG_LINES.length; i++) {
      if (signal.aborted) break;
      const line = PROG_LINES[i];
      if (line.type === "input") {
        setIsTyping(true);
        setTypedText("");
        setVisibleLines(i);
        await sleep(line.delay ?? 400);
        for (let c = 0; c < line.text.length; c++) {
          if (signal.aborted) break;
          setTypedText(line.text.slice(0, c + 1));
          await sleep(40 + Math.random() * 25);
        }
        setIsTyping(false);
        setVisibleLines(i + 1);
        await sleep(400);
      } else if (line.type === "blank") {
        setVisibleLines(i + 1);
        await sleep(20);
      } else {
        setVisibleLines(i + 1);
        await sleep(line.delay ?? 80);
      }
    }
  }, []);

  useEffect(() => {
    if (!startAnimation) return;
    run();
    return () => { abortRef.current?.abort(); };
  }, [startAnimation, run]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [visibleLines, typedText]);

  const textColor = isDark ? "#d4d4d4" : "#1e1e1e";
  const promptColor = isDark ? "#FAA619" : "#569cd6";
  const dimColor = isDark ? "#6a737d" : "#6a737d";

  return (
    <div
      ref={scrollRef}
      className="flex-1 overflow-y-auto px-4 py-3 text-[12.5px]"
      style={{
        color: textColor,
        fontFamily: "var(--font-code), 'JetBrains Mono', 'Fira Code', Consolas, monospace",
        lineHeight: "1.7",
      }}
    >
      {PROG_LINES.map((line, i) => {
        if (line.type === "input" && i === visibleLines && isTyping) {
          return (
            <div key={i} className="flex items-start gap-1.5 whitespace-pre-wrap">
              <span style={{ color: promptColor, userSelect: "none" }}>$</span>
              <span>{typedText}<Cursor /></span>
            </div>
          );
        }
        if (i >= visibleLines) return null;
        if (line.type === "input") {
          return (
            <div key={i} className="flex items-start gap-1.5 whitespace-pre-wrap">
              <span style={{ color: promptColor, userSelect: "none" }}>$</span>
              <span>{line.text}</span>
            </div>
          );
        }
        if (line.type === "blank") return <div key={i} className="h-[0.85em]" />;
        return (
          <div
            key={i}
            className="whitespace-pre-wrap"
            style={{ color: line.color ?? (line.delay === 300 ? dimColor : textColor) }}
          >
            {line.text}
          </div>
        );
      })}
    </div>
  );
}

// ─── Main showcase component ────────────────────────────────────────────────

export function HeroShowcase({ startAnimation }: { startAnimation: boolean }) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<ShowcaseTab>("maths");
  const [animatedTabs, setAnimatedTabs] = useState<Set<string>>(new Set());

  useEffect(() => setMounted(true), []);
  const isDark = mounted && resolvedTheme === "dark";

  useEffect(() => {
    if (startAnimation && !animatedTabs.has(activeTab)) {
      setAnimatedTabs((prev) => new Set(prev).add(activeTab));
    }
  }, [startAnimation, activeTab, animatedTabs]);

  const bg = isDark ? "#0e1113" : "#ffffff";
  const showProg = activeTab === "programming";

  return (
    <div
      className="h-full w-full flex flex-col rounded-3xl overflow-hidden"
      style={{ background: bg }}
    >
      {/* Content area with floating tab bar */}
      <div className="relative flex-1 overflow-hidden flex flex-col">
        {/* Floating tab bar — overlays content */}
        <div className="absolute top-3 left-0 right-0 flex justify-center pointer-events-none">
          <div className="pointer-events-auto">
            <TabBar activeTab={activeTab} onTabChange={setActiveTab} isDark={isDark} />
          </div>
        </div>

        {/* Maths content (padded top for tab bar) */}
        <div className="flex-1 overflow-hidden flex flex-col pt-12" style={{ display: showProg ? "none" : "flex" }}>
          <MathsView startAnimation={startAnimation && animatedTabs.has("maths")} isDark={isDark} />
        </div>

        {/* Programming content (padded top for tab bar) */}
        <div className="flex-1 overflow-hidden flex flex-col pt-12" style={{ display: showProg ? "flex" : "none" }}>
          <ProgrammingView startAnimation={startAnimation && animatedTabs.has("programming")} isDark={isDark} />
        </div>
      </div>
    </div>
  );
}
