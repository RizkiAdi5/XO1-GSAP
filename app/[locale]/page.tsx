import Link from "next/link";
import { useTranslations } from "next-intl";
import Reveal from "@/components/motion/Reveal";
import Marquee from "@/components/motion/Marquee";
import Odometer from "@/components/motion/Odometer";
import WordRotator from "@/components/motion/WordRotator";
import RollText from "@/components/motion/RollText";
import ProjectCard from "@/components/ui/ProjectCard";
import { featuredWork } from "@/lib/featured-work";
import type { CaseStudyMeta } from "@/lib/case-studies";

type WorkItem = {
  slug: string;
  year: string;
  image: string;
  title: string;
  role: string;
};

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const work: WorkItem[] = await Promise.all(
    featuredWork.map(async (item) => {
      const mod = (await import(`@/content/${locale}/work/${item.slug}.mdx`)) as {
        metadata: CaseStudyMeta;
      };
      return {
        slug: item.slug,
        year: item.year,
        image: item.image,
        title: mod.metadata.title,
        role: mod.metadata.role,
      };
    })
  );

  return (
    <>
      <Hero locale={locale} />
      <MarqueeSection />
      <SelectedWork work={work} locale={locale} />
      <Numbers />
      <WhatIDo />
      <Experience locale={locale} />
      <ContactCta locale={locale} />
    </>
  );
}

function Hero({ locale }: { locale: string }) {
  const t = useTranslations();

  return (
    <section className="px-4 pb-16 pt-12 md:px-12 lg:px-24 xl:px-40 2xl:px-56 md:pt-20">
      <span className="inline-block rounded-full border border-line px-3 py-1 text-xs text-muted">
        {t("home.badge")}
      </span>

      {/* H1 is the LCP element — no SplitHeading/Reveal here, must paint immediately. */}
      <h1 className="mt-6 max-w-5xl text-[clamp(3rem,10vw,9rem)] leading-[0.95] text-ink">
        {t("home.headline")}
      </h1>

      <Reveal>
        <p className="mt-6 max-w-xl text-lg text-muted">{t("home.subhead")}</p>
      </Reveal>

      <Reveal delay={0.1} className="mt-8 flex flex-wrap gap-4">
        <Link
          href={`/${locale}/work`}
          className="rounded-ui bg-accent px-5 py-3 text-surface"
        >
          <RollText>{t("home.seeWork")}</RollText>
        </Link>
        <Link
          href={`/${locale}/contact`}
          className="rounded-ui border border-line px-5 py-3 text-ink"
        >
          <RollText>{t("header.letsTalk")}</RollText>
        </Link>
      </Reveal>
    </section>
  );
}

function MarqueeSection() {
  const t = useTranslations();
  const items = t.raw("home.marquee") as string[];

  return (
    <div className="border-y border-line py-6">
      <Marquee items={items} speed={50} />
    </div>
  );
}

function SelectedWork({ work, locale }: { work: WorkItem[]; locale: string }) {
  const t = useTranslations();

  return (
    <section className="px-4 py-16 md:px-12 lg:px-24 xl:px-40 2xl:px-56">
      <h2 className="text-3xl text-ink md:text-4xl">{t("home.selectedWork")}</h2>

      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
        {work.map((item) => (
          <ProjectCard
            key={item.slug}
            href={`/${locale}/work/${item.slug}`}
            title={item.title}
            role={item.role}
            year={item.year}
            image={item.image}
            imageAlt={item.title}
          />
        ))}
      </div>
    </section>
  );
}

function Numbers() {
  const t = useTranslations();
  const numbers = t.raw("home.numbers") as { value: string; label: string }[];

  return (
    <Reveal stagger className="grid grid-cols-2 gap-8 border-y border-line px-4 py-16 md:grid-cols-4 md:px-12 lg:px-24 xl:px-40 2xl:px-56">
      {numbers.map((n) => (
        <div key={n.label}>
          <Odometer value={n.value} className="text-4xl text-ink md:text-5xl" />
          <p className="mt-2 text-sm text-muted">{n.label}</p>
        </div>
      ))}
    </Reveal>
  );
}

function WhatIDo() {
  const t = useTranslations();
  const items = t.raw("home.whatIDo.items") as { title: string; desc: string }[];

  return (
    <section className="px-4 py-16 md:px-12 lg:px-24 xl:px-40 2xl:px-56">
      <h2 className="text-3xl text-ink md:text-4xl">{t("home.whatIDo.title")}</h2>

      <Reveal stagger className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
        {items.map((item) => (
          <div key={item.title} className="rounded-card border border-line p-6">
            <h3 className="text-lg text-ink">{item.title}</h3>
            <p className="mt-2 text-sm text-muted">{item.desc}</p>
          </div>
        ))}
      </Reveal>
    </section>
  );
}

function Experience({ locale }: { locale: string }) {
  const t = useTranslations();

  return (
    <section className="px-4 py-16 md:px-12 lg:px-24 xl:px-40 2xl:px-56">
      <Reveal>
        <h2 className="text-3xl text-ink md:text-4xl">{t("home.experience.title")}</h2>
        <p className="mt-4 text-ink">{t("home.experience.current")}</p>
        <p className="mt-2 text-muted">{t("home.experience.campus")}</p>
        <Link href={`/${locale}/about`} className="mt-4 inline-block text-accent">
          <RollText>{t("home.experience.more")}</RollText>
        </Link>
      </Reveal>
    </section>
  );
}

function ContactCta({ locale }: { locale: string }) {
  const t = useTranslations();
  const words = t.raw("home.contactWords") as string[];

  return (
    <section className="px-4 py-24 text-center md:px-12 lg:px-24 xl:px-40 2xl:px-56">
      <p className="text-2xl text-ink md:text-4xl">
        {t("home.contactCta")} Let&rsquo;s <WordRotator words={words} />.
      </p>
      <Link
        href={`/${locale}/contact`}
        className="mt-8 inline-block rounded-ui bg-accent px-6 py-3 text-surface"
      >
        <RollText>{t("header.letsTalk")}</RollText>
      </Link>
    </section>
  );
}
