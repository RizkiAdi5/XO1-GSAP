import { useTranslations } from "next-intl";
import Reveal from "@/components/motion/Reveal";
import HeaderMotion from "@/components/ui/HeaderMotion";

export default function AboutPage() {
  return (
    <div className="px-4 py-16 md:px-12 lg:px-24 xl:px-40 2xl:px-56">
      <BioSection />
      <SkillsSection />
      <LanguagesSection />
    </div>
  );
}

function BioSection() {
  const t = useTranslations();

  return (
    <section className="grid grid-cols-1 items-center gap-8 md:grid-cols-2">
      <div>
        <h1 className="text-[clamp(3.5rem,8vw,8rem)] leading-[0.95] text-ink">{t("about.title")}</h1>
        <Reveal>
          <p className="mt-4 max-w-2xl text-lg text-muted">{t("about.bio")}</p>
        </Reveal>
      </div>
      {/* ponytail: brightness lifts the asset bg (~#E5E2DB) to --bg; re-tune if regenerated. */}
      <HeaderMotion name="about-motion" brightness={1.06} className="mx-auto w-full max-w-xl md:-mr-8 lg:-mr-20 xl:-mr-32" />
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

function LanguagesSection() {
  const t = useTranslations();
  const languages = t.raw("about.languages") as { lang: string; level: string }[];

  return (
    <section className="mt-16">
      <h2 className="text-2xl text-ink">{t("about.languagesTitle")}</h2>
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
