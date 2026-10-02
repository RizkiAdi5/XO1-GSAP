"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { submitContact, type ContactState } from "@/app/[locale]/contact/actions";
import { CONTACT_TYPES } from "@/lib/contact-schema";
import RollText from "@/components/motion/RollText";

const initialState: ContactState = { status: "idle" };

// Shared field look: quiet fill at rest, white + accent ring on focus.
const FIELD =
  "w-full rounded-2xl border border-transparent bg-bg px-4 py-3.5 text-ink placeholder:text-muted/70 transition-colors focus:border-accent focus:bg-surface focus:outline-none focus:ring-4 focus:ring-accent/10";

export default function ContactForm() {
  const t = useTranslations();
  const [state, formAction, pending] = useActionState(submitContact, initialState);

  if (state.status === "success") {
    return (
      <div role="status" className="flex flex-col items-start gap-4 rounded-[24px] bg-surface p-8">
        <span aria-hidden="true" className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-xl text-surface">
          ✓
        </span>
        <p className="text-2xl text-ink">{t("contact.form.successTitle")}</p>
        <p className="text-muted">{t("contact.form.successEta")}</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-6 rounded-[24px] bg-surface p-6 md:p-8">
      {/* Honeypot — hidden from real users, bots tend to fill every field. */}
      <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-2">
          <span className="text-sm text-ink">{t("contact.form.name")}</span>
          <input name="name" required autoComplete="name" placeholder={t("contact.form.namePlaceholder")} className={FIELD} />
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-sm text-ink">{t("contact.form.email")}</span>
          <input
            type="email"
            name="email"
            required
            autoComplete="email"
            placeholder={t("contact.form.emailPlaceholder")}
            className={FIELD}
          />
        </label>
      </div>

      <label className="flex flex-col gap-2">
        <span className="text-sm text-ink">{t("contact.form.subject")}</span>
        <input
          name="subject"
          required
          maxLength={120}
          placeholder={t("contact.form.subjectPlaceholder")}
          className={FIELD}
        />
      </label>

      {/* Pill choices: real radio inputs (visually hidden, still keyboard/screen-reader
          accessible), so the form posts `type` like a <select> would. */}
      <fieldset>
        <legend className="mb-3 text-sm text-ink">{t("contact.form.type")}</legend>
        <div className="flex flex-wrap gap-2">
          {CONTACT_TYPES.map((value) => (
            <label
              key={value}
              className="cursor-pointer rounded-full border border-line px-4 py-2.5 text-sm text-ink transition-colors hover:border-ink has-[:checked]:border-ink has-[:checked]:bg-ink has-[:checked]:text-surface has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent"
            >
              <input type="radio" name="type" value={value} required className="sr-only" />
              {t(`contact.form.types.${value}`)}
            </label>
          ))}
        </div>
      </fieldset>

      <label className="flex flex-col gap-2">
        <span className="text-sm text-ink">{t("contact.form.message")}</span>
        <textarea
          name="message"
          required
          minLength={20}
          rows={5}
          placeholder={t("contact.form.messagePlaceholder")}
          className={`${FIELD} resize-y`}
        />
        {/* The server rejects < 20 chars; say so up front instead of failing silently. */}
        <span className="text-xs text-muted">{t("contact.form.messageHint")}</span>
      </label>

      {state.status === "error" && (
        <p role="alert" className="rounded-2xl bg-bg px-4 py-3 text-sm text-ink">
          {t("contact.form.error")}{" "}
          <a href="mailto:riiizkiadiii@gmail.com" className="text-accent underline">
            riiizkiadiii@gmail.com
          </a>
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="flex items-center justify-between gap-4 rounded-full bg-ink py-2 pl-6 pr-2 text-surface transition-opacity disabled:opacity-60"
      >
        <RollText>{pending ? t("contact.form.sending") : t("contact.form.submit")}</RollText>
        <span aria-hidden="true" className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10">
          →
        </span>
      </button>
    </form>
  );
}
