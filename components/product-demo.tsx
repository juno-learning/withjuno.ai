"use client";

import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

type View = "student" | "instructor";

/* ------------------------------------------------------------------ *
 * Helpers
 * ------------------------------------------------------------------ */

/** Fires once when the element scrolls into view. */
function useInView<T extends HTMLElement>(ref: React.RefObject<T | null>) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [ref]);
  return inView;
}

/** Reveals `steps` items one at a time once `active` is true. */
function useStagedReveal(steps: number, active: boolean, stepMs: number) {
  const [visible, setVisible] = useState(0);
  useEffect(() => {
    if (!active) return;
    const ctrl = new AbortController();
    const sleep = (ms: number) =>
      new Promise<void>((resolve) => {
        const t = setTimeout(resolve, ms);
        ctrl.signal.addEventListener(
          "abort",
          () => {
            clearTimeout(t);
            resolve();
          },
          { once: true }
        );
      });
    (async () => {
      await sleep(250);
      for (let i = 1; i <= steps; i++) {
        if (ctrl.signal.aborted) return;
        setVisible(i);
        await sleep(stepMs);
      }
    })();
    return () => ctrl.abort();
  }, [active, steps, stepMs]);
  return visible;
}

function Reveal({
  show,
  children,
  className,
}: {
  show: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "transition-all duration-500 ease-out",
        show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2",
        className
      )}
      aria-hidden={!show}
    >
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Student view: Juno guides a debugging session with questions
 * ------------------------------------------------------------------ */

type Turn = { from: "student" | "juno"; text: string; code?: string };

const STUDENT_SCRIPT: Turn[] = [
  {
    from: "student",
    text: "I keep getting this error and I don’t understand why.",
    code: "program.c:11:37 runtime error — index 5 out of bounds for type 'int [5]'",
  },
  {
    from: "juno",
    text: "Let’s look at it together. Your array is declared as int data[5]. Which indices are valid for it?",
  },
  { from: "student", text: "0 to 4" },
  {
    from: "juno",
    text: "Right. Your while loop keeps going until i < 5 stops being true. What is i the moment the loop exits?",
  },
  {
    from: "student",
    text: "5. Oh. So data[i] on line 11 is data[5].",
  },
  {
    from: "juno",
    text: "Exactly, one past the end. Where would the printf need to live so that i is always a valid index when it runs?",
  },
  { from: "student", text: "Inside the loop. Let me try that." },
];

