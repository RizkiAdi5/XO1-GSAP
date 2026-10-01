# Halaman: Home, Work, About, Contact

Fase 3 poin 8 & 9 roadmap. Kelima halaman utama (Home, Work, case study
template, About, Contact) sekarang jalan, lolos `npm run build`.

## Home (`app/[locale]/page.tsx`)

Dipecah jadi komponen kecil per section (`Hero`, `MarqueeSection`,
`SelectedWork`, `Numbers`, `WhatIDo`, `Experience`, `ContactCta`) di satu
file — bukan satu function raksasa — supaya tiap section jelas tugasnya
dan gampang di-reorder kalau urutan section berubah nanti.

- **H1 hero SENGAJA tidak dibungkus `Reveal`/`SplitHeading`** — itu elemen
  LCP, harus ke-paint pertama kali tanpa nunggu animasi (aturan wajib PRD).
  Subheading & CTA di bawahnya baru dibungkus `Reveal`.
- **4 kartu "Selected work" ambil `title`/`role` dari metadata MDX case
  study** (`await import(...)` per slug, sama pola kayak halaman case
  study) — bukan diketik ulang di sini. Data cuma ada di SATU tempat
  (file `.mdx`-nya), Home & Work page tinggal baca.
- Year + gambar + kategori filter-nya ada di `lib/featured-work.ts` (data
  yang nggak masuk akal ditaruh di MDX karena bukan bagian "cerita" case
  study, cuma metadata tampilan kartu).

## Work (`app/[locale]/work/page.tsx` + `components/ui/WorkList.tsx`)

- Page (Server Component) fetch data, render ke `WorkList` (Client
  Component) yang pegang state filter kategori (`useState`) — pembagian
  ini standar Next.js App Router: data-fetching di server, interaktivitas
  di client, sekecil mungkin client boundary-nya.
- Filter "All · Frontend · ERP · Full-stack" motong DUA daftar sekaligus
  (featured cards + archive list) pakai satu state yang sama.
- **Arsip 5 proyek** (`lib/archive-work.ts`): PRD cuma kasih judul (+ satu
  role buat item PTI), TANPA tahun/kalimat ringkasan/stack per item. Field
  yang nggak ada datanya diisi literal string `"TODO — isi tahun"` dkk,
  bukan dikarang — sama alasannya kayak narasi case study
  (`content-case-studies.md`): ini bakal jadi klaim pengalaman kerja nyata,
  bukan lorem ipsum yang boleh asal-asalan.

## About (`app/[locale]/about/page.tsx`)

Beda dari Work/case-study, isi About **langsung diisi penuh** (bio,
journey, skills, pendidikan, organisasi, sertifikasi, bahasa) — karena
semua data ini SUDAH ada eksplisit di tabel/daftar PRD sendiri (bukan
narasi yang perlu digali dari pengalaman Rizki, tapi fakta CV yang udah
dikonfirmasi dia sendiri saat nulis PRD).

**Perlu direview manual satu hal:** paragraf bio di `messages.home.bio`
(EN & ID) itu disusun otomatis dari fakta-fakta yang ada di PRD (positioning
statement + journey + role sekarang) — bukan kalimat asli tulisan Rizki.
Cek lagi nada bahasanya cocok sama suara yang Rizki mau apa nggak.

Foto profil masih placeholder kotak abu-abu — PRD sendiri nyebut ini
pertanyaan terbuka ("foto baru gaya editorial atau pakai yang ada?"),
jadi sengaja belum diisi gambar asli.

## Contact (`app/[locale]/contact/page.tsx` + `ContactForm.tsx` + `actions.ts`)

- **Server Action** (`"use server"` di `actions.ts`) dipanggil langsung
  dari form via `<form action={formAction}>` — pola native React 19 /
  Next.js App Router, TIDAK butuh `fetch` manual ke API route. Client
  Component (`ContactForm.tsx`) pakai `useActionState` (React 19, pengganti
  `useFormState` versi lama) buat baca status (`idle`/`success`/`error`)
  dan `pending` state.
- **Validasi**: `lib/contact-schema.ts` — satu skema Zod dipakai di server
  action (client-side cuma validasi native HTML `required`/`type="email"`/
  `minLength` sebagai UX cepat, validasi SEBENARNYA tetap di server karena
  client-side bisa dilewatin).
- **Honeypot**: field tersembunyi (`name="company"`, `className="hidden"`,
  `tabIndex={-1}`) — user asli nggak akan pernah ngisi field yang mereka
  nggak lihat, tapi bot yang ngisi form otomatis biasanya ngisi SEMUA
  field yang ada di DOM. Kalau field ini keisi, server **pura-pura**
  sukses (nggak kasih tau bot kalau ketauan) — bot nggak belajar buat skip
  field ini lain kali.
- **Rate limit per IP**: `Map` in-memory nyimpen timestamp submission per
  IP, window 60 detik, maks 3 kiriman. Ditandai komentar `ponytail:` di
  kode karena ini punya batasan jelas (reset kalau server restart, nggak
  sharing state kalau deploy multi-instance) — cukup buat portfolio
  single-instance, upgrade ke Redis/Upstash kalau traffic naik.
- **Email**: `resend.emails.send(...)` ke `riiizkiadiii@gmail.com`,
  `replyTo` di-set ke email pengirim (biar bisa langsung reply dari Gmail
  tanpa copy-paste).

### ACTION REQUIRED sebelum form ini bisa kirim email beneran

Butuh `RESEND_API_KEY` di environment variable — belum ada nilainya di
project ini. Template-nya udah dibikin di `.env.example` (file ini
ke-gitignore sama pattern `.env*` yang udah ada dari awal, jadi nggak
otomatis ke-commit — kalau mau di-commit sebagai referensi, pakai
`git add -f .env.example`).

Langkah buat Rizki:
1. Daftar di resend.com, bikin API key.
2. Copy `.env.example` → `.env.local`, isi `RESEND_API_KEY=re_xxx`.
3. Domain pengirim email masih pakai `onboarding@resend.dev` (default
   testing Resend) — buat production, perlu verifikasi domain sendiri di
   Resend supaya nggak masuk spam folder.

Tanpa API key, form tetap render & tervalidasi normal, tapi submit bakal
selalu balik status "error" (sudah ditangani rapi, ada fallback ke alamat
email langsung).

## Aset placeholder yang dibikin sepanjang sesi ini

- `public/images/work/*.jpg` — 4 gambar solid color polos (bukan
  screenshot/render asli) buat `ProjectCard`, karena aset visual asli
  (render AI/screenshot rapi) itu proses terpisah yang dijelasin sendiri
  di bagian "Prompt aset visual" PRD — di luar scope kode.

## Next
- Fase 3 selesai secara struktur & teknis. Sisa kerjaan manusia: isi
  narasi case study, data arsip, review bio, foto asli, link LinkedIn/
  GitHub asli, `RESEND_API_KEY`.
- Lanjut ke Fase 4: SEO & metadata, audit aksesibilitas, audit performa
  (Lighthouse/CWV), lalu deploy.
