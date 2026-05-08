import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

type ContactPayload = {
  name?: string;
  email?: string;
  message?: string;
  referral?: string;
  website?: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_FIELD = 5000;

function clean(value: unknown): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, MAX_FIELD);
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as ContactPayload;

    // Honeypot: real users never fill this. Pretend success so bots
    // don't retry or learn from a 400.
    if (clean(body.website) !== "") {
      return NextResponse.json({ success: true });
    }

    const name = clean(body.name);
    const email = clean(body.email);
    const message = clean(body.message);
    const referral = clean(body.referral);

    if (!name) {
      return NextResponse.json(
        { error: "Name is required." },
        { status: 400 }
      );
    }
    if (!email || !EMAIL_RE.test(email)) {
      return NextResponse.json(
        { error: "A valid email is required." },
        { status: 400 }
      );
    }
    if (!message) {
      return NextResponse.json(
        { error: "Message is required." },
        { status: 400 }
      );
    }

    const url = process.env.APPS_SCRIPT_URL;
    const secret = process.env.APPS_SCRIPT_SECRET;
    if (!url || !secret) {
      console.error("APPS_SCRIPT_URL or APPS_SCRIPT_SECRET is not set");
      return NextResponse.json(
        { error: "Server configuration error." },
        { status: 500 }
      );
    }

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        secret,
        name,
        email,
        message,
        referral,
      }),
      redirect: "follow",
    });

    if (!res.ok) {
      console.error("Apps Script returned non-OK", res.status);
      return NextResponse.json(
        { error: "Upstream error." },
        { status: 502 }
      );
    }

    const data = (await res.json().catch(() => ({}))) as { ok?: boolean };
    if (!data.ok) {
      return NextResponse.json(
        { error: "Upstream rejected the submission." },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Contact form error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
