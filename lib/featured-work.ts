import type { CaseStudySlug } from "./case-studies";
import type { WorkCategory } from "./archive-work";
import type { StaticImageData } from "next/image";
// Static imports, not "/images/..." strings: the URL then carries a hash of
// the file content, so replacing a file busts every cache (next/image, browser,
// CDN) automatically. String paths kept serving the old placeholder.
import netiquetteCloudErp from "@/public/images/work/netiquette-cloud-erp.jpg";
import dikitaLaundry from "@/public/images/work/dikita-laundry.jpg";
import pufaCompsci from "@/public/images/work/pufa-compsci.jpg";
import financeSystem from "@/public/images/work/finance-system.jpg";

export const featuredWork: {
  slug: CaseStudySlug;
  image: StaticImageData;
  categories: WorkCategory[];
}[] = [
  { slug: "netiquette-cloud-erp", image: netiquetteCloudErp, categories: ["erp", "web", "finance"] },
  { slug: "dikita-laundry", image: dikitaLaundry, categories: ["web", "dashboard"] },
  { slug: "pufa-compsci", image: pufaCompsci, categories: ["web"] },
  { slug: "finance-system", image: financeSystem, categories: ["finance", "dashboard"] },
];
