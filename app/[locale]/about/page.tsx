import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { useLocale, useTranslations } from "next-intl";
import Reveal from "@/components/motion/Reveal";
import Odometer from "@/components/motion/Odometer";
import RollText from "@/components/motion/RollText";
import HeaderMotion from "@/components/ui/HeaderMotion";
import portrait from "@/public/images/rizki-portrait.jpg";

// Layout follows upsunday.co/about: every section is a small eyebrow label,
// one big headline (one emphasized word) and at most 2 sentences, then
// something visual. Long paragraphs were the problem.
const SECTION = "mt-24 md:mt-32";

// Accent word in headlines: <em> in the message → Instrument Serif italic.
const em = (chunks: ReactNode) => <em className="font-serif font-normal text-accent">{chunks}</em>;

export default function AboutPage() {
  return (
    <div className="px-4 py-16 md:px-12 lg:px-24 xl:px-40 2xl:px-56">
      <HeroSection />
      <IntroSection />
      <NumbersSection />
      <ApproachSection />
      <ProfileSection />
      <IndustriesSection />
      <SkillsSection />
      <LanguagesSection />
    </div>
  );
}

function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="text-sm text-muted">{children}</p>;
}

function HeroSection() {
  const t = useTranslations();

  return (
    <section className="grid grid-cols-1 items-center gap-8 md:grid-cols-2">
      <div>
        <h1 className="text-[clamp(3.5rem,8vw,8rem)] leading-[0.95] text-ink">{t("about.title")}</h1>
        <Reveal>
          <p className="mt-6 max-w-md text-xl text-ink">{t("about.tagline")}</p>
        </Reveal>
      </div>
      {/* ponytail: brightness lifts the asset bg (~#E5E2DB) to --bg; re-tune if regenerated. */}
      <HeaderMotion name="about-motion" brightness={1.06} className="mx-auto w-full max-w-xl md:-mr-8 lg:-mr-20 xl:-mr-32" />
    </section>
  );
}

function IntroSection() {
  const t = useTranslations();
  const locale = useLocale();

  return (
    <section className={`${SECTION} grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-end lg:gap-12`}>
      {/* Two columns, bottom-aligned: headline left, text + buttons right. Stacked
          (headline, then indented text) left a big empty block under the headline. */}
      <div className="lg:col-span-6">
        <Eyebrow>{t("about.intro.eyebrow")}</Eyebrow>
        <h2 className="mt-4 text-4xl leading-[1.05] text-ink md:text-6xl">
          {t.rich("about.intro.title", { em })}
        </h2>
      </div>
      <Reveal className="lg:col-span-6">
        <p className="text-lg text-muted">{t("about.intro.text")}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href={`/${locale}/work`}
            className="flex items-center gap-4 rounded-full bg-ink py-2 pl-6 pr-2 text-sm uppercase text-surface"
          >
            <RollText>{t("home.seeWork")}</RollText>
            <span aria-hidden="true" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10">→</span>
          </Link>
          <Link
            href={`/${locale}/contact`}
            className="flex items-center gap-4 rounded-full bg-surface py-2 pl-6 pr-2 text-sm uppercase text-ink"
          >
            <RollText>{t("home.startProject")}</RollText>
            <span aria-hidden="true" className="flex h-10 w-10 items-center justify-center rounded-full bg-bg">→</span>
          </Link>
        </div>
      </Reveal>
    </section>
  );
}

function NumbersSection() {
  const t = useTranslations();
  // Same figures as the Home numbers row, one source of truth.
  const numbers = t.raw("home.numbers") as { value: string; label: string }[];

  return (
    <section className={SECTION}>
      <Eyebrow>{t("about.numbers.eyebrow")}</Eyebrow>
      <h2 className="mt-4 text-4xl leading-[1.05] text-ink md:text-6xl">{t.rich("about.numbers.title", { em })}</h2>
      <Reveal stagger className="mt-10 border-t border-line">
        {numbers.map((n) => (
          <div key={n.label} className="grid grid-cols-1 items-center gap-2 border-b border-line py-8 md:grid-cols-2">
            <Odometer value={n.value} className="font-rounded text-6xl leading-none text-ink md:text-8xl" />
            <p className="text-lg text-ink">{n.label}</p>
          </div>
        ))}
      </Reveal>
    </section>
  );
}

