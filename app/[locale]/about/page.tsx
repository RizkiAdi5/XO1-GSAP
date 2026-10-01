import { useTranslations } from "next-intl";
import Reveal from "@/components/motion/Reveal";

export default function AboutPage() {
  return (
    <div className="px-4 py-16 md:px-12 lg:px-24 xl:px-40 2xl:px-56">
      <BioSection />
      <JourneySection />
      <SkillsSection />
      <FactsSection />
    </div>
  );
}

function BioSection() {
  const t = useTranslations();

  return (
    <section className="grid grid-cols-1 gap-8 md:grid-cols-[200px_1fr] md:items-start">
      {/* TODO (Rizki): swap for a real photo — PRD open question: new
          editorial-style photo, or reuse an existing one? */}
      <div className="flex h-48 w-48 items-center justify-center rounded-card border border-line bg-surface text-sm text-muted">
        Photo
      </div>

      <div>
        <h1 className="text-4xl text-ink md:text-6xl">{t("about.title")}</h1>
        <Reveal>
          <p className="mt-4 max-w-2xl text-lg text-muted">{t("about.bio")}</p>
        </Reveal>
      </div>
    </section>
  );
}

function JourneySection() {
  const t = useTranslations();
  const journey = t.raw("about.journey") as { year: string; label: string }[];

  return (
    <section className="mt-16">
      <h2 className="text-2xl text-ink">{t("about.journeyTitle")}</h2>
      <Reveal stagger className="mt-6 flex flex-col divide-y divide-line border-y border-line">
        {journey.map((step) => (
          <div key={step.year} className="flex items-baseline gap-4 py-3">
            <span className="w-16 shrink-0 text-sm text-muted">{step.year}</span>
            <span className="text-ink">{step.label}</span>
          </div>
        ))}
      </Reveal>
    </section>
  );
}

function SkillsSection() {
  const t = useTranslations();
  const skills = t.raw("about.skills") as { group: string; items: string[] }[];

  return (
    <section className="mt-16">
      <h2 className="text-2xl text-ink">{t("about.skillsTitle")}</h2>
      <Reveal stagger className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {skills.map((group) => (
          <div key={group.group} className="rounded-card border border-line p-6">
            <h3 className="text-ink">{group.group}</h3>
            <ul className="mt-3 flex flex-wrap gap-2">
              {group.items.map((item) => (
                <li
                  key={item}
                  className="rounded-ui border border-line px-2 py-1 text-xs text-muted"
                >
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

function FactsSection() {
  const t = useTranslations();
  const orgs = t.raw("about.orgs") as string[];
  const certifications = t.raw("about.certifications") as string[];
  const languages = t.raw("about.languages") as { lang: string; level: string }[];

  return (
    <section className="mt-16 grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
      <div>
        <h2 className="text-lg text-ink">{t("about.educationTitle")}</h2>
        <p className="mt-2 text-sm text-muted">{t("about.education.program")}</p>
        <p className="text-sm text-muted">{t("about.education.gpa")}</p>
        <p className="text-sm text-muted">{t("about.education.scholarship")}</p>
      </div>

      <div>
        <h2 className="text-lg text-ink">{t("about.orgsTitle")}</h2>
        <ul className="mt-2 space-y-1">
          {orgs.map((org) => (
            <li key={org} className="text-sm text-muted">
              {org}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2 className="text-lg text-ink">{t("about.certificationsTitle")}</h2>
        <ul className="mt-2 space-y-1">
          {certifications.map((cert) => (
            <li key={cert} className="text-sm text-muted">
              {cert}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2 className="text-lg text-ink">{t("about.languagesTitle")}</h2>
        <ul className="mt-2 space-y-1">
          {languages.map((l) => (
            <li key={l.lang} className="text-sm text-muted">
              {l.lang} — {l.level}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
