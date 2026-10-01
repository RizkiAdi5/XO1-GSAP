import type { CaseStudySlug } from "./case-studies";
import type { ArchiveItem } from "./archive-work";

export const featuredWork: {
  slug: CaseStudySlug;
  year: string;
  image: string;
  category: ArchiveItem["category"];
}[] = [
  { slug: "netiquette-cloud-erp", year: "2025–2026", image: "/images/work/netiquette-cloud-erp.jpg", category: "erp" },
  { slug: "dikita-laundry", year: "2026", image: "/images/work/dikita-laundry.jpg", category: "fullstack" },
  { slug: "pufa-compsci", year: "2024–2025", image: "/images/work/pufa-compsci.jpg", category: "fullstack" },
  { slug: "finance-system", year: "2025", image: "/images/work/finance-system.jpg", category: "fullstack" },
];
