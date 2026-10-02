import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import ContactForm from "@/components/ui/ContactForm";
import CalendlyEmbed from "@/components/ui/CalendlyEmbed";
import HeaderMotion from "@/components/ui/HeaderMotion";
import Reveal from "@/components/motion/Reveal";
import RollText from "@/components/motion/RollText";
import { SOCIALS, VideoIcon, WhatsAppIcon } from "@/components/ui/icons";

const EMAIL = "riiizkiadiii@gmail.com";
const WHATSAPP = "https://wa.me/6289670468240";

export default function ContactPage() {
  const t = useTranslations();
  const faq = t.raw("contact.faq.items") as { q: string; a: string }[];

  return (
    <div className="px-4 py-16 md:px-12 lg:px-24 xl:px-40 2xl:px-56">
      <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2">
        <div>
          <h1 className="text-[clamp(3.5rem,8vw,8rem)] leading-[0.95] text-ink">{t("contact.title")}</h1>
          <p className="mt-4 max-w-xl text-lg text-muted">{t("contact.intro")}</p>
        </div>
        {/* ponytail: brightness lifts the asset bg (~#EFECE6) to --bg; re-tune if regenerated. */}
        <HeaderMotion name="contact-motion" brightness={1.03} className="mx-auto w-full max-w-xl md:-mr-8 lg:-mr-20 xl:-mr-32" />
      </div>

      {/* 1. Book a call — the main action of the page. */}
      <section className="mt-12 grid grid-cols-1 gap-8 rounded-[24px] bg-surface p-6 md:rounded-[32px] md:p-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        <div>
          <span className="inline-block rounded-full bg-accent px-3 py-1 text-xs text-surface">
            {t("contact.call.badge")}
          </span>
          <h2 className="mt-6 text-3xl text-ink md:text-5xl">{t("contact.call.title")}</h2>
          <p className="mt-4 max-w-sm text-muted">{t("contact.call.intro")}</p>
          <ul className="mt-6 flex flex-wrap gap-2">
            <Chip icon={<ClockIcon />}>{t("contact.call.duration")}</Chip>
            <Chip icon={<VideoIcon className="h-4 w-4" />}>Google Meet</Chip>
          </ul>
        </div>
        <div className="overflow-hidden rounded-card border border-line">
          <CalendlyEmbed url="https://calendly.com/riiizkiadiii/discovery-call?hide_gdpr_banner=1&hide_event_type_details=1&primary_color=2f45ff" />
        </div>
      </section>

      {/* 2. Other ways to reach me. */}
      <Reveal stagger className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="flex flex-col rounded-[24px] bg-surface p-6">
          <h3 className="text-xl text-ink">{t("contact.whatsapp.title")}</h3>
          <p className="mt-2 text-sm text-muted">{t("contact.whatsapp.text")}</p>
          <a
            href={WHATSAPP}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 flex w-full items-center justify-center gap-3 rounded-full bg-[#25D366] px-6 py-4 text-base text-ink"
          >
            <WhatsAppIcon className="h-6 w-6" />
            <RollText>{t("contact.whatsapp.button")}</RollText>
          </a>
        </div>

        <div className="flex flex-col rounded-[24px] bg-surface p-6">
          <h3 className="text-sm text-muted">{t("contact.channels.email")}</h3>
          <a href={`mailto:${EMAIL}`} className="mt-auto break-all pt-6 text-xl text-ink hover:text-accent md:text-2xl">
            {EMAIL}
          </a>
        </div>

        <div className="flex flex-col rounded-[24px] bg-surface p-6">
          <h3 className="text-sm text-muted">{t("contact.follow")}</h3>
          <div className="mt-auto flex gap-3 pt-6">
            {SOCIALS.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex h-12 w-12 items-center justify-center rounded-full border border-line text-ink transition-colors hover:border-accent hover:text-accent"
              >
                <Icon className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>
      </Reveal>
      <p className="mt-6 text-sm text-muted">{t("contact.channels.timezone")}</p>

      {/* 3. The form stays for people who'd rather write. */}
      <section className="mt-24 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        <div>
          <h2 className="text-3xl text-ink md:text-4xl">{t("contact.message.title")}</h2>
          <p className="mt-4 max-w-sm text-muted">{t("contact.form.successEta")}</p>
        </div>
        <ContactForm />
      </section>

      {/* 4. FAQ — native <details>, so it works without JS and is keyboard-accessible
          for free. Height animation via ::details-content in globals.css. */}
      <section className="mt-24">
        <h2 className="text-3xl text-ink md:text-5xl">
          {t.rich("contact.faq.title", {
            em: (chunks) => <em className="font-serif font-normal text-muted">{chunks}</em>,
          })}
        </h2>
        <div className="mt-10 border-t border-line">
          {faq.map((item) => (
            <details key={item.q} name="faq" className="faq group border-b border-line">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-lg text-ink md:text-xl [&::-webkit-details-marker]:hidden">
                {item.q}
                <span
                  aria-hidden="true"
                  className="text-2xl leading-none text-muted transition-transform duration-[var(--duration-fast)] ease-[var(--ease-out)] group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="max-w-2xl pb-6 text-muted">{item.a}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}

function Chip({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <li className="flex items-center gap-2 rounded-full bg-bg px-3 py-1.5 text-sm text-ink">
      {icon}
      {children}
    </li>
  );
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} className="h-4 w-4" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" strokeLinecap="round" />
    </svg>
  );
}
