import Image from "next/image";
import type { Metadata } from "next";
import { AboutGradient } from "@/components/about-gradient";

export const metadata: Metadata = {
  title: "About | Juno AI",
  description:
    "Meet the team behind Juno AI — leading academics across ML and education from UNSW Sydney.",
};

type TeamMember = {
  name: string;
  role: string;
  photo?: string;
  initials?: string;
};

const FOUNDERS: TeamMember[] = [
  {
    name: "Dr Jake Renzella",
    role: "Director",
    photo: "/team/new/jake.png",
  },
  {
    name: "Dr Sasha Vassar",
    role: "Director",
    photo: "/team/new/sasha.png",
  },
  {
    name: "Dr Hammond Pearce",
    photo: "/team/new/hammond.png",
    role: "",
  },
  {
    name: "A/Prof Andrew Taylor",
    photo: "/team/new/andrew.png",
    role: "",
  },
];

const ADVISORS: TeamMember[] = [
  {
    name: "Gary Liang",
    role: "",
    initials: "GL",
  },
];

const ENGINEERING: TeamMember[] = [
  {
    name: "Lorenzo Lee Solano",
    role: "Engineering",
    initials: "LS",
  },
  {
    name: "Kenneth Zhang",
    role: "Engineering",
    photo: "/team/new/kenneth.png",
  },
];

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
          We are a team of leading academics across machine learning and
          education from UNSW in Sydney, Australia. We are looking for
          exceptional founding staff to help us build across every part of the
          business, from engineering and operations to sales and beyond.
        </p>

        <div className="mb-16">
          <AboutGradient />
        </div>

        <h3 className="text-sm font-medium mb-6 text-muted-foreground uppercase tracking-wider">
          Founders
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {FOUNDERS.map((member) => (
            <div key={member.name}>
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
              <p className="text-sm font-medium mt-3">{member.name}</p>
              {member.role && <p className="text-xs text-muted-foreground">{member.role}</p>}
            </div>
          ))}
        </div>

        <h3 className="text-sm font-medium mb-6 mt-16 text-muted-foreground uppercase tracking-wider">
          Engineering
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {ENGINEERING.map((member) => (
            <div key={member.name}>
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
              <p className="text-sm font-medium mt-3">{member.name}</p>
              {member.role && <p className="text-xs text-muted-foreground">{member.role}</p>}
            </div>
          ))}
        </div>

        <h3 className="text-sm font-medium mb-6 mt-16 text-muted-foreground uppercase tracking-wider">
          Advisors
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {ADVISORS.map((member) => (
            <div key={member.name}>
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
              <p className="text-sm font-medium mt-3">{member.name}</p>
              {member.role && <p className="text-xs text-muted-foreground">{member.role}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
