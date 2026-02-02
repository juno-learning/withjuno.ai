"use client";

import Image from "next/image";
import { Dithering } from "@paper-design/shaders-react";
import { AnimatedMarkdown } from "flowtoken";
import { MegaphoneOff, X } from "lucide-react";
import "flowtoken/dist/styles.css";
import { useState, useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const BANNER_TEXT = "junoai raises $500k from Australian Economic Accelerator";

const MAIN_CONTENT = `# Foundation models built for education

We build AI models and learning tools designed from the ground up with pedagogy in mind—for schools and institutions.

**Models** — LLMs trained to teach, not just answer. Pedagogy embedded at the core.

**Tools** — Learning applications powered by our models, tailored to curricula.

**Research** — New ML benchmarks to measure what matters in education.

**Sovereignty** — Institution and student data stays private. Your servers, or ours, but always off big-cloud platforms.`;

function JunoLogo() {
  return (
    <>
      <Image
        src="/logos/juno-logo-light.svg"
        alt="Juno AI"
        width={341}
        height={105}
        className="h-6 w-auto block dark:hidden"
        priority
      />
      <Image
        src="/logos/juno-logo-dark.svg"
        alt="Juno AI"
        width={341}
        height={105}
        className="h-6 w-auto hidden dark:block"
        priority
      />
    </>
  );
}

function PartnerLogos() {
  return (
    <div className="flex items-center gap-8">
      <Image
        src="/logos/aea.png"
        alt="AEA"
        width={120}
        height={40}
        className="h-10"
        style={{ width: "auto" }}
      />
      <Image
        src="/logos/unsw.png"
        alt="UNSW"
        width={120}
        height={40}
        className="h-10"
        style={{ width: "auto" }}
      />
      <Image
        src="/logos/dcc.svg"
        alt="DCC"
        width={120}
        height={40}
        className="h-10"
        style={{ width: "auto" }}
      />
    </div>
  );
}

function useStreamedContent(content: string, durationMs: number = 2500) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  const words = useRef(content.split(/(\s+)/));

  useEffect(() => {
    const parts = words.current;
    const interval = durationMs / parts.length;
    let i = 0;
    const timer = setInterval(() => {
      i++;
      if (i >= parts.length) {
        setDisplayed(content);
        setDone(true);
        clearInterval(timer);
      } else {
        setDisplayed(parts.slice(0, i).join(""));
      }
    }, interval);
    return () => clearInterval(timer);
  }, [content, durationMs]);

  return { displayed, done };
}

const contactFields = [
  {
    label: "Full name",
    name: "name",
    placeholder: "First and last name",
    type: "text",
  },
  {
    label: "Email address",
    name: "email",
    placeholder: "me@company.com",
    type: "email",
  },
  {
    label: "Company name",
    name: "company",
    placeholder: "Company name",
    type: "text",
    optional: true,
  },
  {
    label: "Your message",
    name: "message",
    placeholder: "Write your message",
    type: "textarea",
  },
];

