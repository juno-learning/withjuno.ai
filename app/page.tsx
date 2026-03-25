"use client";

import Image from "next/image";
import { Dithering } from "@paper-design/shaders-react";
import { useState, useEffect, memo } from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { HeroShowcase } from "@/components/hero-showcase";

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

const HeroArtwork = memo(function HeroArtwork() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [revealed, setRevealed] = useState(false);
  useEffect(() => setMounted(true), []);
  const isDarkMode = mounted && resolvedTheme === "dark";

  useEffect(() => {
    const timer = setTimeout(() => setRevealed(true), 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="hidden lg:block lg:w-[48%] pt-8 pb-16 pr-12 pl-4">
      <div className="relative h-full rounded-3xl overflow-hidden border border-border/50 shadow-sm">
        {/* Showcase (underneath) */}
        <div className="absolute inset-0">
          <HeroShowcase startAnimation={revealed} />
        </div>

        {/* Dithering overlay — fades out */}
        <div
          className="relative h-full transition-opacity duration-1000"
          style={{
            opacity: revealed ? 0 : 1,
            pointerEvents: revealed ? "none" : "auto",
          }}
        >
          <Dithering
            style={{ height: "100%", width: "100%" }}
            colorBack={isDarkMode ? "#000000" : "#EDF2FF"}
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
});

function HeroContactForm() {
  const [email, setEmail] = useState("");
  const [result, setResult] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setResult("");
    const formData = new FormData();
    formData.append("access_key", "d819be19-8edf-4421-90b3-8793f9280ce5");
    formData.append("email", email);
    formData.append("subject", "New contact from landing page");
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setResult("Thanks! We\u2019ll be in touch.");
        setEmail("");
      } else {
        setResult("Something went wrong.");
      }
    } catch {
      setResult("Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mt-8 max-w-md">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          className="flex-1 rounded-full px-5 h-11 bg-card border-border"
        />
        <Button
          type="submit"
          disabled={submitting}
          className="rounded-full h-11 px-6"
        >
          {submitting ? "Sending..." : "Get in touch"}
        </Button>
      </form>
      {result && (
        <p
          className="text-sm text-muted-foreground mt-3"
          style={{ fontFamily: "var(--font-body-serif), serif" }}
        >
          {result}
        </p>
      )}
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="min-h-[calc(100vh-57px)] flex flex-col lg:flex-row">
        {/* Left: heading + tagline + contact form */}
        <div className="w-full lg:w-[52%] px-8 lg:px-12 py-12 lg:py-0 flex flex-col justify-center items-center">
          <div className="max-w-lg">
            <h1
              className="text-5xl lg:text-6xl leading-tight mb-6 text-foreground"
              style={{ fontFamily: "var(--font-serif), serif" }}
            >
              Foundation <strong className="font-normal italic">models</strong> for{" "}
              <strong className="font-normal italic">education</strong>
            </h1>
            <p
              className="text-lg lg:text-xl text-muted-foreground"
              style={{ fontFamily: "var(--font-body-serif), serif" }}
            >
              {"We\u2019re designing tools for bold institutions who care deeply about learning."}
            </p>
            <HeroContactForm />
          </div>
        </div>

        {/* Right: dithering → terminal artwork */}
        <HeroArtwork />
      </section>

      {/* Body content */}
      <section className="px-8 lg:px-24 py-24 lg:py-32">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
            {[
              { title: "Models", description: "LLMs trained to teach, not just answer. Pedagogy embedded at the core." },
              { title: "Tools", description: "Learning applications powered by our models, tailored to curricula." },
              { title: "Research", description: "New ML benchmarks to measure what matters in education." },
              { title: "Sovereignty", description: "Institution and student data stays private. Your servers, or ours, but always off big-cloud platforms." },
            ].map((section) => (
              <div key={section.title}>
                <h3
                  className="text-2xl lg:text-3xl mb-3 text-foreground"
                  style={{ fontFamily: "var(--font-serif), serif" }}
                >
                  {section.title}
                </h3>
                <p
                  className="text-base lg:text-lg text-muted-foreground"
                  style={{ fontFamily: "var(--font-body-serif), serif" }}
                >
                  {section.description}
                </p>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-12 lg:gap-16 mt-20 pt-12 border-t border-border">
            {[
              { value: "640k+", label: "Uses" },
              { value: "up to +50%", label: "on pedagogical benchmarks" },
              { value: "$500k", label: "Raised" },
            ].map((stat) => (
              <div key={stat.label}>
                <span
                  className="text-3xl lg:text-4xl font-bold text-foreground"
                  style={{ fontFamily: "var(--font-serif), serif" }}
                >
                  {stat.value}
                </span>
                <p
                  className="text-sm text-muted-foreground mt-1"
                  style={{ fontFamily: "var(--font-body-serif), serif" }}
                >
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </>
  );
}
