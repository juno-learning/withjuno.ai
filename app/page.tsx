"use client";

import Image from "next/image";
import { Dithering } from "@paper-design/shaders-react";
import { AnimatedMarkdown } from "flowtoken";
import { MegaphoneOff } from "lucide-react";
import "flowtoken/dist/styles.css";
import { useState, useEffect, useRef, memo } from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type Tab = "home" | "about" | "contact";

const MAIN_CONTENT = `# Foundation models built for education

We build AI models and learning tools designed from the ground up with pedagogy in mind—for schools and institutions.

**Models** — LLMs trained to teach, not just answer. Pedagogy embedded at the core.

**Tools** — Learning applications powered by our models, tailored to curricula.

**Research** — New ML benchmarks to measure what matters in education.

**Sovereignty** — Institution and student data stays private. Your servers, or ours, but always off big-cloud platforms.`;

const ABOUT_CONTENT = `# About Juno AI
We are a team of leading academics across ML and education from UNSW in Sydney, Australia. If you'd like to work with us, our doors are open.`;

const TEAM_MEMBERS = [
  {
    name: "Alex Chen",
    role: "CEO & Co-founder",
    bio: "Former ML lead at DeepMind. PhD in computational linguistics from Stanford.",
    photo: "/team/person1.jpg",
  },
  {
    name: "Sarah Mitchell",
    role: "CTO & Co-founder",
    bio: "Ex-Google Brain. Built large-scale training infrastructure for LLMs.",
    photo: "/team/person2.jpg",
  },
  {
    name: "James O'Brien",
    role: "Head of Research",
    bio: "Published 40+ papers on NLP and education technology. Previously at Allen AI.",
    photo: "/team/person3.jpg",
  },
  {
    name: "Maya Patel",
    role: "Head of Product",
    bio: "10 years in edtech. Led product at Coursera and Khan Academy.",
    photo: "/team/person4.jpg",
  },
  {
    name: "Tom Nguyen",
    role: "Head of Engineering",
    bio: "Scaled infra at Stripe and Canva. Specialises in ML systems.",
    photo: "/team/person5.jpg",
  },
];

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

