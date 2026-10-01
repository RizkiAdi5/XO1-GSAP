# Struktur konten: MDX case study

Fase 3 poin 7 roadmap. Setup pipeline MDX + 4 case study (metadata lengkap,
narasi placeholder) di `/en` dan `/id`.

## Kenapa install `@next/mdx` (dependency baru)

PRD eksplisit nentuin MDX buat case study di bagian Tech Stack. Ini satu-
satunya dependency baru yang ditambahkan sejauh ini di luar yang udah ada
dari awal — nge-render Markdown+JSX dari nol itu bukan hal yang masuk akal
ditulis manual (beda dari kasus-kasus lain yang berhasil pakai fitur
bawaan). Package yang di-install: `@next/mdx`, `@mdx-js/loader`,
`@mdx-js/react`, `@types/mdx` — persis rekomendasi resmi Next.js docs
(`node_modules/next/dist/docs/01-app/02-guides/mdx.md`).

## Cara metadata disimpan: JS export, BUKAN frontmatter YAML

Pendekatan umum MDX biasanya pakai frontmatter (`---\ntitle: ...\n---`) yang
butuh plugin tambahan (`remark-frontmatter` + `remark-mdx-frontmatter`).
Di sini dipilih cara yang lebih sederhana: tiap file `.mdx` langsung
`export const metadata = {...}` di baris paling atas — MDX compile ke modul
JS biasa, jadi named export apa pun bisa diakses lewat
`import(...).metadata`. Nggak butuh plugin tambahan (ponytail: pakai fitur
bawaan MDX, bukan nambah dependency buat masalah yang udah keselesaian).

## Kenapa narasi case study isinya placeholder/TODO, bukan konten jadi

PRD sendiri nulis aturan tegas: **"setiap angka harus bisa dijelaskan
sumbernya saat interview."** Sembilan bagian template case study (konteks,
peran & keputusan, solusi, highlight teknis, dst) itu narasi pengalaman
kerja Rizki yang beneran — bukan sesuatu yang masuk akal buat dikarang,
karena ujungnya bakal jadi bahan yang Rizki presentasikan sebagai
pengalaman asli ke recruiter/klien. Kalau bagian ini diisi karangan, bukan
mempercepat kerja tapi berisiko bikin Rizki kejebak pas interview ditanya
detail yang sebenarnya nggak pernah terjadi persis begitu.

**Yang tetap diisi dari PRD (karena itu data yang udah Rizki konfirmasi
sendiri di dokumen PRD):** title, role, period, team, stack, summary
1-kalimat, dan 3-4 angka hasil utama — semua persis dari tabel "Konten case
study" di PRD.

**Yang sengaja dikosongin jadi TODO + pertanyaan pemandu:** 6 section
narasi (Context, Role & decisions, Solution, Technical highlights, Results
in numbers expanded, Lessons learned) — tiap section dikasih komentar MDX
(`{/* ... */}`) berisi pertanyaan spesifik buat mandu Rizki nulis sendiri,
bukan textbox kosong tanpa arahan.

## Bug yang ketemu: HTML comment nggak valid di MDX

Awalnya nulis placeholder pakai `<!-- komentar -->` (sintaks HTML biasa) —
build gagal dengan error `Unexpected character '!' before name`. MDX
mem-parsing `<...>` sebagai kemungkinan awal JSX tag, bukan HTML comment
biasa kayak markdown murni. **Sintaks komentar yang benar di MDX itu
`{/* ... */}`** (komentar JS di dalam JSX expression) — pesan errornya
sendiri kasih tau ini. Semua 8 file (4 case study × 2 bahasa) dibetulin
sekaligus pakai script Python regex, bukan manual satu-satu.

## Struktur teknis

- `lib/case-studies.ts` — daftar `caseStudySlugs` (array const, urutannya
  nentuin "next case study" navigation) + tipe `CaseStudyMeta`.
- `content/{en,id}/work/<slug>.mdx` — satu file per case study per bahasa.
- `app/[locale]/work/[slug]/page.tsx` — dynamic import
  `` `@/content/${locale}/work/${slug}.mdx` `` (import dinamis dengan
  template literal path — pola yang sama kayak `i18n/request.ts` buat load
  `messages/*.json`, webpack bisa resolve ini karena sebagian path-nya
  statis/"context module").
- `mdx-components.tsx` (root project, **wajib** ada biar `@next/mdx` jalan
  di App Router) — styling default buat heading/paragraf/list di semua
  konten MDX, biar otomatis konsisten sama design token tanpa nulis
  className di tiap file `.mdx`.
- `next.config.ts` — ditambah `pageExtensions` termasuk `md`/`mdx` dan
  di-wrap `withMDX()`, urutan wrapping: `withNextIntl(withMDX(nextConfig))`.

## Next
- Lanjut ke halaman: Work (listing + arsip + filter kategori), Home
  (lengkapi sesuai spesifikasi PRD, pasang komponen motion), About,
  Contact (form + Server Action + Zod + Resend).
