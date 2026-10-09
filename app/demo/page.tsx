"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { DEMO_STYLES } from "@/components/demo/demo-backgrounds";

const DEFAULT_TEXT = {
  headline: "AI help.\nHuman learning.",
  headlineSub: "Juno AI — for institutions who care deeply about learning.",
  wordmark: "Juno AI",
  tagline: "Pedagogical AI for education.",
};

/* ------------------------------------------------------------------ *
 * Screenshot studio — not linked in nav. Flip styles / framing / theme,
 * hit "Hide UI" (or press H), then screenshot. Same Juno palette across
 * every look so anything you grab is on-brand.
 * ------------------------------------------------------------------ */

type Frame = {
  id: string;
  label: string;
  /** css for the canvas; undefined width/height = fill viewport */
  w?: number;
  h?: number;
};

const FRAMES: Frame[] = [
  { id: "fill", label: "Full screen" },
  { id: "og", label: "OG 1200×630", w: 1200, h: 630 },
  { id: "sq", label: "Square 1080", w: 1080, h: 1080 },
  { id: "story", label: "Story 1080×1920", w: 1080, h: 1920 },
  { id: "wide", label: "Wide 1920×1080", w: 1920, h: 1080 },
];

const OVERLAYS = [
  { id: "brand", label: "Wordmark + tagline" },
  { id: "minimal", label: "Wordmark only" },
  { id: "headline", label: "Big headline" },
  { id: "none", label: "Background only" },
] as const;

type OverlayId = (typeof OVERLAYS)[number]["id"];