function StudentView({ active }: { active: boolean }) {
  const visible = useStagedReveal(STUDENT_SCRIPT.length + 1, active, 1100);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [visible]);

  return (
    <div className="flex flex-col h-full">
      <div className="px-5 py-3 border-b border-border/60 text-xs text-muted-foreground">
        Juno &middot; COMP1511 Lab 4
      </div>

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-3"
      >
        {STUDENT_SCRIPT.map((turn, i) => (
          <Reveal
            key={i}
            show={visible > i}
            className={cn(
              "flex",
              turn.from === "student" ? "justify-end" : "justify-start"
            )}
          >
            <div
              className={cn(
                "max-w-[85%] rounded-2xl px-4 py-2.5 text-[13px] leading-relaxed",
                turn.from === "student"
                  ? "bg-primary text-primary-foreground rounded-tr-sm"
                  : "bg-muted/60 text-foreground rounded-tl-sm"
              )}
              style={{
                fontFamily:
                  turn.from === "juno"
                    ? "var(--font-body-serif), serif"
                    : undefined,
              }}
            >
              {turn.from === "juno" && (
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1 font-sans">
                  Juno
                </p>
              )}
              <p>{turn.text}</p>
              {turn.code && (
                <pre
                  className="mt-2 rounded-md bg-black/20 px-3 py-2 text-[11.5px] whitespace-pre-wrap"
                  style={{ fontFamily: "var(--font-code), monospace" }}
                >
                  {turn.code}
                </pre>
              )}
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal
        show={visible > STUDENT_SCRIPT.length}
        className="px-5 py-3 border-t border-border/60 text-xs text-muted-foreground flex items-center justify-between"
      >
        <span>3 guiding questions</span>
        <span>0 answers handed over</span>
      </Reveal>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Instructor view: where the class is struggling, in real time
 * ------------------------------------------------------------------ */

const STRUGGLES = [
  { topic: "Array bounds", pct: 38 },
  { topic: "Off-by-one loops", pct: 24 },
  { topic: "Uninitialised variables", pct: 17 },
  { topic: "Pointer dereference", pct: 12 },
  { topic: "Everything else", pct: 9 },
];

const STATS = [
  { value: "312", label: "students active" },
  { value: "1,284", label: "conversations" },
  { value: "0", label: "solutions handed over" },
];

function InstructorView({ active }: { active: boolean }) {
  const visible = useStagedReveal(3, active, 450);

  return (
    <div className="flex flex-col h-full">
      <div className="px-5 py-3 border-b border-border/60 text-xs text-muted-foreground">
        Instructor dashboard &middot; COMP1511 &middot; Week 4
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-5">
        <Reveal show={visible >= 1}>
          <div className="grid grid-cols-3 gap-3">
            {STATS.map((s) => (
              <div
                key={s.label}
                className="rounded-xl bg-muted/50 px-3 py-2.5"
              >
                <p
                  className="text-xl text-foreground"
                  style={{ fontFamily: "var(--font-serif), serif" }}
                >
                  {s.value}
                </p>
                <p className="text-[11px] text-muted-foreground leading-tight">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal show={visible >= 2}>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
            Where the class is struggling
          </p>
          <ul className="flex flex-col gap-2.5">
            {STRUGGLES.map((row) => (
              <li key={row.topic} className="text-[13px]">
                <div className="flex justify-between mb-1">
                  <span className="text-foreground">{row.topic}</span>
                  <span className="text-muted-foreground tabular-nums">
                    {row.pct}%
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary transition-[width] duration-700 ease-out"
                    style={{ width: visible >= 2 ? `${row.pct}%` : "0%" }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal show={visible >= 3}>
          <div className="rounded-xl border border-border/60 px-4 py-3">
            <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-1">
              Most common sticking point
            </p>
            <p
              className="text-[13px] text-foreground"
              style={{ fontFamily: "var(--font-body-serif), serif" }}
            >
              &ldquo;Why does my loop print garbage after the last element?&rdquo;
            </p>
            <p className="text-[11px] text-muted-foreground mt-1">
              41 students this week &middot; suggested for Thursday&rsquo;s lecture
            </p>
          </div>
        </Reveal>
      </div>

      <div className="px-5 py-2.5 border-t border-border/60 text-[11px] text-muted-foreground">
        Illustrative data
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Shell: segmented control + framed window
 * ------------------------------------------------------------------ */

export function ProductDemo() {
  const [view, setView] = useState<View>("student");
  const frameRef = useRef<HTMLDivElement>(null);
  const inView = useInView(frameRef);

  return (
    <div className="flex flex-col items-center gap-6">
      <div
        role="tablist"
        aria-label="Demo view"
        className="inline-flex rounded-full p-1 gap-0.5 bg-muted/70"
      >
        {(
          [
            ["student", "Student view"],
            ["instructor", "Instructor view"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            role="tab"
            aria-selected={view === id}
            onClick={() => setView(id)}
            className={cn(
              "px-5 py-1.5 rounded-full text-sm cursor-pointer transition-all duration-200",
              view === id
                ? "bg-card text-foreground font-medium shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <div
        ref={frameRef}
        className="w-full max-w-3xl h-[560px] rounded-3xl overflow-hidden border border-border/60 bg-card shadow-sm"
      >
        {view === "student" ? (
          <StudentView key="student" active={inView} />
        ) : (
          <InstructorView key="instructor" active={inView} />
        )}
      </div>
    </div>
  );
}
