import { useTranslations } from "next-intl";
import { featuredWork } from "@/lib/featured-work";
import { archiveWork } from "@/lib/archive-work";
import type { CaseStudyMeta } from "@/lib/case-studies";
import WorkList from "@/components/ui/WorkList";
import HeaderMotion from "@/components/ui/HeaderMotion";

export default async function WorkPage({
  params,
}: {
  params: Promise<{ locale: "en" | "id" }>;
}) {
  const { locale } = await params;

  const featured = await Promise.all(
    featuredWork.map(async (item) => {
      const mod = (await import(`@/content/${locale}/work/${item.slug}.mdx`)) as {
        metadata: CaseStudyMeta;
      };
      return {
        slug: item.slug,
        image: item.image,
        categories: item.categories,
        title: mod.metadata.title,
        tags: mod.metadata.tags,
        role: mod.metadata.role,
      };
    })
  );

  return (
    <div className="px-4 py-16 md:px-12 lg:px-24 xl:px-40 2xl:px-56">
      <Heading />
      <WorkList locale={locale} featured={featured} archive={archiveWork[locale]} />
    </div>
  );
}

function Heading() {
  const t = useTranslations();
  return (
    <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2">
      <div>
        <h1 className="text-[clamp(3.5rem,8vw,8rem)] leading-[0.95] text-ink">{t("work.title")}</h1>
        <p className="mt-4 max-w-xl text-lg text-muted">{t("work.intro")}</p>
      </div>
      {/* ponytail: brightness lifts the asset bg (~#EAE8E2) to --bg; re-tune if regenerated. */}
      <HeaderMotion name="work-motion" brightness={1.045} className="mx-auto w-full max-w-xl md:-mr-8 lg:-mr-20 xl:-mr-32" />
    </div>
  );
}