function useStreamedContent(
  content: string,
  durationMs: number = 2500,
  skip: boolean = false,
) {
  const [displayed, setDisplayed] = useState(skip ? content : "");
  const [done, setDone] = useState(skip);
  const words = useRef(content.split(/(\s+)/));

  useEffect(() => {
    if (skip) {
      setDisplayed(content);
      setDone(true);
      return;
    }
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
  }, [content, durationMs, skip]);

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

function TabBar({
  activeTab,
  onTabChange,
}: {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}) {
  const tabs: { id: Tab; label: string }[] = [
    { id: "home", label: "Home" },
    { id: "about", label: "About" },
    { id: "contact", label: "Contact" },
  ];

  return (
    <div className="bg-muted/50 rounded-full p-1 inline-flex gap-1">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`px-3 sm:px-4 py-1.5 rounded-full font-mono text-xs cursor-pointer transition-all duration-200 ${
            activeTab === tab.id
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

const DitheringPanel = memo(function DitheringPanel({
  isDarkMode,
  mounted,
}: {
  isDarkMode: boolean;
  mounted: boolean;
}) {
  return (
    <div className="hidden lg:block lg:w-1/3 relative">
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
  );
});

function TeamPhoto({ photo, name }: { photo: string; name: string }) {
  return (
    <div className="aspect-square w-1/2 overflow-hidden rounded-lg">
      <Image
        src={photo}
        alt={name}
        width={200}
        height={200}
        className="w-full h-full object-cover"
      />
    </div>
  );
}

function HomeContent({ visible, skip }: { visible: boolean; skip: boolean }) {
  const { displayed: streamedContent, done: streamDone } = useStreamedContent(
    MAIN_CONTENT,
    2500,
    skip,
  );

  return (
    <div
      style={{ display: visible ? "flex" : "none" }}
      className="flex-col flex-1"
    >
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
              <span className="text-2xl font-bold">640k+</span>
              <p className="text-muted-foreground text-xs mt-1">Uses</p>
            </div>
            <div>
              <span className="text-2xl font-bold">up to +50%</span>
              <p className="text-muted-foreground text-xs mt-1">
                on pedagogical benchmarks
              </p>
            </div>
            <div>
              <span className="text-2xl font-bold">$500k</span>
              <p className="text-muted-foreground text-xs mt-1">Raised</p>
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
              <span className="text-2xl font-bold">640k+</span>
              <p className="text-muted-foreground text-xs mt-1">Uses</p>
            </div>
            <div>
              <span className="text-2xl font-bold">up to +50%</span>
              <p className="text-muted-foreground text-xs mt-1">
                on pedagogical benchmarks
              </p>
            </div>
            <div>
              <span className="text-2xl font-bold">$500k</span>
              <p className="text-muted-foreground text-xs mt-1">Raised</p>
            </div>
          </div>
        </div>
      </div>

      {/* Partners + Stealth mode */}
      <div className="py-8 border-t border-border">
        <p className="text-xs text-muted-foreground mb-4">Partners</p>
        <div className="flex items-center justify-between">
          <PartnerLogos />
          <span className="text-xs text-muted-foreground inline-flex items-center gap-1.5">
            {"We're in stealth mode"}
            <MegaphoneOff size={16} />
          </span>
        </div>
      </div>
    </div>
  );
}

function AboutContent({ visible }: { visible: boolean }) {
  return (
    <div
      style={{ display: visible ? "flex" : "none" }}
      className="flex-col flex-1"
    >
      <div className="prose prose-sm dark:prose-invert max-w-md">
        <h1>About Juno AI</h1>
        <p>{ABOUT_CONTENT.replace("# About Juno AI\n", "")}</p>
      </div>

      {/* Team grid */}
      <div className="pt-8">
        <h3 className="text-sm font-medium mb-4">Team</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {TEAM_MEMBERS.map((member) => (
            <div key={member.name}>
              <TeamPhoto photo={member.photo} name={member.name} />
              <p className="text-xs font-medium mt-2">{member.name}</p>
              <p className="text-[10px] text-muted-foreground">{member.role}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ContactContent({ visible }: { visible: boolean }) {
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
      if (data.success) form.reset();
    } catch {
      setResult("Something went wrong!");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      style={{ display: visible ? "flex" : "none" }}
      className="flex-col flex-1"
    >
      {/* Heading */}
      <div className="prose prose-sm dark:prose-invert max-w-md mb-8">
        <h1>Get in touch</h1>
        <p>
          {
            "We'd love to hear from you — whether you're an institution exploring AI, a researcher interested in collaboration, or someone who wants to join the team."
          }
        </p>
      </div>

      {/* Form + sidebar */}
      <div className="flex-1">
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
  const [activeTab, setActiveTab] = useState<Tab>("home");
  const [mountedTabs, setMountedTabs] = useState<Set<string>>(
    new Set(["home"]),
  );
  const streamedOnce = useRef<Set<string>>(new Set());

  useEffect(() => setMounted(true), []);

  const isDarkMode = resolvedTheme === "dark";

  function handleTabChange(tab: Tab) {
    if (!mountedTabs.has(tab)) {
      setMountedTabs((prev) => new Set(prev).add(tab));
    }
    setActiveTab(tab);
  }

  function getSkip(tab: string) {
    return streamedOnce.current.has(tab);
  }

  // Mark tab as streamed after its animation completes
  useEffect(() => {
    const timer = setTimeout(() => {
      streamedOnce.current.add(activeTab);
    }, 2600);
    return () => clearTimeout(timer);
  }, [activeTab]);

  return (
    <div className="relative min-h-screen overflow-hidden flex flex-col bg-background text-foreground">
      <div className="flex flex-col lg:flex-row flex-1">
        <div className="w-full lg:w-2/3 p-8 lg:p-12 font-mono relative z-10 flex flex-col min-h-screen lg:min-h-0 text-foreground bg-background">
          {/* Header with logo, tabs, and theme toggle */}
          <div className="mb-4 flex items-center justify-between gap-4">
            <JunoLogo />
            <div className="flex items-center gap-2">
              <TabBar activeTab={activeTab} onTabChange={handleTabChange} />
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
          </div>

          {/* Gradient divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent mb-8" />

          {mountedTabs.has("home") && (
            <HomeContent
              visible={activeTab === "home"}
              skip={getSkip("home")}
            />
          )}
          {mountedTabs.has("about") && (
            <AboutContent visible={activeTab === "about"} />
          )}
          {mountedTabs.has("contact") && (
            <ContactContent visible={activeTab === "contact"} />
          )}
        </div>

        <DitheringPanel isDarkMode={isDarkMode} mounted={mounted} />
      </div>
    </div>
  );
}
