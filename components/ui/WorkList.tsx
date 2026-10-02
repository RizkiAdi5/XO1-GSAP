"use client";

import type { StaticImageData } from "next/image";
import { useState } from "react";
import { useTranslations } from "next-intl";
import ProjectCard from "@/components/ui/ProjectCard";
import type { ArchiveItem, WorkCategory } from "@/lib/archive-work";

type FeaturedItem = {
  slug: string;
  tags: string[];
  image: StaticImageData;
  title: string;
  role: string;
  categories: WorkCategory[];
};

type Category = "all" | WorkCategory;

export default function WorkList({
  locale,
  featured,
  archive,
}: {
  locale: string;
  featured: FeaturedItem[];
  archive: ArchiveItem[];
}) {
  const t = useTranslations();
  const [category, setCategory] = useState<Category>("all");

  const categories: Category[] = ["all", "web", "dashboard", "erp", "finance"];
  const filteredFeatured =
    category === "all"
      ? featured
      : featured.filter((i) => i.categories.includes(category));
  const filteredArchive =
    category === "all"
      ? archive
      : archive.filter((i) => i.categories.includes(category));

  return (
    <div>
      <div className="mt-8 flex flex-wrap gap-2">
        {categories.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCategory(c)}
            aria-pressed={category === c}
            className={`rounded-ui border px-3 py-1 text-sm ${
              category === c
                ? "border-accent bg-accent text-surface"
                : "border-line text-ink"
            }`}
          >
            {t(`work.filters.${c}`)}
          </button>
        ))}
      </div>

      {/* Each section only renders if the active filter leaves something in it. */}
      {filteredFeatured.length > 0 && (
        <>
          <h2 className="mt-12 text-2xl text-ink">{t("work.featuredTitle")}</h2>
          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
            {filteredFeatured.map((item) => (
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
        </>
      )}

      {filteredArchive.length > 0 && (
        <>
          <h2 className="mt-16 text-2xl text-ink">{t("work.archiveTitle")}</h2>
          <ul className="mt-6 divide-y divide-line border-y border-line">
            {filteredArchive.map((item) => (
              <li
                key={item.title}
                className="flex flex-col gap-1 py-4 sm:flex-row sm:items-baseline sm:justify-between"
              >
                <div>
                  <p className="text-ink">
                    {item.title}
                    {item.role && (
                      <span className="text-muted"> · {item.role}</span>
                    )}
                  </p>
                  <p className="text-sm text-muted">{item.sentence}</p>
                  {item.stack && (
                    <p className="text-sm text-muted">
                      {item.stack.join(" · ")}
                    </p>
                  )}
                </div>
                {item.year && (
                  <span className="text-sm text-muted">{item.year}</span>
                )}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