function ApproachSection() {
  const t = useTranslations();
  const steps = t.raw("about.approach") as { title: string; desc: string }[];

  return (
    <section className={SECTION}>
      <Eyebrow>{t("about.approachEyebrow")}</Eyebrow>
      <h2 className="mt-4 max-w-3xl text-4xl leading-[1.05] text-ink md:text-6xl">{t.rich("about.approachTitle", { em })}</h2>
      <Reveal stagger="slow" className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, i) => (
          <div key={step.title} className="flex min-h-56 flex-col rounded-card bg-surface p-6">
            <span className="text-sm text-accent">{String(i + 1).padStart(2, "0")}</span>
            <h3 className="mt-auto text-xl text-ink">{step.title}</h3>
            <p className="mt-2 text-sm text-muted">{step.desc}</p>
          </div>
        ))}
      </Reveal>
    </section>
  );
}

function ProfileSection() {
  const t = useTranslations();
  const text = t.raw("about.profile.text") as string[];

  return (
    <section className={`${SECTION} grid grid-cols-1 items-start gap-10 md:grid-cols-12 md:gap-12`}>
      <div className="md:col-span-5">
        <Image
          src={portrait}
          alt={t("about.profile.photoAlt")}
          placeholder="blur"
          sizes="(min-width: 768px) 40vw, 100vw"
          className="aspect-[4/5] w-full rounded-card object-cover"
        />
      </div>
      <div className="md:col-span-7">
        <Eyebrow>{t("about.profile.eyebrow")}</Eyebrow>
        <h2 className="mt-4 text-5xl leading-none text-ink md:text-7xl">{t("about.profile.name")}</h2>
        <p className="mt-3 text-lg text-accent">{t("about.profile.role")}</p>
        <Reveal stagger className="mt-8 flex max-w-xl flex-col gap-4">
          {text.map((paragraph, i) => (
            // First line is the pitch ("I help brands build and grow…"): a step louder.
            <p key={i} className={i === 0 ? "text-xl text-ink" : "text-lg text-muted"}>
              {paragraph}
            </p>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

function IndustriesSection() {
  const t = useTranslations();
  const industries = t.raw("about.industries") as string[];

  return (
    <section className={SECTION}>
      <Eyebrow>{t("about.industriesTitle")}</Eyebrow>
      <ul className="mt-6 flex flex-wrap gap-2">
        {industries.map((name) => (
          <li key={name} className="rounded-full bg-surface px-5 py-2.5 text-lg text-ink">
            {name}
          </li>
        ))}
      </ul>
    </section>
  );
}

function SkillsSection() {
  const t = useTranslations();
  const skills = t.raw("about.skills") as { group: string; items: string[] }[];

  return (
    <section className="mt-16">
      <Eyebrow>{t("about.skillsTitle")}</Eyebrow>
      <Reveal stagger className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {skills.map((group) => (
          <div key={group.group} className="rounded-card border border-line p-6">
            <h3 className="text-ink">{group.group}</h3>
            <ul className="mt-3 flex flex-wrap gap-2">
              {group.items.map((item) => (
                <li key={item} className="rounded-ui border border-line px-2 py-1 text-xs text-muted">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Reveal>
    </section>
  );
}

function LanguagesSection() {
  const t = useTranslations();
  const languages = t.raw("about.languages") as { lang: string; level: string }[];

  return (
    <section className="mt-16">
      <Eyebrow>{t("about.languagesTitle")}</Eyebrow>
      <ul className="mt-6 flex flex-wrap gap-2">
        {languages.map((l) => (
          <li key={l.lang} className="rounded-full border border-line px-4 py-2 text-sm text-ink">
            {l.lang} <span className="text-muted">· {l.level}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
