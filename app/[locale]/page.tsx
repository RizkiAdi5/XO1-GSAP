import type { StaticImageData } from "next/image";
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
  tags: string[];
  image: StaticImageData;
  title: string;
  role: string;
};

// Home shows only these two; the full list lives on /work.
const homeWork = ["netiquette-cloud-erp", "finance-system"];

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const work: WorkItem[] = await Promise.all(
    featuredWork.filter((item) => homeWork.includes(item.slug)).map(async (item) => {
      const mod = (await import(`@/content/${locale}/work/${item.slug}.mdx`)) as {
        metadata: CaseStudyMeta;
      };
      return {
        slug: item.slug,
        image: item.image,
        title: mod.metadata.title,
        tags: mod.metadata.tags,
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
      <ContactCta locale={locale} />
    </>
  );
}

function Hero({ locale }: { locale: string }) {
  const t = useTranslations();

  return (
    <section className="px-2 pt-4 md:px-4">
      <div className="grid min-h-[calc(100svh-7rem)] grid-cols-1 content-between gap-10 overflow-hidden rounded-[20px] bg-linear-to-b from-hero-from to-hero-to to-70% px-6 pt-14 text-white md:rounded-[32px] md:px-12 md:pt-28 lg:grid-cols-12 lg:px-20">
        {/* H1 is the LCP element — no SplitHeading/Reveal here, must paint immediately.
            Headline string carries a "\n" for the two-line break. */}
        <h1 className="whitespace-pre-line relative z-10 text-[clamp(3.5rem,8.5vw,8rem)] leading-[0.9] tracking-tight lg:col-span-7">
          {t("home.headline")}
        </h1>

        <div className="relative z-10 lg:col-span-5 lg:pt-4">
          <Reveal>
            <span className="inline-block rounded-full border border-white/40 px-3 py-1 text-sm">
              {t("home.badge")}
            </span>
            {/* text-2xl (24px) = WCAG "large text", so white on the gradient only needs 3:1. */}
            <p className="mt-6 max-w-md text-2xl leading-snug">{t("home.subhead")}</p>
          </Reveal>

          <Reveal delay={0.1} className="mt-8 flex flex-wrap gap-3">
            <Link
              href={`/${locale}/work`}
              className="flex items-center gap-4 rounded-full bg-ink py-2 pl-6 pr-2 uppercase text-surface"
            >
              <RollText>{t("home.seeWork")}</RollText>
              <span aria-hidden="true" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10">→</span>
            </Link>
            <Link
              href={`/${locale}/contact`}
              className="flex items-center gap-4 rounded-full bg-surface/80 py-2 pl-6 pr-2 uppercase text-ink"
            >
              <RollText>{t("home.startProject")}</RollText>
              <span aria-hidden="true" className="flex h-10 w-10 items-center justify-center rounded-full bg-surface">→</span>
            </Link>
          </Reveal>
        </div>

        {/* Decorative 3D loop. Its flat background (#7084E8) equals --hero-to;
            the radial mask fades the frame edges into the gradient.
            Reduced motion gets the static first frame instead.
            lg:-mt-44 tucks the image's empty top band under the text row so
            the object stays above the fold; z-10 on the text keeps it on top. */}
        <picture className="pointer-events-none mx-auto block w-full max-w-5xl lg:col-span-12 lg:-mt-44">
          <source srcSet="/images/hero-brand-poster.webp" media="(prefers-reduced-motion: reduce)" />
          <img
            src="/images/hero-brand.webp"
            alt=""
            width={1280}
            height={720}
            className="h-auto w-full [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_70%)]"
          />
        </picture>
      </div>
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
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="text-3xl text-ink md:text-4xl">{t("home.selectedWork")}</h2>
        <Link href={`/${locale}/work`} className="border-b-2 border-ink text-lg text-ink md:text-2xl">
          <RollText>{t("home.allWork")}</RollText>
        </Link>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
        {work.map((item) => (
          <ProjectCard
            key={item.slug}
            href={`/${locale}/work/${item.slug}`}
            title={item.title}
            role={item.role}
            tags={item.tags}
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

// Animated WebP per card, by index (same order as home.whatIDo.items).
// Each needs a matching "<name>-poster.webp" first frame for reduced motion.
const whatIDoMotion = ["motion-frontend", "motion-erp", "business-motion", "teamlead-motion"];

function WhatIDo() {
  const t = useTranslations();
  const items = t.raw("home.whatIDo.items") as { title: string; desc: string }[];

  return (
    <section className="px-4 py-16 md:px-12 lg:px-24 xl:px-40 2xl:px-56">
      <h2 className="text-3xl text-ink md:text-4xl">{t("home.whatIDo.title")}</h2>

      <Reveal stagger="slow" className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item, i) => (
          <div key={item.title} className="flex min-h-64 flex-col rounded-card bg-surface p-6">
            {whatIDoMotion[i] && (
              <picture className="mb-6 block">
                <source srcSet={`/images/${whatIDoMotion[i]}-poster.webp`} media="(prefers-reduced-motion: reduce)" />
                {/* Assets are 16:9; object-cover crops to 4:3 around the center.
                    Not square: wider scenes (ERP) would lose their edge objects. */}
                <img
                  src={`/images/${whatIDoMotion[i]}.webp`}
                  alt=""
                  width={1280}
                  height={720}
                  loading="lazy"
                  className="aspect-[4/3] w-full rounded-[8px] object-cover"
                />
              </picture>
            )}
            <span className="text-sm text-muted">{String(i + 1).padStart(2, "0")}</span>
            <h3 className="mt-auto text-xl text-ink">{item.title}</h3>
            <p className="mt-2 text-sm text-muted">{item.desc}</p>
          </div>
        ))}
      </Reveal>
    </section>
  );
}

function ContactCta({ locale }: { locale: string }) {
  const t = useTranslations();
  const words = t.raw("home.contactWords") as string[];

  return (
    <section className="flex flex-col items-center px-4 py-24 text-center md:px-12 md:py-32 lg:px-24 xl:px-40 2xl:px-56">
      {/* leading-[1.2] leaves room for descenders: WordRotator clips at 1lh.
          Size scales with the viewport (7vw) so each of the 2 lines stays one line on phones. */}
      <h2 className="text-[clamp(1.75rem,7vw,3.75rem)] leading-[1.2] text-ink">
        {t("home.contactCta")}
        {/* Own line, always: inline, the line count changed as the rotating
            word changed width (short word fit on one line, long one wrapped). */}
        <span className="block whitespace-nowrap">
          {t("home.contactLets")}{" "}
          {/* PRD accent font: Instrument Serif italic for one emphasized word. */}
          <WordRotator words={words} className="font-serif font-normal italic text-accent" />.
        </span>
      </h2>
      <Link
        href={`/${locale}/contact`}
        className="mt-10 flex items-center gap-4 rounded-full bg-ink py-2 pl-6 pr-2 text-surface"
      >
        <RollText>{t("home.startProject")}</RollText>
        <span aria-hidden="true" className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10">
          →
        </span>
      </Link>
    </section>
  );
}
