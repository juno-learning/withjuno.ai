"use client";

import Link from "next/link";
import { Dithering } from "@paper-design/shaders-react";
import { memo } from "react";
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
import { ProductDemo } from "@/components/product-demo";
import { useMounted } from "@/hooks/use-mounted";

const SERIF = { fontFamily: "var(--font-serif), serif" } as const;
const BODY_SERIF = { fontFamily: "var(--font-body-serif), serif" } as const;

/* ------------------------------------------------------------------ *
 * Hero artwork
 * ------------------------------------------------------------------ */

const HeroArtwork = memo(function HeroArtwork() {
  const { resolvedTheme } = useTheme();
  const mounted = useMounted();
  const isDarkMode = mounted && resolvedTheme === "dark";

  return (
    <div className="hidden lg:block lg:w-[44%] py-12 pr-12 pl-4">
      <div className="relative h-full min-h-[520px] rounded-3xl overflow-hidden border border-border/50 shadow-sm">
        <Dithering
          style={{ height: "100%", width: "100%" }}
          colorBack={isDarkMode ? "#000000" : "#EDF2FF"}
          colorFront="#3366FF"
          shape="warp"
          type="4x4"
          pxSize={3}
          scale={0.8}
          speed={0.1}
        />
      </div>
    </div>
  );
});

/* ------------------------------------------------------------------ *
 * Contact / book-a-demo form
 * ------------------------------------------------------------------ */

const INTENT_OPTIONS = [
  "Book a demo",
  "I want early access",
  "I have a question",
  "Partnership inquiry",
  "Just browsing",
  "Other",
] as const;

const REFERRAL_OPTIONS = [
  "Search engine",
  "Social media",
  "Word of mouth",
  "Conference or event",
  "Press or article",
  "Other",
] as const;

