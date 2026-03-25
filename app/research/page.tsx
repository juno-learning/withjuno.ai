import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Research | Juno AI",
  description:
    "Our research into pedagogical AI models, learning tools, and education benchmarks.",
};

const BODY_SECTIONS = [
  {
    title: "Models",
    description:
      "LLMs trained to teach, not just answer. Pedagogy embedded at the core.",
  },
  {
    title: "Tools",
    description:
      "Learning applications powered by our models, tailored to curricula.",
  },
  {
    title: "Research",
    description: "New ML benchmarks to measure what matters in education.",
  },
  {
    title: "Sovereignty",
    description:
      "Institution and student data stays private. Your servers, or ours, but always off big-cloud platforms.",
  },
];

const STATS = [
  { value: "640k+", label: "Uses" },
  { value: "up to +50%", label: "on pedagogical benchmarks" },
  { value: "$500k", label: "Raised" },
];

export default function ResearchPage() {
  return (
    <section className="px-8 lg:px-24 py-24 lg:py-32">
      <div className="max-w-4xl mx-auto">
        <h1
          className="text-4xl lg:text-5xl mb-4 text-foreground"
          style={{ fontFamily: "var(--font-serif), serif" }}
        >
          Our work
        </h1>
        <p
          className="text-lg lg:text-xl text-muted-foreground mb-16 max-w-2xl"
          style={{ fontFamily: "var(--font-body-serif), serif" }}
        >
          Building the foundation for AI that teaches, not just answers.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
          {BODY_SECTIONS.map((section) => (
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
          {STATS.map((stat) => (
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
  );
}
