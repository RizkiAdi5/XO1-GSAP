export type CaseStudyMeta = {
  title: string;
  role: string;
  /** Card chips: project type, then client sector, e.g. ["WEB", "MANUFACTURING"]. */
  tags: string[];
  period: string;
  team?: string;
  stack: string[];
  liveUrl?: string;
  summary: string;
  results: string[];
};

// Order here also drives "next case study" navigation on the case study page.
export const caseStudySlugs = [
  "netiquette-cloud-erp",
  "dikita-laundry",
  "pufa-compsci",
  "finance-system",
] as const;

export type CaseStudySlug = (typeof caseStudySlugs)[number];
