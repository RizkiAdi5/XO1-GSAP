"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { submitContact, type ContactState } from "@/app/[locale]/contact/actions";
import RollText from "@/components/motion/RollText";

const initialState: ContactState = { status: "idle" };

export default function ContactForm() {
  const t = useTranslations();
  const [state, formAction, pending] = useActionState(submitContact, initialState);

  if (state.status === "success") {
    return (
      <div role="status" className="rounded-card border border-line bg-surface p-6">
        <p className="text-ink">{t("contact.form.successTitle")}</p>
        <p className="mt-2 text-sm text-muted">{t("contact.form.successEta")}</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {/* Honeypot — hidden from real users, bots tend to fill every field. */}
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />

      <label className="flex flex-col gap-1">
        <span className="text-sm text-ink">{t("contact.form.name")}</span>
        <input
          name="name"
          required
          className="rounded-ui border border-line bg-surface px-3 py-2 text-ink"
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-sm text-ink">{t("contact.form.email")}</span>
        <input
          type="email"
          name="email"
          required
          className="rounded-ui border border-line bg-surface px-3 py-2 text-ink"
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-sm text-ink">{t("contact.form.type")}</span>
        <select
          name="type"
          required
          defaultValue=""
          className="rounded-ui border border-line bg-surface px-3 py-2 text-ink"
        >
          <option value="" disabled>
            {t("contact.form.typePlaceholder")}
          </option>
          <option value="job">{t("contact.form.typeJob")}</option>
          <option value="freelance">{t("contact.form.typeFreelance")}</option>
          <option value="other">{t("contact.form.typeOther")}</option>
        </select>
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-sm text-ink">{t("contact.form.message")}</span>
        <textarea
          name="message"
          required
          minLength={20}
          rows={5}
          className="rounded-ui border border-line bg-surface px-3 py-2 text-ink"
        />
      </label>

      {state.status === "error" && (
        <p role="alert" className="text-sm text-accent">
          {t("contact.form.error")}{" "}
          <a href="mailto:riiizkiadiii@gmail.com" className="underline">
            riiizkiadiii@gmail.com
          </a>
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="rounded-ui bg-accent px-5 py-3 text-surface disabled:opacity-60"
      >
        <RollText>{pending ? t("contact.form.sending") : t("contact.form.submit")}</RollText>
      </button>
    </form>
  );
}
