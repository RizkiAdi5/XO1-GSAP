# Roadmap belajar — Portfolio Rizki

Urutan ini disusun berdasarkan ketergantungan: satu topik diajarkan sebelum
topik lain yang butuh dia sebagai fondasi. Jangan loncat — tiap tahap nanti
ada file notes sendiri di folder ini.

## Fase 1 — Fondasi (harus kelar duluan, semua bergantung ke sini)

1. [x] **Routing & i18n** — `app/[locale]/`, middleware, next-intl config.
       Lihat `routing-locale-foundation.md`.
2. [x] **Design tokens** — Tailwind v4 + CSS variables (`--bg`, `--ink`,
       `--accent`, dst dari PRD), font setup (`next/font`: Geist +
       Instrument Serif). Lihat `global-layout.md`.
3. [x] **Global layout statis** — Header, Footer, mobile menu (versi
       **tanpa animasi** dulu, cuma HTML/CSS/Tailwind jalan). Lihat
       `global-layout.md`.

## Fase 2 — Motion foundation (baru masuk sini setelah UI statis ada)

4. [x] **`lib/motion.ts`** — motion tokens (durasi/easing/stagger) sesuai
       PRD. Lihat `motion-foundation.md`.
5. [x] **`lib/lenis.tsx`** — Lenis provider, sinkron ke ScrollTrigger. Lihat
       `motion-foundation.md`.
6. [x] **Komponen motion urut dari PRD**: RollText (`component-rolltext.md`),
       SplitHeading → Reveal → Marquee → Odometer → WordRotator →
       MenuOverlay → ProjectCard hover → ParallaxImage → Page transition
       (`motion-components.md`). Page transition akhirnya diimplementasi
       pakai browser View Transitions API langsung (bukan React
       `ViewTransition` component, itu masih belum ke-expose di dependency
       yang terinstall — lihat catatan GAP di `motion-components.md`).

## Fase 3 — Konten & halaman

7. [x] **Struktur konten** — MDX untuk case study (4 project × 2 bahasa,
       metadata lengkap + narasi placeholder TODO), JSON untuk teks UI.
       Lihat `content-case-studies.md`.
8. [x] **Halaman: Home** → **Work** → **Case study template** → **About**
       → **Contact**. Semua 5 halaman jalan, lolos build. Lihat
       `pages-and-contact-form.md`.
9. [x] **Contact form** — Server Action + Zod + Resend + honeypot + rate
       limit. **Butuh `RESEND_API_KEY` diisi manual di `.env.local`**
       sebelum bisa kirim email beneran — lihat "ACTION REQUIRED" di
       `pages-and-contact-form.md`.

## Fase 4 — Kualitas & rilis

10. [ ] **SEO & metadata** — per-locale metadata, sitemap, robots, OG image,
        structured data `Person`.
11. [ ] **Aksesibilitas** — audit WCAG 2.2 AA, keyboard nav, kontras.
12. [ ] **Performa** — Lighthouse, Core Web Vitals, audit JS task 50ms.
13. [ ] **Deploy** — Vercel + domain.

## Cara pakai roadmap ini
- Centang `[x]` kalau sudah selesai dan sudah direview.
- Setiap topik dapet file notes sendiri, judulnya sesuai nama topik di atas.
- Kalau ada topik yang keluar urutan (misal kamu penasaran duluan), boleh,
  tapi tandai di sini biar nggak kelewat pas balik ke urutan normal.