const contactFormSchema = z.object({
  name: z.string().min(1, "Please enter your name."),
  email: z.email("Please enter a valid email address."),
  intent: z.string().optional(),
  message: z.string().min(1, "Please enter a message."),
  referral: z.string().optional(),
  // Honeypot. Must stay empty; real users never see this field.
  website: z.string().max(0).optional().or(z.literal("")),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

const FIELD_CLASS = "rounded-full px-5 h-11 bg-card border-border";

function ContactForm() {
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      intent: "Book a demo",
      message: "",
      referral: "",
      website: "",
    },
  });

  async function onSubmit(data: ContactFormValues) {
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const responseData = await res.json();
      if (!res.ok || !responseData.success) throw new Error();
      toast.success("Thanks! We’ll be in touch.");
      form.reset();
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-3 w-full max-w-md"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field} type="text" placeholder="Name *" className={FIELD_CLASS} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field} type="email" placeholder="Institution email *" className={FIELD_CLASS} />
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
              <Select onValueChange={field.onChange} value={field.value ?? ""}>
                <FormControl>
                  <SelectTrigger className={FIELD_CLASS}>
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
        <FormField
          control={form.control}
          name="referral"
          render={({ field }) => (
            <FormItem>
              <Select onValueChange={field.onChange} value={field.value ?? ""}>
                <FormControl>
                  <SelectTrigger className={FIELD_CLASS}>
                    <SelectValue placeholder="How did you hear about us?" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {REFERRAL_OPTIONS.map((opt) => (
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
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Tell us about your institution and what you’d like to see *"
                  rows={4}
                  className="rounded-2xl px-5 py-3 bg-card border-border resize-none"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div
          aria-hidden="true"
          className="absolute left-[-9999px] top-auto w-px h-px overflow-hidden"
        >
          <label htmlFor="website">
            Leave this field empty
            <input
              id="website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              {...form.register("website")}
            />
          </label>
        </div>
        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="rounded-full h-11 px-6 w-full"
        >
          {form.formState.isSubmitting ? "Sending..." : "Book a demo"}
        </Button>
      </form>
    </Form>
  );
}

/* ------------------------------------------------------------------ *
 * Page
 * ------------------------------------------------------------------ */

const PILLARS = [
  {
    title: "Models",
    body: "LLMs fine-tuned to guide, not give away the answer. Pedagogy is embedded at the model level, not bolted on with a prompt.",
  },
  {
    title: "Tools",
    body: "Compiler-integrated AI that meets students where they already work.",
    link: { href: "https://dcc.cse.unsw.edu.au", label: "See DCC" },
  },
  {
    title: "Research",
    body: "Seven peer-reviewed papers and preprints on pedagogical fine-tuning, benchmarks, and how AI can genuinely teach.",
    link: { href: "/research", label: "Read the research" },
  },
  {
    title: "Sovereignty",
    body: "Institution and student data stays private. Your servers or ours, but always off big-cloud platforms.",
  },
];

const STATS = [
  { value: "50M+", label: "uses of our compiler tools at UNSW" },
  { value: "up to +50%", label: "on pedagogical benchmarks" },
  { value: "$500k", label: "raised" },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="flex flex-col lg:flex-row lg:min-h-[calc(100vh-57px)]">
        <div className="w-full lg:w-[56%] px-8 lg:px-16 py-20 lg:py-0 flex flex-col justify-center">
          <div className="max-w-xl mx-auto lg:mx-0">
            <h1
              className="text-5xl lg:text-7xl leading-[1.05] mb-6 text-foreground"
              style={SERIF}
            >
              AI help.
              <br />
              Human learning.
            </h1>
            <p
              className="text-lg lg:text-2xl text-muted-foreground max-w-lg"
              style={BODY_SERIF}
            >
              Pedagogically sound, privacy-first AI for education, built by the
              researchers behind it.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild className="rounded-full h-11 px-6">
                <Link href="#contact">Book a demo</Link>
              </Button>
              <Button asChild variant="outline" className="rounded-full h-11 px-6">
                <Link href="#demo">See Juno in action</Link>
              </Button>
            </div>
          </div>
        </div>
        <HeroArtwork />
      </section>

      {/* Product demo */}
      <section id="demo" className="px-8 lg:px-24 py-24 lg:py-32 scroll-mt-16 border-t border-border/60">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm font-medium tracking-widest uppercase text-primary mb-4">
              Product
            </p>
            <h2 className="text-4xl lg:text-5xl mb-4 text-foreground" style={SERIF}>
              See Juno in action
            </h2>
            <p className="text-lg lg:text-xl text-muted-foreground" style={BODY_SERIF}>
              Watch Juno guide a learner, not answer for them.
            </p>
          </div>

          <ProductDemo />

          <div className="mt-12 max-w-2xl mx-auto text-center">
            <p className="text-base lg:text-lg text-muted-foreground" style={BODY_SERIF}>
              A student gets stuck debugging their code. Instead of handing over
              the fix, Juno asks the question that gets them there themselves,
              while instructors see exactly where the class is struggling.
            </p>
            <Button asChild className="rounded-full h-11 px-6 mt-8">
              <Link href="#contact">Book a demo</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Pillars + stats */}
      <section className="px-8 lg:px-24 py-24 lg:py-32 border-t border-border/60">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
            {PILLARS.map((p) => (
              <div key={p.title}>
                <h3 className="text-2xl lg:text-3xl mb-3 text-foreground" style={SERIF}>
                  {p.title}
                </h3>
                <p className="text-base lg:text-lg text-muted-foreground" style={BODY_SERIF}>
                  {p.body}
                  {p.link && (
                    <>
                      {" "}
                      <Link
                        href={p.link.href}
                        target={p.link.href.startsWith("http") ? "_blank" : undefined}
                        rel={p.link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                        className="text-primary hover:text-primary/80 transition-colors whitespace-nowrap"
                      >
                        {p.link.label} &rarr;
                      </Link>
                    </>
                  )}
                </p>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-12 lg:gap-16 mt-20 pt-12 border-t border-border">
            {STATS.map((stat) => (
              <div key={stat.label}>
                <span className="text-3xl lg:text-4xl font-bold text-foreground" style={SERIF}>
                  {stat.value}
                </span>
                <p className="text-sm text-muted-foreground mt-1" style={BODY_SERIF}>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Book a demo */}
      <section id="contact" className="px-8 lg:px-24 py-24 lg:py-32 scroll-mt-16 border-t border-border/60">
        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          <div>
            <p className="text-sm font-medium tracking-widest uppercase text-primary mb-4">
              Get started
            </p>
            <h2 className="text-4xl lg:text-5xl mb-4 text-foreground" style={SERIF}>
              Book a demo
            </h2>
            <p className="text-lg text-muted-foreground" style={BODY_SERIF}>
              Juno is for institutions who care deeply about learning. Tell us
              a little about yours and we&rsquo;ll set up a walkthrough with one of
              the founders.
            </p>
          </div>
          <ContactForm />
        </div>
      </section>
    </>
  );
}
