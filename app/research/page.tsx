import type { Metadata } from "next";
import { ResearchDithering } from "@/components/research-dithering";

export const metadata: Metadata = {
  title: "Research | Juno AI",
  description:
    "Our research into pedagogical AI models, fine-tuning, and compiler-integrated learning tools for computing education.",
};

type Publication = {
  id: string;
  title: string;
  venue: string;
  venueShort: string;
  year: number;
  tags: string[];
  href?: string;
  abstract?: string;
};

const PUBLICATIONS: Publication[] = [
  {
    id: "solano2026fine",
    title:
      "Fine-Tuning Open-Source Models as a Viable Alternative to Proprietary LLMs for Explaining Compiler Messages",
    venue: "Forthcoming",
    venueShort: "2026",
    year: 2026,
    tags: ["Fine-Tuning", "Open-Source", "Compiler Messages"],
  },
  {
    id: "solano2025narrowing",
    title:
      "Narrowing the Gap: Supervised Fine-Tuning of Open-Source LLMs as a Viable Alternative to Proprietary Models for Pedagogical Tools",
    venue: "arXiv preprint arXiv:2507.05305",
    venueShort: "arXiv 2025",
    year: 2025,
    tags: ["Fine-Tuning", "Open-Source LLMs", "Pedagogy"],
    href: "https://arxiv.org/abs/2507.05305",
  },
  {
    id: "ross2025supervised",
    title:
      "Supervised Fine-Tuning LLMs to Behave as Pedagogical Agents in Programming Education",
    venue: "arXiv preprint arXiv:2502.20527",
    venueShort: "arXiv 2025",
    year: 2025,
    tags: ["Fine-Tuning", "Pedagogical Agents", "Programming Education"],
    href: "https://arxiv.org/abs/2502.20527",
  },
  {
    id: "renzella2025compiler",
    title:
      "Compiler-Integrated, Conversational AI for Debugging CS1 Programs",
    venue:
      "Proceedings of the 56th ACM Technical Symposium on Computer Science Education V. 1 (SIGCSE 2025)",
    venueShort: "SIGCSE 2025",
    year: 2025,
    tags: ["Compiler Integration", "Conversational AI", "Debugging"],
    abstract:
      "Presents a compiler-integrated conversational AI system that helps CS1 students debug their programs through pedagogically-grounded dialogue.",
  },
  {
    id: "vassar2024towards",
    title:
      "Towards Pedagogical LLMs with Supervised Fine Tuning for Computing Education",
    venue: "arXiv preprint arXiv:2411.01765",
    venueShort: "arXiv 2024",
    year: 2024,
    tags: ["Supervised Fine-Tuning", "Pedagogical LLMs"],
    href: "https://arxiv.org/abs/2411.01765",
  },
  {
    id: "vassar2024fine",
    title:
      "Fine-Tuning Large Language Models for Better Programming Error Explanations",
    venue:
      "Proceedings of the 24th Koli Calling International Conference on Computing Education Research",
    venueShort: "Koli Calling 2024",
    year: 2024,
    tags: ["Fine-Tuning", "Error Explanations"],
    abstract:
      "Explores fine-tuning large language models to produce better, more pedagogically appropriate explanations for programming errors encountered by novice programmers.",
  },
  {
    id: "taylor2024dcc",
    title:
      "dcc --help: Transforming the Role of the Compiler by Generating Context-Aware Error Explanations with Large Language Models",
    venue:
      "Proceedings of the 55th ACM Technical Symposium on Computer Science Education V. 1 (SIGCSE 2024)",
    venueShort: "SIGCSE 2024",
    year: 2024,
    tags: ["DCC", "Compiler Errors", "LLMs"],
    abstract:
      "Introduces dcc --help, a system that transforms the compiler into a pedagogical tool by using LLMs to generate context-aware explanations for error messages.",
  },
];


function PublicationCard({ pub }: { pub: Publication }) {
  const titleElement = (
    <h3
      className="text-lg lg:text-xl leading-snug text-foreground group-hover:text-primary transition-colors"
      style={{ fontFamily: "var(--font-serif), serif" }}
    >
      {pub.title}
    </h3>
  );

  return (
    <article className="group relative">
      <div className="flex flex-col gap-3 py-8 border-b border-border/60 last:border-b-0">
        {/* Venue badge */}
        <div className="flex items-center gap-3 flex-wrap">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
            {pub.venueShort}
          </span>
          {pub.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center px-2 py-0.5 rounded-full text-xs text-muted-foreground bg-muted/50"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Title */}
        {pub.href ? (
          <a
            href={pub.href}
            target="_blank"
            rel="noopener noreferrer"
            className="no-underline"
          >
            {titleElement}
          </a>
        ) : (
          titleElement
        )}

        {/* Venue full */}
        <p
          className="text-sm text-muted-foreground/70 italic"
          style={{ fontFamily: "var(--font-body-serif), serif" }}
        >
          {pub.venue}
        </p>

        {/* Abstract preview if available */}
        {pub.abstract && (
          <p
            className="text-sm text-muted-foreground mt-1"
            style={{ fontFamily: "var(--font-body-serif), serif" }}
          >
            {pub.abstract}
          </p>
        )}

        {/* Link */}
        {pub.href && (
          <a
            href={pub.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 transition-colors mt-1 w-fit"
          >
            Read paper
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </a>
        )}
      </div>
    </article>
  );
}

export default function ResearchPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="px-8 lg:px-24 pt-20 lg:pt-28 pb-12">
        <div className="max-w-5xl mx-auto">
          <p className="text-sm font-medium tracking-widest uppercase text-primary mb-4">
            Research
          </p>
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl mb-6 text-foreground max-w-3xl"
            style={{ fontFamily: "var(--font-serif), serif" }}
          >
            Building AI with educational instincts
          </h1>
          <p
            className="text-lg lg:text-xl text-muted-foreground max-w-2xl"
            style={{ fontFamily: "var(--font-body-serif), serif" }}
          >
            Our peer-reviewed research explores how fine-tuned language models
            can serve as genuine pedagogical tools in computing education —
            explaining errors, guiding debugging, and fostering deeper
            understanding.
          </p>
        </div>
      </section>

      {/* Decorative dithering banner */}
      <section className="px-8 lg:px-24 pb-16">
        <div className="max-w-5xl mx-auto">
          <ResearchDithering />
        </div>
      </section>

      {/* Publications */}
      <section className="px-8 lg:px-24 pb-20">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-4 mb-2">
            <h2
              className="text-2xl lg:text-3xl text-foreground"
              style={{ fontFamily: "var(--font-serif), serif" }}
            >
              Publications
            </h2>
            <span className="text-sm text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-full">
              {PUBLICATIONS.length} papers
            </span>
          </div>
          <p
            className="text-base text-muted-foreground mb-8"
            style={{ fontFamily: "var(--font-body-serif), serif" }}
          >
            Peer-reviewed and preprint research from our team.
          </p>

          {PUBLICATIONS.map((pub) => (
            <PublicationCard key={pub.id} pub={pub} />
          ))}
        </div>
      </section>

    </div>
  );
}
