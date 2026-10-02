"use server";

import { Resend } from "resend";
import { headers } from "next/headers";
import { contactSchema } from "@/lib/contact-schema";

const CONTACT_EMAIL = "riiizkiadiii@gmail.com";
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 3;

// ponytail: in-memory map — resets on server restart and doesn't share
// across instances. Fine for a single-instance portfolio site; swap for a
// real store (Redis/Upstash) if traffic or a multi-instance deploy ever
// needs it.
const submissions = new Map<string, number[]>();

function isRateLimited(ip: string) {
  const now = Date.now();
  const recent = (submissions.get(ip) ?? []).filter(
    (t) => now - t < RATE_LIMIT_WINDOW_MS
  );
  recent.push(now);
  submissions.set(ip, recent);
  return recent.length > RATE_LIMIT_MAX;
}

export type ContactState = {
  status: "idle" | "success" | "error";
};

export async function submitContact(
  _prevState: ContactState,
  formData: FormData
): Promise<ContactState> {
  // Honeypot: real users never see or fill this field (hidden via CSS).
  // Bots that fill every field get a fake success so they don't learn
  // to avoid it next time.
  const honeypot = formData.get("company");
  if (typeof honeypot === "string" && honeypot.length > 0) {
    return { status: "success" };
  }

  const parsed = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    subject: formData.get("subject"),
    type: formData.get("type"),
    message: formData.get("message"),
  });

  if (!parsed.success) {
    return { status: "error" };
  }

  const headersList = await headers();
  const ip =
    headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  if (isRateLimited(ip)) {
    return { status: "error" };
  }

  if (!process.env.RESEND_API_KEY) {
    console.error("RESEND_API_KEY is not set — contact form can't send email.");
    return { status: "error" };
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: "Portfolio Contact <onboarding@resend.dev>",
      to: CONTACT_EMAIL,
      replyTo: parsed.data.email,
      subject: `${parsed.data.subject} · ${parsed.data.name} (${parsed.data.type})`,
      text: `Name: ${parsed.data.name}\nEmail: ${parsed.data.email}\nType: ${parsed.data.type}\nSubject: ${parsed.data.subject}\n\n${parsed.data.message}`,
    });
    return { status: "success" };
  } catch (error) {
    console.error("Failed to send contact email", error);
    return { status: "error" };
  }
}