export default function DemoPage() {
  const [styleIdx, setStyleIdx] = useState(0);
  const [dark, setDark] = useState(true);
  const [frameId, setFrameId] = useState("fill");
  const [overlay, setOverlay] = useState<OverlayId>("brand");
  const [showUI, setShowUI] = useState(true);
  const [text, setText] = useState(DEFAULT_TEXT);
  const [downloading, setDownloading] = useState<null | "1080" | "4k">(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const setField = (k: keyof typeof DEFAULT_TEXT) => (v: string) =>
    setText((t) => ({ ...t, [k]: v }));

  const style = DEMO_STYLES[styleIdx];
  const frame = FRAMES.find((f) => f.id === frameId)!;

  const next = useCallback(
    () => setStyleIdx((i) => (i + 1) % DEMO_STYLES.length),
    []
  );
  const prev = useCallback(
    () => setStyleIdx((i) => (i - 1 + DEMO_STYLES.length) % DEMO_STYLES.length),
    []
  );

  // Capture the stage (shader + overlay, no control panel) as a PNG at the
  // requested resolution. 1080p / 4K = output height; width follows the frame.
  const download = useCallback(
    async (quality: "1080" | "4k") => {
      const node = stageRef.current;
      if (!node || downloading) return;
      setDownloading(quality);
      try {
        const { domToBlob } = await import("modern-screenshot");
        const targetH = quality === "4k" ? 2160 : 1080;
        const scale = targetH / node.offsetHeight;
        const blob = await domToBlob(node, { scale, type: "image/png" });
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `juno-${style.id}-${quality === "4k" ? "4k" : "1080p"}.png`;
        a.click();
        URL.revokeObjectURL(url);
      } finally {
        setDownloading(null);
      }
    },
    [downloading, style.id]
  );

  // keyboard: ← → cycle styles, H hide UI, D toggle theme
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = document.activeElement as HTMLElement | null;
      if (el?.isContentEditable) return; // don't hijack keys while editing text
      if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key.toLowerCase() === "h") setShowUI((v) => !v);
      else if (e.key.toLowerCase() === "d") setDark((v) => !v);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  // text colour for the overlay, derived from the style's preference
  const onLight = style.overlay === "light"; // dark text reads better
  const textColor = onLight ? "#0a1024" : "#EDF2FF";
  const subColor = onLight ? "rgba(10,16,36,0.7)" : "rgba(237,242,255,0.75)";

  const isFill = !frame.w;

  return (
    <div className="fixed inset-0 z-[200] overflow-hidden bg-neutral-900">
      {/* stage — neutral backdrop so framed canvases sit on a clean surface */}
      <div className="absolute inset-0 flex items-center justify-center overflow-auto p-0">
        <div
          ref={stageRef}
          className="relative overflow-hidden shadow-2xl"
          style={
            isFill
              ? { width: "100vw", height: "100vh" }
              : { width: frame.w, height: frame.h }
          }
        >
          {/* shader background */}
          <div className="absolute inset-0">{style.render(dark)}</div>

          {/* brand overlay */}
          {overlay !== "none" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center px-[8%] text-center">
              {overlay === "headline" ? (
                <>
                  <Editable
                    as="h1"
                    editable={showUI}
                    value={text.headline}
                    onChange={setField("headline")}
                    className="leading-[1.05] whitespace-pre-line"
                    style={{
                      fontFamily: "var(--font-serif), serif",
                      color: textColor,
                      fontSize: "clamp(2.5rem, 7vw, 6rem)",
                    }}
                  />
                  <Editable
                    as="p"
                    editable={showUI}
                    value={text.headlineSub}
                    onChange={setField("headlineSub")}
                    className="mt-6 max-w-3xl"
                    style={{
                      fontFamily: "var(--font-body-serif), serif",
                      color: subColor,
                      fontSize: "clamp(1rem, 2vw, 1.6rem)",
                    }}
                  />
                </>
              ) : (
                <>
                  <Editable
                    as="span"
                    editable={showUI}
                    value={text.wordmark}
                    onChange={setField("wordmark")}
                    style={{
                      fontFamily: "var(--font-serif), serif",
                      color: textColor,
                      fontSize: "clamp(3rem, 8vw, 6.5rem)",
                      lineHeight: 1,
                    }}
                  />
                  {overlay === "brand" && (
                    <Editable
                      as="p"
                      editable={showUI}
                      value={text.tagline}
                      onChange={setField("tagline")}
                      className="mt-6 max-w-xl"
                      style={{
                        fontFamily: "var(--font-body-serif), serif",
                        color: subColor,
                        fontSize: "clamp(1rem, 2vw, 1.6rem)",
                      }}
                    />
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* control panel */}
      {showUI && (
        <div className="absolute top-4 left-4 z-10 w-[270px] rounded-xl border border-white/10 bg-neutral-950/80 p-4 text-neutral-200 backdrop-blur-md shadow-xl">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
              Demo studio
            </span>
            <button
              onClick={() => setShowUI(false)}
              className="rounded-md bg-white/10 px-2 py-1 text-[11px] hover:bg-white/20"
              title="Hide UI (H)"
            >
              Hide UI · H
            </button>
          </div>

          {/* style picker */}
          <div className="mb-1 flex items-center justify-between">
            <button
              onClick={prev}
              className="rounded-md bg-white/10 px-2 py-1 text-sm hover:bg-white/20"
            >
              ‹
            </button>
            <div className="text-center">
              <div className="text-sm font-medium">{style.name}</div>
              <div className="text-[10px] text-neutral-500">
                {styleIdx + 1} / {DEMO_STYLES.length}
              </div>
            </div>
            <button
              onClick={next}
              className="rounded-md bg-white/10 px-2 py-1 text-sm hover:bg-white/20"
            >
              ›
            </button>
          </div>
          <p className="mb-3 min-h-[32px] text-[11px] leading-snug text-neutral-400">
            {style.blurb}
          </p>

          {/* style dots */}
          <div className="mb-4 flex flex-wrap gap-1.5">
            {DEMO_STYLES.map((s, i) => (
              <button
                key={s.id}
                onClick={() => setStyleIdx(i)}
                title={s.name}
                className={`h-2 w-2 rounded-full transition ${
                  i === styleIdx
                    ? "bg-[#33A9FF]"
                    : "bg-white/25 hover:bg-white/50"
                }`}
              />
            ))}
          </div>

          {/* theme */}
          <Section label="Theme">
            <Toggle active={!dark} onClick={() => setDark(false)}>
              Light
            </Toggle>
            <Toggle active={dark} onClick={() => setDark(true)}>
              Dark
            </Toggle>
          </Section>

          {/* overlay */}
          <Section label="Overlay">
            {OVERLAYS.map((o) => (
              <Toggle
                key={o.id}
                active={overlay === o.id}
                onClick={() => setOverlay(o.id)}
              >
                {o.label.split(" ")[0]}
              </Toggle>
            ))}
          </Section>

          {/* framing */}
          <div className="mt-3">
            <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-neutral-500">
              Frame
            </div>
            <div className="flex flex-col gap-1">
              {FRAMES.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFrameId(f.id)}
                  className={`rounded-md px-2 py-1 text-left text-[11px] transition ${
                    frameId === f.id
                      ? "bg-[#3366FF] text-white"
                      : "bg-white/5 hover:bg-white/10"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* download */}
          <div className="mt-4">
            <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-neutral-500">
              Download
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => download("1080")}
                disabled={downloading !== null}
                className="flex-1 rounded-md bg-white/10 px-2 py-1.5 text-[11px] hover:bg-white/20 disabled:opacity-50"
              >
                {downloading === "1080" ? "Saving…" : "1080p"}
              </button>
              <button
                onClick={() => download("4k")}
                disabled={downloading !== null}
                className="flex-1 rounded-md bg-white/10 px-2 py-1.5 text-[11px] hover:bg-white/20 disabled:opacity-50"
              >
                {downloading === "4k" ? "Saving…" : "4K"}
              </button>
            </div>
            <p className="mt-1 text-[10px] leading-snug text-neutral-500">
              PNG of the current look — control panel excluded.
            </p>
          </div>

          {overlay !== "none" && (
            <div className="mt-3 flex items-center justify-between rounded-md bg-white/5 px-2 py-1.5">
              <span className="text-[10px] leading-snug text-neutral-400">
                Click the overlay text to edit it
              </span>
              <button
                onClick={() => setText(DEFAULT_TEXT)}
                className="rounded bg-white/10 px-2 py-0.5 text-[10px] hover:bg-white/20"
              >
                Reset
              </button>
            </div>
          )}

          <p className="mt-3 text-[10px] leading-snug text-neutral-500">
            ← → styles · D theme · H hide UI
          </p>
        </div>
      )}

      {/* tiny restore handle when UI hidden */}
      {!showUI && (
        <button
          onClick={() => setShowUI(true)}
          className="absolute bottom-3 right-3 z-10 rounded-full bg-black/40 px-3 py-1.5 text-[11px] text-white/70 backdrop-blur-md hover:bg-black/60"
          title="Show UI (H)"
        >
          Show UI · H
        </button>
      )}
    </div>
  );
}

function Section({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-3">
      <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-neutral-500">
        {label}
      </div>
      <div className="flex flex-wrap gap-1">{children}</div>
    </div>
  );
}

function Toggle({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-md px-2.5 py-1 text-[11px] transition ${
        active ? "bg-[#3366FF] text-white" : "bg-white/5 hover:bg-white/10"
      }`}
    >
      {children}
    </button>
  );
}

/**
 * Inline-editable text. Initial content is written once on mount so React
 * re-renders don't fight the caret; edits flow back out via onChange.
 * Editing is enabled only while the UI is shown, so hidden-UI screenshots
 * have no caret or focus outline.
 */
function Editable({
  as: Tag = "span",
  value,
  onChange,
  editable,
  className,
  style,
}: {
  as?: "span" | "p" | "h1";
  value: string;
  onChange: (v: string) => void;
  editable: boolean;
  className?: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (ref.current && ref.current.innerText !== value) {
      ref.current.innerText = value;
    }
    // initial content only — intentionally not reacting to `value`
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Tag
      ref={ref as React.Ref<HTMLHeadingElement>}
      contentEditable={editable}
      suppressContentEditableWarning
      spellCheck={false}
      onInput={(e: React.FormEvent<HTMLElement>) =>
        onChange(e.currentTarget.innerText)
      }
      className={`outline-none ${
        editable
          ? "rounded-md transition hover:ring-1 hover:ring-white/30 focus:ring-2 focus:ring-[#33A9FF]/70"
          : ""
      } ${className ?? ""}`}
      style={style}
    />
  );
}
