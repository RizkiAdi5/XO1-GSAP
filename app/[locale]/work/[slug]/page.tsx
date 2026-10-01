import { notFound } from "next/navigation";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { caseStudySlugs, type CaseStudyMeta, type CaseStudySlug } from "@/lib/case-studies";
import { locales } from "@/i18n/request";

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    caseStudySlugs.map((slug) => ({ locale, slug }))
  );
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;

  if (!caseStudySlugs.includes(slug as CaseStudySlug)) {
    notFound();
  }

  let mod: { default: React.ComponentType; metadata: CaseStudyMeta };
  try {
    mod = await import(`@/content/${locale}/work/${slug}.mdx`);
  } catch {
    notFound();
  }

  const { default: Content, metadata } = mod;

  const currentIndex = caseStudySlugs.indexOf(slug as CaseStudySlug);
  const nextSlug = caseStudySlugs[(currentIndex + 1) % caseStudySlugs.length];

  return (
    <article className="px-4 py-16 md:px-12 lg:px-24 xl:px-40 2xl:px-56">
      <p className="text-sm text-muted">
        {metadata.role} · {metadata.period}
        {metadata.team ? ` · ${metadata.team}` : ""}
      </p>
      <h1 className="mt-2 text-4xl text-ink md:text-6xl">{metadata.title}</h1>
      <p className="mt-4 text-lg text-muted">{metadata.summary}</p>

      <div className="mt-6 flex flex-wrap gap-2">
        {metadata.stack.map((tech) => (
          <span
            key={tech}
            className="rounded-ui border border-line px-2 py-1 text-xs text-muted"
          >
            {tech}
          </span>
        ))}
      </div>

      {metadata.liveUrl && (
        <a
          href={metadata.liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-block text-accent underline underline-offset-2"
        >
          View live →
        </a>
      )}

      <div className="mt-8 grid grid-cols-2 gap-4 border-y border-line py-8 sm:grid-cols-4">
        {metadata.results.map((result) => (
          <p key={result} className="text-sm text-ink">
            {result}
          </p>
        ))}
      </div>

      <Content />

      <NextCaseStudyLink locale={locale} nextSlug={nextSlug} />
    </article>
  );
}

function NextCaseStudyLink({
  locale,
  nextSlug,
}: {
  locale: string;
  nextSlug: string;
}) {
  const t = useTranslations();
  return (
    <div className="mt-16 border-t border-line pt-8">
      <Link href={`/${locale}/work/${nextSlug}`} className="text-lg text-ink">
        {t("caseStudy.next")} →
      </Link>
    </div>
  );
}
