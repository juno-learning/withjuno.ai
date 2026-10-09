import Image from "next/image";
import type { Metadata } from "next";
import { AboutGradient } from "@/components/about-gradient";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "About | Juno AI",
  description:
    "Meet the academics behind Juno AI: researchers in pedagogy, machine learning, and AI safety from UNSW Sydney.",
};

type ProfileLink = { label: "Google Scholar" | "LinkedIn" | "Website"; href: string };

type TeamMember = {
  name: string;
  role: string;
  specialty?: string;
  photo?: string;
  initials?: string;
  links?: ProfileLink[];
};

const FOUNDERS: TeamMember[] = [
  {
    name: "Dr Sasha Vassar",
    role: "Director",
    specialty:
      "Pedagogy, cognitive load theory, and empirical evaluation design.",
    photo: "/team/new/sasha.png",
    links: [],
  },
  {
    name: "Dr Jake Renzella",
    role: "Director",
    specialty:
      "K-12 AI literacy; machine learning, applied AI, and scaling EdTech for higher education.",
    photo: "/team/new/jake.png",
    links: [{ label: "LinkedIn", href: "https://www.linkedin.com/in/jakemre/" }],
  },
  {
    name: "Dr Hammond Pearce",
    role: "Integration Specialist",
    specialty: "Hardware and software security, LLM safety.",
    photo: "/team/new/hammond.png",
    links: [],
  },
  {
    name: "A/Prof Andrew Taylor",
    role: "Technical Advisor",
    specialty: "Education tooling.",
    photo: "/team/new/andrew.png",
    links: [],
  },
];

const ENGINEERING: TeamMember[] = [
  { name: "Lorenzo Lee Solano", role: "Engineering", initials: "LS" },
  { name: "Kenneth Zhang", role: "Engineering", photo: "/team/new/kenneth.png" },
];

const ADVISORS: TeamMember[] = [{ name: "Gary Liang", role: "Advisor", initials: "GL" }];

function ExternalIcon() {
  return (
    <svg
      width="11"
      height="11"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

function Headshot({ member }: { member: TeamMember }) {
  return (
    <div className="aspect-square w-full overflow-hidden rounded-lg">
      {member.photo ? (
        <Image
          src={member.photo}
          alt={member.name}
          width={400}
          height={400}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full bg-muted flex items-center justify-center">
          <span className="text-2xl font-medium text-muted-foreground">
            {member.initials}
          </span>
        </div>
      )}
    </div>
  );
}

function FounderCard({ member }: { member: TeamMember }) {
  return (
    <div className="flex flex-col">
      <Headshot member={member} />
      <p className="text-base font-medium mt-4 text-foreground">{member.name}</p>
      <p className="text-xs font-medium uppercase tracking-wider text-primary mt-0.5">
        {member.role}
      </p>
      {member.specialty && (
        <p
          className="text-sm text-muted-foreground mt-2 leading-relaxed"
          style={{ fontFamily: "var(--font-body-serif), serif" }}
        >
          {member.specialty}
        </p>
      )}
      {member.links && member.links.length > 0 && (
        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3">
          {member.links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              {l.label}
              <ExternalIcon />
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

function MemberCard({ member }: { member: TeamMember }) {
  return (
    <div>
      <Headshot member={member} />
      <p className="text-sm font-medium mt-3">{member.name}</p>
      {member.role && <p className="text-xs text-muted-foreground">{member.role}</p>}
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-sm font-medium mb-6 text-muted-foreground uppercase tracking-wider">
      {children}
    </h2>
  );
}

export default function AboutPage() {
  return (
    <section className="px-8 lg:px-24 py-24 lg:py-32">
      <div className="max-w-5xl mx-auto">
        <h1
          className="text-4xl lg:text-5xl mb-4 text-foreground"
          style={{ fontFamily: "var(--font-serif), serif" }}
        >
          About Juno AI
        </h1>
        <p
          className="text-lg lg:text-xl text-muted-foreground mb-16 max-w-2xl"
          style={{ fontFamily: "var(--font-body-serif), serif" }}
        >
          We&rsquo;re building pedagogically sound, privacy-first AI for
          education, led by academics in machine learning and education from
          UNSW in Sydney, Australia.
        </p>

        <div className="mb-16">
          <AboutGradient />
        </div>

        <SectionLabel>Founders</SectionLabel>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {FOUNDERS.map((m) => (
            <FounderCard key={m.name} member={m} />
          ))}
        </div>

        <div className="mt-16">
          <SectionLabel>Engineering</SectionLabel>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {ENGINEERING.map((m) => (
              <MemberCard key={m.name} member={m} />
            ))}
          </div>
        </div>

        <div className="mt-16">
          <SectionLabel>Advisors</SectionLabel>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {ADVISORS.map((m) => (
              <MemberCard key={m.name} member={m} />
            ))}
          </div>
        </div>

        {/* Hiring */}
        <div className="mt-24 rounded-3xl border border-border/60 bg-card px-8 py-10 lg:px-12 lg:py-12 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="max-w-2xl">
            <h2
              className="text-3xl lg:text-4xl mb-3 text-foreground"
              style={{ fontFamily: "var(--font-serif), serif" }}
            >
              We&rsquo;re hiring
            </h2>
            <p
              className="text-base lg:text-lg text-muted-foreground"
              style={{ fontFamily: "var(--font-body-serif), serif" }}
            >
              We are looking for exceptional founding staff to help us build
              across every part of the business, from engineering and
              operations to sales and beyond.
            </p>
          </div>
          <Button asChild className="rounded-full h-11 px-6 shrink-0 w-fit">
            <a href="mailto:careers@withjuno.ai">Get in touch</a>
          </Button>
        </div>
      </div>
    </section>
  );
}
