@AGENTS.md

# Mode kerja: Claude build, Rizki review di akhir

**Update mode (2026-09-30): mode berubah dari "manual dengan mentor" ke
"Claude build semuanya".** Rizki sekarang minta Claude yang langsung nulis
dan bangun seluruh project (Write/Edit boleh dipakai bebas sesuai roadmap),
Rizki akan baca-baca dan nanya-nanya setelah project selesai, bukan
step-by-step lagi.

Yang tetap berlaku dari mode sebelumnya:
- **Tetap wajib bikin catatan pembelajaran** di `notes/<topik>.md` tiap
  bagian selesai dibangun — isinya penjelasan *kenapa* dibangun begitu,
  keputusan teknis yang diambil, dan gotcha yang ditemui. Ini supaya Rizki
  bisa "baca-baca" dan paham progressnya walau nggak ngetik manual.
  Referensi notes yang sudah ada: `notes/roadmap.md` (urutan build),
  `notes/routing-locale-foundation.md` (fondasi routing, sudah selesai).
- Sumber kebenaran tetap `PRD Website Portfolio Rizki Adi Prasetyo.md` —
  jangan mengarang keputusan produk/desain yang bertentangan dengan PRD.
- Ikuti urutan di `notes/roadmap.md` (fondasi → motion → konten/halaman →
  kualitas/rilis) supaya dependency antar bagian benar.

Sumber kebenaran proyek: `PRD Website Portfolio Rizki Adi Prasetyo.md` di
root repo. Baca itu untuk sitemap, spesifikasi halaman, design tokens, motion
tokens & katalog animasi, tech stack, dan urutan prompt komponen motion.
Jangan mengarang keputusan produk/desain yang bertentangan dengan PRD tanpa
konfirmasi.

Ringkasan stack (detail lengkap ada di PRD):
- Next.js 16 App Router + TypeScript, Tailwind v4, next-intl (`/en` `/id`).
- Motion: GSAP + ScrollTrigger + SplitText via `@gsap/react` (`useGSAP`),
  Lenis untuk smooth scroll. Semua nilai durasi/easing/stagger dari
  `lib/motion.ts`, jangan angka mentah di komponen.
- Konten case study: MDX; teks UI: JSON per locale. Contact form: Server
  Action + Zod + Resend ke riiizkiadiii@gmail.com.
- Struktur folder yang disepakati ada di bagian "Tech stack & arsitektur"
  PRD — ikuti itu saat membuat file baru.

Progress saat ini: masih scaffold default `create-next-app`, belum ada
implementasi PRD.

**Catatan belajar.** Setiap sesi pembelajaran (penjelasan konsep, review,
diskusi arsitektur), tulis ringkasannya ke `notes/<topik>.md` (misal
`notes/lenis-scrolltrigger-sync.md`, `notes/motion-tokens.md`). Satu file per
topik, isi singkat: konsep inti, kenapa dipilih caranya begini, gotcha yang
perlu diingat. Ini catatan Rizki untuk belajar, bukan dokumentasi proyek —
jangan taruh di README atau file lain. Kalau ada diagram, tulis sebagai kode
mermaid di dalam file notes tsb (fenced ```mermaid), jangan di-render/publish
ke Artifact — biar dia yang compile sendiri.
