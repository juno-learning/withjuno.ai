"use client";

import Image from "next/image";
import { Dithering } from "@paper-design/shaders-react";
import { useState, useEffect, memo } from "react";
import { useTheme } from "next-themes";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
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

const INTENT_OPTIONS = [
  "I want early access",
  "I have a question",
  "Partnership inquiry",
  "Just browsing",
  "Other",
] as const;

const contactFormSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  name: z.string().min(1, "Please enter your name."),
  intent: z.string().optional(),
  otherIntent: z.string().optional(),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

function HeroContactForm() {
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      email: "",
      name: "",
      intent: "",
      otherIntent: "",
    },
  });

  const watchIntent = form.watch("intent");

  async function onSubmit(data: ContactFormValues) {
    try {
      const formData = new FormData();
      formData.append("access_key", "d819be19-8edf-4421-90b3-8793f9280ce5");
      formData.append("email", data.email);
      formData.append("name", data.name);
      formData.append("subject", "New contact from landing page");
      const intentValue =
        data.intent === "Other"
          ? data.otherIntent || "Other"
          : data.intent || "Not specified";
      formData.append("intent", intentValue);
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });
      const responseData = await res.json();
      if (!responseData.success) throw new Error();
      toast.success("Thanks! We\u2019ll be in touch.");
      form.reset();
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  }

  return (
    <div className="mt-8 max-w-md">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-3"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    type="email"
                    placeholder="Email *"
                    className="rounded-full px-5 h-11 bg-card border-border"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    type="text"
                    placeholder="Name *"
                    className="rounded-full px-5 h-11 bg-card border-border"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="intent"
            render={({ field }) => (
              <FormItem>
                <Select
                  onValueChange={field.onChange}
                  value={field.value ?? ""}
                >
                  <FormControl>
                    <SelectTrigger className="rounded-full px-5 h-11 bg-card border-border">
                      <SelectValue placeholder="What brings you here?" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {INTENT_OPTIONS.map((opt) => (
                      <SelectItem key={opt} value={opt}>
                        {opt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          {watchIntent === "Other" && (
            <FormField
              control={form.control}
              name="otherIntent"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Tell us more..."
                      rows={3}
                      className="rounded-2xl px-5 py-3 bg-card border-border resize-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="rounded-full h-11 px-6 w-full"
          >
            {form.formState.isSubmitting ? "Sending..." : "Get in touch"}
          </Button>
        </form>
      </Form>
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="min-h-[calc(100vh-57px)] flex flex-col lg:flex-row">
        {/* Left: heading + tagline + contact form */}
        <div className="w-full lg:w-[52%] px-8 lg:px-12 py-12 lg:py-0 flex flex-col justify-center items-center min-h-[calc(100vh-57px)] lg:min-h-0">
          <div className="max-w-lg">
            <h1
              className="text-5xl lg:text-6xl leading-tight mb-6 text-foreground"
              style={{ fontFamily: "var(--font-serif), serif" }}
            >
                AI help.{" "}
                <br />
                Human learning.
            </h1>
            <p
              className="text-lg lg:text-xl text-muted-foreground"
              style={{ fontFamily: "var(--font-body-serif), serif" }}
            >
              {"Juno AI is for institutions"}<br />{"who care deeply about learning."}
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
            <div>
              <h3
                className="text-2xl lg:text-3xl mb-3 text-foreground"
                style={{ fontFamily: "var(--font-serif), serif" }}
              >
                Models
              </h3>
              <p
                className="text-base lg:text-lg text-muted-foreground"
                style={{ fontFamily: "var(--font-body-serif), serif" }}
              >
                LLMs fine-tuned to guide, not give away the answer. Pedagogy is embedded at the model level.
              </p>
            </div>
            <div>
              <h3
                className="text-2xl lg:text-3xl mb-3 text-foreground"
                style={{ fontFamily: "var(--font-serif), serif" }}
              >
                Tools
              </h3>
              <p
                className="text-base lg:text-lg text-muted-foreground"
                style={{ fontFamily: "var(--font-body-serif), serif" }}
              >
                Compiler-integrated AI that meets students where they are.{" "}
                <a
                  href="https://dcc.cse.unsw.edu.au"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground/80 transition-colors"
                >
                  Learn more →
                </a>
              </p>
            </div>
            <div>
              <h3
                className="text-2xl lg:text-3xl mb-3 text-foreground"
                style={{ fontFamily: "var(--font-serif), serif" }}
              >
                Research
              </h3>
              <p
                className="text-base lg:text-lg text-muted-foreground"
                style={{ fontFamily: "var(--font-body-serif), serif" }}
              >
                Peer-reviewed work on pedagogical benchmarks, fine-tuning, and how AI can genuinely teach.
              </p>
            </div>
            <div>
              <h3
                className="text-2xl lg:text-3xl mb-3 text-foreground"
                style={{ fontFamily: "var(--font-serif), serif" }}
              >
                Sovereignty
              </h3>
              <p
                className="text-base lg:text-lg text-muted-foreground"
                style={{ fontFamily: "var(--font-body-serif), serif" }}
              >
                Institution and student data stays private. Your servers or ours, but always off big-cloud platforms.
              </p>
            </div>
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