function ContactForm({ onClose }: { onClose: () => void }) {
  const [result, setResult] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setResult("");
    const form = e.currentTarget;
    const formData = new FormData(form);
    formData.append("access_key", "d819be19-8edf-4421-90b3-8793f9280ce5");
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setResult(data.success ? "Success!" : "Error");
      if (data.success) {
        form.reset();
        onClose();
      }
    } catch {
      setResult("Something went wrong!");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-medium">Get in touch</h2>
        {/* <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          aria-label="Close contact form"
        >
          <X size={20} />
        </Button> */}
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="space-y-6 md:w-1/3 shrink-0">
            <div>
              <h3 className="text-sm font-medium">Careers</h3>
              <a
                href="mailto:careers@withjuno.ai"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                careers@withjuno.ai
              </a>
            </div>
            <div>
              <h3 className="text-sm font-medium">Press</h3>
              <a
                href="mailto:media@withjuno.ai"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                media@withjuno.ai
              </a>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex-1 space-y-4">
            {contactFields.map((field) => (
              <div key={field.name} className="flex flex-col gap-1.5">
                <Label className="text-xs">
                  {field.label}
                  {field.optional && (
                    <span className="text-muted-foreground/60">
                      {" "}
                      (optional)
                    </span>
                  )}
                </Label>
                {field.type === "textarea" ? (
                  <Textarea
                    name={field.name}
                    placeholder={field.placeholder}
                    className="min-h-25 resize-none"
                  />
                ) : (
                  <Input
                    type={field.type}
                    name={field.name}
                    placeholder={field.placeholder}
                  />
                )}
              </div>
            ))}
            <div className="flex items-center gap-4 pt-2">
              <Button type="submit" disabled={submitting}>
                Submit
              </Button>
              <Button type="button" variant="ghost" onClick={onClose}>
                Close
              </Button>
            </div>
            {result && (
              <p className="text-sm text-muted-foreground">{result}</p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default function JunoLanding() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const { displayed: streamedContent, done: streamDone } = useStreamedContent(
    MAIN_CONTENT,
    2500,
  );

  useEffect(() => setMounted(true), []);

  const isDarkMode = resolvedTheme === "dark";

  return (
    <div className="relative min-h-screen overflow-hidden flex flex-col bg-background text-foreground">
      {/* Announcement Banner */}
      <div className="w-full text-center py-2.5 px-4 z-20 bg-background">
        <span className="font-code text-[9px] sm:text-[11px] tracking-wide text-primary">
          <AnimatedMarkdown
            content={BANNER_TEXT}
            animation="fadeIn"
            animationDuration="0.05s"
            animationTimingFunction="ease-out"
            sep="char"
          />
        </span>
      </div>

      <div className="flex flex-col lg:flex-row flex-1">
        <div className="w-full lg:w-1/2 p-8 lg:p-12 font-mono relative z-10 flex flex-col min-h-[calc(100vh-36px)] lg:min-h-0 text-foreground bg-background">
          {showContact ? (
            <>
              {/* Header */}
              <div className="mb-12 flex items-center justify-between">
                <JunoLogo />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setTheme(isDarkMode ? "light" : "dark")}
                  aria-label="Toggle theme"
                >
                  {!mounted ? null : isDarkMode ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="5" />
                      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                    </svg>
                  )}
                </Button>
              </div>
              <div className="flex-1">
                <ContactForm onClose={() => setShowContact(false)} />
              </div>
            </>
          ) : (
            <>
              {/* Header */}
              <div className="mb-12 flex items-center justify-between">
                <JunoLogo />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setTheme(isDarkMode ? "light" : "dark")}
                  aria-label="Toggle theme"
                >
                  {!mounted ? null : isDarkMode ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="5" />
                      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                    </svg>
                  )}
                </Button>
              </div>

              {/* Main Content with Streaming Animation */}
              <div className="flex-1 flex flex-col justify-center prose prose-sm dark:prose-invert max-w-md relative">
                {/* Invisible full content to reserve layout space */}
                <div className="invisible" aria-hidden="true">
                  <AnimatedMarkdown
                    content={MAIN_CONTENT}
                    animation={null}
                    sep="word"
                  />
                  <div className="flex gap-8 text-sm mt-8 not-prose">
                    <div>
                      <span className="text-2xl font-normal">640k+</span>
                      <p className="text-muted-foreground text-xs mt-1">Uses</p>
                    </div>
                    <div>
                      <span className="text-2xl font-normal">+50%</span>
                      <p className="text-muted-foreground text-xs mt-1">
                        on pedagogical benchmarks
                      </p>
                    </div>
                  </div>
                </div>
                {/* Visible streamed content overlaid on top */}
                <div className="absolute inset-0">
                  <AnimatedMarkdown
                    content={streamedContent}
                    animation="fadeIn"
                    animationDuration="0.3s"
                    animationTimingFunction="ease-out"
                    sep="diff"
                  />
                  <div
                    className={`flex gap-8 text-sm mt-8 not-prose transition-opacity duration-300 ${streamDone ? "opacity-100" : "opacity-0"}`}
                  >
                    <div>
                      <span className="text-2xl font-normal">640k+</span>
                      <p className="text-muted-foreground text-xs mt-1">Uses</p>
                    </div>
                    <div>
                      <span className="text-2xl font-normal">+50%</span>
                      <p className="text-muted-foreground text-xs mt-1">
                        on pedagogical benchmarks
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Partners Section */}
              <div className="py-8 border-t border-border">
                <p className="text-xs text-muted-foreground mb-4">Partners</p>
                <PartnerLogos />
              </div>

              {/* Footer */}
              <div className="pt-8 border-t border-border">
                <div className="flex flex-col items-center sm:flex-row sm:items-center sm:justify-between gap-4">
                  <Button
                    variant="link"
                    onClick={() => setShowContact(true)}
                    className="text-sm text-foreground hover:text-muted-foreground p-0 h-auto"
                  >
                    Get in touch
                  </Button>
                  <span className="text-xs text-muted-foreground inline-flex items-center gap-1.5">
                    {"We're in stealth mode"}
                    <MegaphoneOff size={16} />
                  </span>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="hidden lg:block w-1/2 relative">
          <Dithering
            style={{ height: "100%", width: "100%" }}
            colorBack={mounted && isDarkMode ? "#000000" : "#EDF2FF"}
            colorFront="#3366FF"
            shape="cats"
            type="4x4"
            pxSize={3}
            offsetX={0}
            offsetY={0}
            scale={0.8}
            rotation={0}
            speed={0.1}
          />
        </div>
      </div>
    </div>
  );
}
