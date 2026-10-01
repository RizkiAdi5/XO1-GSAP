import { useTranslations } from "next-intl";
import { featuredWork } from "@/lib/featured-work";
import { archiveWork } from "@/lib/archive-work";
import type { CaseStudyMeta } from "@/lib/case-studies";
import WorkList from "@/components/ui/WorkList";

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
        year: item.year,
        image: item.image,
        category: item.category,
        title: mod.metadata.title,
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
    <>
      <h1 className="text-4xl text-ink md:text-6xl">{t("work.title")}</h1>
      <p className="mt-4 max-w-xl text-muted">{t("work.intro")}</p>
    </>
  );
}
