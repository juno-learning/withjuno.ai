import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | Juno AI",
  description:
    "Meet the team behind Juno AI — leading academics across ML and education from UNSW Sydney.",
};

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

export default function AboutPage() {
  return (
    <section className="px-8 lg:px-24 py-24 lg:py-32">
      <div className="max-w-4xl mx-auto">
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
          We are a team of leading academics across ML and education from UNSW
          in Sydney, Australia. We are looking for exceptional founding staff.
        </p>

        <h3 className="text-sm font-medium mb-6 text-muted-foreground uppercase tracking-wider">
          Team
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
          {TEAM_MEMBERS.map((member) => (
            <div key={member.name}>
              <div className="aspect-square w-full overflow-hidden rounded-lg">
                <Image
                  src={member.photo}
                  alt={member.name}
                  width={200}
                  height={200}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-sm font-medium mt-3">{member.name}</p>
              <p className="text-xs text-muted-foreground">{member.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
