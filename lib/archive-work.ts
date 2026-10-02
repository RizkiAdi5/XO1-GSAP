// Archive projects (PRD: "Arsip", no detail page). Content comes from
// Rizki's portfolio PDF (2026). `year` and `stack` are optional: the PDF
// doesn't state them for every project, and an empty field is better than
// an invented one or a "TODO" shown on the live site.

// Filter categories on /work. An item can sit in several (e.g. a café
// system is both a customer website and an admin dashboard).
export type WorkCategory = "web" | "dashboard" | "erp" | "finance";

export type ArchiveItem = {
  title: string;
  role?: string;
  year?: string;
  categories: WorkCategory[];
  sentence: string;
  stack?: string[];
};

export const archiveWork: Record<"en" | "id", ArchiveItem[]> = {
  en: [
    {
      title: "Epicor ERP Implementation",
      role: "Project lead",
      categories: ["erp"],
      sentence:
        "Procurement, Sales and Production modules configured in Epicor ERP for a client case, with redesigned workflows and documented automation gains.",
      stack: ["Epicor ERP"],
    },
    {
      title: "Café Kopi Tarik System",
      categories: ["web", "dashboard"],
      sentence:
        "One system for a café's ordering, inventory and sales tracking, with fewer manual errors and a live view of daily operations.",
    },
    {
      title: "Hazel Restaurant System",
      categories: ["web", "dashboard"],
      sentence:
        "A restaurant system linking orders, inventory and financial tracking, so the front of house and the back office share the same live data.",
    },
    {
      title: "Inventory Management System",
      categories: ["erp", "dashboard"],
      sentence:
        "An ERP for inventory, sales and purchasing on a relational database designed from an ERD, made for a Database Management course.",
      stack: ["SQL", "ERD"],
    },
  ],
  id: [
    {
      title: "Implementasi Epicor ERP",
      role: "Project lead",
      categories: ["erp"],
      sentence:
        "Modul Procurement, Sales, dan Production di Epicor ERP dikonfigurasi untuk studi kasus klien, dengan alur kerja yang dirancang ulang dan hasil otomasi yang terdokumentasi.",
      stack: ["Epicor ERP"],
    },
    {
      title: "Sistem Café Kopi Tarik",
      categories: ["web", "dashboard"],
      sentence:
        "Satu sistem untuk pemesanan, stok, dan pencatatan penjualan kafe, dengan kesalahan input lebih sedikit dan operasional harian yang bisa dipantau langsung.",
    },
    {
      title: "Sistem Hazel Restaurant",
      categories: ["web", "dashboard"],
      sentence:
        "Sistem restoran yang menghubungkan pesanan, stok, dan pencatatan keuangan, sehingga bagian depan dan dapur memakai data yang sama secara langsung.",
    },
    {
      title: "Sistem Manajemen Inventaris",
      categories: ["erp", "dashboard"],
      sentence:
        "ERP untuk stok, penjualan, dan pembelian di atas database relasional yang dirancang dari ERD, dibuat untuk mata kuliah Database Management.",
      stack: ["SQL", "ERD"],
    },
  ],
};
