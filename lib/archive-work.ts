// Archive projects (PRD: "Arsip", no detail page). PRD only gives titles
// and (for one) a role — it doesn't give year/one-sentence summary/stack
// per item, so those are left as TODO for Rizki to fill in rather than
// invented. Same rule as the case study narrative sections: don't present
// fabricated project facts as real work experience.

export type ArchiveItem = {
  title: string;
  role?: string;
  year: string;
  category: "frontend" | "erp" | "fullstack";
  sentence: string;
  stack: string[];
};

const TODO_YEAR = "TODO — isi tahun";
const TODO_SENTENCE = "TODO — tulis satu kalimat: masalah + hasil";
const TODO_STACK = ["TODO — isi stack"];

export const archiveWork: Record<"en" | "id", ArchiveItem[]> = {
  en: [
    {
      title: "Epicor ERP Implementation — PT PTI",
      role: "Project Manager",
      year: TODO_YEAR,
      category: "erp",
      sentence: TODO_SENTENCE,
      stack: TODO_STACK,
    },
    {
      title: "Epicor ERP Presales Simulation",
      year: TODO_YEAR,
      category: "erp",
      sentence: TODO_SENTENCE,
      stack: TODO_STACK,
    },
    {
      title: "Café Kopi Tarik System",
      year: TODO_YEAR,
      category: "fullstack",
      sentence: TODO_SENTENCE,
      stack: TODO_STACK,
    },
    {
      title: "Hazel Restaurant System",
      year: TODO_YEAR,
      category: "fullstack",
      sentence: TODO_SENTENCE,
      stack: TODO_STACK,
    },
    {
      title: "PT Amatoa Jaya Gemilang — Basic ERP",
      year: TODO_YEAR,
      category: "erp",
      sentence: "Coursework project (Database Management).",
      stack: TODO_STACK,
    },
  ],
  id: [
    {
      title: "Implementasi Epicor ERP — PT PTI",
      role: "Project Manager",
      year: TODO_YEAR,
      category: "erp",
      sentence: TODO_SENTENCE,
      stack: TODO_STACK,
    },
    {
      title: "Simulasi Presales Epicor ERP",
      year: TODO_YEAR,
      category: "erp",
      sentence: TODO_SENTENCE,
      stack: TODO_STACK,
    },
    {
      title: "Sistem Café Kopi Tarik",
      year: TODO_YEAR,
      category: "fullstack",
      sentence: TODO_SENTENCE,
      stack: TODO_STACK,
    },
    {
      title: "Sistem Hazel Restaurant",
      year: TODO_YEAR,
      category: "fullstack",
      sentence: TODO_SENTENCE,
      stack: TODO_STACK,
    },
    {
      title: "PT Amatoa Jaya Gemilang — ERP Dasar",
      year: TODO_YEAR,
      category: "erp",
      sentence: "Proyek mata kuliah Database Management.",
      stack: TODO_STACK,
    },
  ],
};
