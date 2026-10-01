# PRD Website Portfolio Rizki Adi Prasetyo

Sep 30, 2026 · @bersyukur

## Ringkasan & latar belakang

Website portfolio baru menggantikan web-rizki-adi.vercel.app dengan situs Next.js bilingual (EN/ID), 4 case study lengkap, dan sistem motion kelas studio, live di rizkiadiprasetyo.site dalam 3 minggu.

**Kondisi web lama.** Web saat ini memakai template HTML statis dengan 5 halaman: Home, About, Projects, Resume, Contact. Semua kartu proyek mengarah ke satu halaman yang sama, jadi tidak ada satu pun proyek yang bisa dibaca detailnya. Situs hanya berbahasa Inggris dan memakai email lama.

**Masalah yang diselesaikan.**

- Recruiter dan klien tidak bisa melihat cara berpikir Rizki: masalah, keputusan, dan hasil per proyek.
- Situs tidak membuktikan skill frontend dan motion, padahal itu yang ditawarkan.
- Positioning terbelah: CV menjual Frontend/Full-Stack, PDF portfolio menjual ERP & Project Management.
- Kontak tidak konsisten antara CV, PDF, dan web lama.

**Referensi.** upsunday.co dipakai sebagai acuan teknik dan disiplin motion (GSAP, Lenis, motion tokens, anggaran performa). Desain, teks, dan aset visualnya tidak ditiru.

## Tujuan, target pengguna & metrik sukses

Situs ini harus membuat pengunjung paham dalam 30 detik bahwa Rizki adalah frontend engineer yang paham cara bisnis berjalan, lalu menghubunginya.

**Positioning (hybrid).**

- EN: *Frontend engineer who understands how businesses run.* ERP, accounting and business systems, built with craft.
- ID: *Frontend engineer yang paham cara bisnis berjalan.* Sistem ERP, akuntansi, dan bisnis, dibangun dengan detail.

**Tujuan.**

1. Menyatukan positioning frontend + ERP dalam satu cerita yang konsisten di semua halaman.
2. Mengubah pengunjung menjadi kontak lewat contact form, WhatsApp, atau email.
3. Menjadikan situs itu sendiri bukti skill frontend dan motion.

**Target pengguna.**

| Persona | Yang mereka cari | Yang harus ditemukan dalam 30 detik |
| --- | --- | --- |
| Recruiter / HR lokal | Pengalaman kerja, skill, domisili | Headline, pengalaman Netiquette, tombol kontak |
| Perusahaan luar negeri (remote, SG/MY) | Bahasa Inggris, pengalaman SaaS multi-negara, zona waktu | Versi EN, klien 4 negara, Peppol/InvoiceNow, GMT+7 |
| Klien freelance (UMKM) | Bukti hasil bisnis, harga wajar, kontak cepat | Case study Dikita Laundry, 1.000+ order, WhatsApp, versi ID |

**Metrik sukses (target).**

| Metrik | Target | Cara ukur |
| --- | --- | --- |
| Lighthouse mobile (Performance, A11y, Best Practices, SEO) | ≥ 90 tiap kategori | Lighthouse CI sebelum launch |
| Core Web Vitals | LCP ≤ 2,5 s · INP ≤ 200 ms · CLS ≤ 0,1 | Vercel Speed Insights |
| Contact form | 100% pesan terkirim ke email, error rate 0 | Log server + tes manual |
| Keterlibatan case study | Rasio klik Home → case study dipantau per bulan | Vercel Analytics |

## Scope

Versi 1 fokus pada 5 halaman utama, 4 case study, bilingual, contact form, dan motion; blog, download CV, dan dark mode ditunda.

| Fitur | Prioritas v1 | Catatan |
| --- | --- | --- |
| Home, Work, About, Contact | Must | Multi-page, App Router |
| 4 halaman case study | Must | Netiquette, Dikita, PUFA, Finance System |
| Arsip proyek lain | Must | Kartu ringkas di halaman Work, tanpa halaman detail |
| Bilingual EN + ID | Must | EN default, toggle di header |
| Contact form ke email | Must | Terkirim ke riiizkiadiii@gmail.com |
| Motion system (Lenis + GSAP) | Must | Lihat bagian Motion system |
| SEO + analytics | Must | Metadata per bahasa, sitemap, Vercel Analytics |
| Transisi antar halaman | Should | Ringan, tidak boleh menunda konten |
| Preloader | Could | Hanya jika tidak merusak LCP; maksimal sekali per sesi |
| Custom cursor | Could | Desktop dengan mouse saja |
| Blog / notes | Won't (v1) | Kandidat v2 |
| Download CV | Won't (v1) | Kandidat v2 |
| Dark mode | Won't (v1) | Token warna disiapkan agar mudah ditambah |
| CMS eksternal | Won't (v1) | Konten disimpan di repo (MDX/JSON) |
| 3D real-time (WebGL) | Won't (v1) | Pakai gambar atau video jika perlu 3D |

## Sitemap

Situs punya 4 halaman utama dan 4 halaman case study, masing-masing tersedia di `/en` dan `/id`.

&#91;embedded content: sitemap · 4 halaman utama, 4 case study\]

Contoh URL: `/en`, `/en/work`, `/en/work/dikita-laundry`, `/id/about`, `/id/contact`. Proyek arsip tampil di halaman Work tanpa URL sendiri.

## Spesifikasi per halaman

Setiap halaman punya satu tugas utama, dan setiap halaman berakhir dengan ajakan kontak.

### Global (semua halaman)

- **Header:** logo/nama, link Work · About · Contact, toggle EN/ID, tombol "Let's talk" dengan efek roll.
- **Menu mobile:** overlay fullscreen, link besar masuk dengan stagger, plus email, WhatsApp, LinkedIn.
- **Footer:** ajakan kontak, email, WhatsApp, LinkedIn, GitHub, lokasi "Cikarang, Indonesia · GMT+7", hak cipta.

### Home

Tugas: menjelaskan siapa Rizki dan mengarahkan ke case study.

1. **Hero:** nama, headline positioning, satu kalimat pendukung, CTA "See work" dan "Let's talk", badge status (misal "Open to opportunities").
2. **Marquee:** nama domain keahlian (ERP, Accounting, POS, E-Invoicing, Next.js, Go) berjalan tanpa henti.
3. **Selected work:** 4 kartu case study dengan gambar, judul, peran, tahun.
4. **Angka:** 70+ layar ERP dimodernisasi, 80% POS lebih cepat, 70% input invoice manual berkurang, 1.000+ order diproses.
5. **What I do:** 4 kartu — Frontend engineering, ERP & system integration, Business systems untuk UMKM, Team & project leadership.
6. **Experience singkat:** Netiquette Asia (Software Developer + Indonesia Market Lead) dan organisasi kampus, link ke About.
7. **Contact CTA:** kalimat dengan kata yang berganti-ganti (word rotator) dan tombol kontak.

### Work

Tugas: menampilkan semua karya dengan hierarki yang jelas.

- 4 case study unggulan dalam format kartu besar.
- Arsip: Epicor ERP Implementation (PT PTI), Epicor presales simulation, Café Kopi Tarik, Hazel Restaurant, ERP dasar PT Amatoa. Tiap item berisi judul, tahun, kategori, satu kalimat, dan stack.
- Filter kategori sederhana: All · Frontend · ERP · Full-stack.

### Case study (template sama untuk 4 proyek)

1. Judul, peran, periode, tim, stack, link live (jika ada).
2. Ringkasan satu kalimat: masalah dan hasil.
3. Konteks dan masalah.
4. Peran Rizki dan keputusan penting.
5. Solusi dan proses, dengan gambar atau mockup.
6. Highlight teknis (arsitektur, keamanan, performa).
7. Hasil dalam angka.
8. Pelajaran yang diambil.
9. Navigasi ke case study berikutnya.

### About

Tugas: membangun kepercayaan dan menunjukkan kepribadian.

- Bio singkat dan foto.
- Perjalanan: Darussalam Sengkubang (2020) → President University (2023) → PUFA CompSci (2024) → Netiquette Asia (2025) → Indonesia Market Lead (2026).
- Skill dikelompokkan: Frontend, Backend & API, Database, ERP & domain, Leadership.
- Pendidikan: Sistem Informasi (konsentrasi ERP), IPK 3,95, Jababeka Future Leader Scholarship.
- Organisasi: BEM Fakultas Ilmu Komputer, Investment Club.
- Sertifikasi: Google Project Management (Coursera), Alibaba Cloud Certified Developer, Core HR & Analytics.
- Bahasa: Inggris (profesional), Indonesia (native).

### Contact

Tugas: membuat menghubungi Rizki semudah mungkin.

- **Form:** nama, email, tipe (Job opportunity · Freelance project · Other), pesan.
- **Validasi:** semua field wajib, format email dicek, pesan minimal 20 karakter.
- **Anti-spam:** honeypot field dan batas kiriman per IP.
- **Status:** loading, sukses (terima kasih + estimasi balas), gagal (pesan error + alternatif email).
- **Kanal lain:** WhatsApp, email, LinkedIn, dengan catatan zona waktu GMT+7.

## Konten case study

Empat case study dipilih karena bersama-sama menunjukkan seluruh positioning: SaaS profesional, produk nyata untuk UMKM, kepemimpinan teknis, dan project management.

| Proyek | Peran | Periode | Stack | Hasil utama | Aset visual |
| --- | --- | --- | --- | --- | --- |
| Netiquette Cloud ERP | Software Developer (frontend focus) + Indonesia Market Lead | Aug 2025 – Sep 2026 | JavaScript, jQuery, HTML5, CSS3, ColdFusion, SQL, OCR, Peppol | 70+ layar dimodernisasi, POS 80% lebih cepat, input invoice manual turun 70% | Hanya deskripsi; mockup atau ilustrasi yang disamarkan, tanpa screenshot asli |
| Dikita Laundry (web profil + admin dashboard) | Full-Stack Developer | Sep 2026 | Next.js 15, React, TypeScript, Tailwind, MySQL, Prisma, JWT, DeepSeek AI | 1.000+ order, halaman 1 Google untuk "laundry singkawang", notifikasi WhatsApp otomatis, RBAC | Screenshot web publik dan dashboard |
| Website Fakultas Ilmu Komputer (PUFA CompSci) | Full-Stack Developer, Vice Head R&T | Aug 2024 – Sep 2025 | Next.js, React, Go, REST API, PostgreSQL | Engagement +40%, efisiensi sistem +35%, performa data +65% | Screenshot situs |
| Finance Management System (PT Duta Nusantara Teknik) | Team Lead & Full-Stack, tim 4 orang | Feb – May 2025 | Laravel, Filament, PHP, SQL | Waktu laporan keuangan turun 60%, efisiensi harian +45%, 100+ transaksi/hari, nilai sempurna | Screenshot aplikasi |

**Arsip (tanpa halaman detail):** Epicor ERP Implementation untuk kasus PT PTI (Project Manager), simulasi presales Epicor ERP, sistem Café Kopi Tarik, sistem Hazel Restaurant, dan ERP dasar PT Amatoa Jaya Gemilang (proyek mata kuliah Database Management).

**Aturan penulisan:** setiap angka harus bisa dijelaskan sumbernya saat interview. Teks ditulis dalam EN lebih dulu, lalu diterjemahkan ke ID.

## Arah visual

Gaya clean editorial: latar terang netral, tipografi besar, banyak ruang kosong, dan hanya satu warna aksen.

**Prinsip.**

- Tipografi adalah elemen visual utama; dekorasi seminimal mungkin.
- Satu warna aksen, dipakai untuk CTA, link aktif, dan satu sorotan per layar.
- Gambar proyek tampil besar dalam bingkai browser atau perangkat yang rapi.
- Grid konsisten sehingga semua halaman terasa satu sistem.

**Design tokens (usulan).**

| Token | Nilai | Pemakaian |
| --- | --- | --- |
| `--bg` | #F4F3EF (off-white hangat) | Latar halaman |
| `--surface` | #FFFFFF | Kartu, form |
| `--ink` | #111111 | Teks utama |
| `--muted` | #6B6B6B | Teks sekunder |
| `--line` | #E2E0DA | Garis pemisah, border |
| `--accent` | #2F45FF (cobalt) | CTA, link aktif, sorotan |
| Font display | Geist (sans) | Judul besar, angka |
| Font aksen | Instrument Serif italic | Satu-dua kata penekanan di judul |
| Font body | Geist | Paragraf, UI |
| Skala judul | `clamp(3rem, 10vw, 9rem)` | Hero |
| Radius | 4 px (UI), 12 px (kartu) |  |
| Grid | 12 kolom, max 1440 px, gutter 16 px mobile / 24 px desktop | Semua halaman |
| Breakpoint | 375 · 768 · 1024 · 1440 px | Responsive |

**Gambar.** Screenshot Dikita, PUFA, dan Finance System dirapikan dalam bingkai browser. Netiquette memakai ilustrasi abstrak atau mockup UI generik tanpa data klien.

## Motion system

Semua animasi mengambil nilai dari motion tokens yang sama, hanya menggerakkan `transform` dan `opacity`, dan punya versi reduced motion.

**Motion tokens.**

| Token | Nilai | Pemakaian |
| --- | --- | --- |
| `dur-fast` | 0,35 s | Hover, feedback kecil |
| `dur-base` | 0,7 s | Reveal, menu |
| `dur-slow` | 1,2 s | Hero, transisi halaman |
| `ease-out` | `cubic-bezier(.16, 1, .3, 1)` (expo.out) | Elemen masuk |
| `ease-inout` | `cubic-bezier(.7, 0, .2, 1)` | Roll teks, menu |
| `stagger` | 0,06 s | Jeda antar item |
| `distance` | 24 px | Jarak geser reveal |

**Katalog animasi.**

| Komponen | Efek | Pemicu | Teknik | Reduced motion |
| --- | --- | --- | --- | --- |
| Smooth scroll | Scroll halus dengan inersia | Scroll | Lenis, disinkronkan ke ScrollTrigger | Scroll native |
| Tombol & link | Teks roll ke atas | Hover | Dua span dalam overflow hidden | Ganti warna saja |
| Menu mobile | Overlay masuk, link stagger | Klik Menu | GSAP timeline | Fade cepat |
| Judul section | Reveal per baris | Masuk viewport | SplitText + mask | Tampil langsung |
| Marquee | Loop horizontal tanpa henti | Otomatis | Dua salinan, translateX -50% | Diam, ada tombol pause |
| Angka | Odometer bergulir | Masuk viewport | Kolom digit + ScrollTrigger | Angka final langsung |
| Kartu proyek | Gambar zoom 1,04, label "View" | Hover | CSS transform | Tanpa zoom |
| Word rotator | Kata berganti di CTA kontak | Otomatis | GSAP timeline loop | Kata pertama saja |
| Gambar parallax | Geser pelan saat scroll | Scroll | ScrollTrigger scrub | Nonaktif |
| Transisi halaman | Tirai atau crossfade | Pindah halaman | View Transitions API | Crossfade |

**Aturan wajib.**

- Judul hero sudah terlihat di paint pertama; animasi hanya untuk elemen sekunder, agar LCP tidak tertunda.
- Satu gerakan utama per layar.
- Animasi keluar lebih cepat daripada animasi masuk.
- Parallax dan custom cursor hanya aktif di perangkat dengan pointer presisi (`pointer: fine`).
- Semua efek dibungkus `gsap.matchMedia()` dengan kondisi `prefers-reduced-motion`.
- Semua animasi dites di HP kelas menengah, bukan hanya laptop.

## Prompt kode motion (untuk AI coding assistant)

Kirim **prompt konteks** sekali di awal sesi, lalu prompt komponen satu per satu sesuai urutan di bawah; tes tiap komponen sebelum lanjut.

**0. Prompt konteks (kirim pertama).**

```
You are helping me build my portfolio in Next.js 16 (App Router), TypeScript and Tailwind CSS v4.
Motion stack: GSAP (ScrollTrigger, SplitText) with @gsap/react useGSAP, plus Lenis for smooth scroll.
Motion tokens (use these, never raw values):
- durations: fast 0.35s, base 0.7s, slow 1.2s
- easing: out = "expo.out" / cubic-bezier(.16,1,.3,1), inOut = cubic-bezier(.7,0,.2,1)
- stagger 0.06s, distance 24px
Rules for every component:
- animate only transform and opacity
- wrap effects in gsap.matchMedia(); provide a prefers-reduced-motion fallback
- parallax and cursor effects only under (pointer: fine)
- clean up on unmount (useGSAP scope), no memory leaks
- client components only where needed ("use client")
- accessible: keyboard focus works, aria labels where text is duplicated
Put tokens in lib/motion.ts and components in components/motion/. Explain briefly, then give full code.
```

**1. Lenis provider.**

```
Create lib/lenis.tsx: a LenisProvider for the App Router root layout.
Sync Lenis with GSAP ScrollTrigger (lenis.on('scroll', ScrollTrigger.update) and drive lenis.raf from gsap.ticker, lagSmoothing(0)).
Disable Lenis when prefers-reduced-motion is on. Scroll to top on route change.
Expose a useLenis() hook so other components can call scrollTo.
```

**2. RollText (tombol & link).**

```
Create components/motion/RollText.tsx.
On hover/focus the label rolls up: two stacked copies inside overflow-hidden, both translateY(-100%) using duration fast and the inOut easing.
Pure CSS/Tailwind (group-hover, group-focus-visible), no GSAP.
The second copy is aria-hidden. Works inside <a> and <button>. Reduced motion: color change only.
```

**3. SplitHeading (reveal judul per baris).**

```
Create components/motion/SplitHeading.tsx.
Use SplitText to split into lines, each line wrapped in an overflow-hidden mask, lines slide up from yPercent 100 with stagger and ease out, triggered once when the heading enters the viewport (start: 'top 85%').
Re-split on resize (debounced) and revert SplitText on cleanup.
Must NOT be used on the hero H1 (LCP). Reduced motion: render text instantly.
```

**4. Reveal (elemen umum).**

```
Create components/motion/Reveal.tsx: wraps children and fades them in from y: distance (24px) with duration base, ease out, once on enter.
Support a stagger prop for direct children and a delay prop. Reduced motion: opacity only, 0.2s.
Elements must be visible if JavaScript fails (no opacity:0 in server HTML; set initial state in useGSAP).
```

**5. Marquee.**

```
Create components/motion/Marquee.tsx: infinite horizontal loop of items.
Render the item list twice, animate the track xPercent from 0 to -50 with linear ease and a speed prop (px per second), repeat -1.
Pause on hover and when the tab is hidden. Include a visible pause/play button (WCAG 2.2.2).
Speed up slightly with scroll velocity from Lenis. Reduced motion: static row, no animation.
```

**6. Odometer (angka).**

```
Create components/motion/Odometer.tsx with props value (e.g. "70+", "1,000+", "80%").
Each digit is a vertical column 0-9 inside an overflow-hidden cell; on enter, each column scrolls to its digit with duration slow, ease out and a small stagger from right to left. Non-digit characters stay static.
Screen readers read the final value via aria-label; columns are aria-hidden. Reduced motion: show final value.
```

**7. WordRotator (CTA kontak).**

```
Create components/motion/WordRotator.tsx with props words: string[] and interval (default 2s).
Words roll vertically inside an overflow-hidden inline box whose width animates smoothly to fit each word.
GSAP timeline, repeat -1, pauses when off-screen (ScrollTrigger toggleActions) and on hover.
aria-live off; aria-label lists all words. Reduced motion: show the first word only.
```

**8. Menu overlay.**

```
Create components/ui/MenuOverlay.tsx: fullscreen menu opened by a "Menu"/"Close" RollText toggle.
Open timeline: background panel clipPath inset from bottom (duration base, inOut), then large links rise with stagger, then contact row fades in. Close runs about 40% faster in reverse.
Lock scroll (lenis.stop), trap focus, close on Escape and on route change. Reduced motion: simple fade.
```

**9. ProjectCard hover + cursor label.**

```
Create components/ui/ProjectCard.tsx: image inside a rounded overflow-hidden frame; on hover image scales to 1.04 (duration base, ease out) and a small "View" pill follows the cursor using gsap.quickTo for x/y.
The pill appears only under (pointer: fine). On touch devices show a static arrow instead. Uses next/image.
```

**10. ParallaxImage.**

```
Create components/motion/ParallaxImage.tsx: image moves yPercent -10 to 10 inside an overflow-hidden frame, scrubbed by ScrollTrigger.
Only under (pointer: fine) and without reduced motion; otherwise static. Image is scaled 1.2 to avoid gaps.
```

**11. Transisi halaman.**

```
Add page transitions using the View Transitions API with the Next.js App Router.
Outgoing page fades and shifts up 16px (fast), incoming page fades in (base). Fallback: no transition in unsupported browsers.
Never delay rendering of the new page's main heading. Reduced motion: crossfade only.
```

## Prompt aset visual (gambar & video)

Empat aset butuh gerakan; semuanya dibuat di atas latar polos #F4F3EF agar menyatu dengan halaman tanpa perlu video transparan.

**Cara pakai.** Buat gambar diam dulu dengan generator gambar. Setelah hasilnya cocok, pakai gambar itu sebagai frame pertama di generator video (image-to-video). Gambar diam sekaligus jadi poster video dan fallback reduced motion.

**Style block (tempel di akhir setiap prompt gambar).**

```
Style: minimal editorial 3D render, soft matte materials with subtle frosted glass, one cobalt blue accent (#2F45FF) on warm off-white and light grey forms, solid plain background color #F4F3EF edge to edge, soft diffused studio light from top left, gentle soft shadows, generous empty space, calm and premium, high detail, no text, no letters, no numbers, no logos, no watermark, no people.
```

| Aset | Dipakai di | Rasio | Format akhir |
| --- | --- | --- | --- |
| Hero object loop | Home, samping judul hero | 1:1 | Video loop 4–6 s (MP4 + WebM) + poster WebP |
| Modul ERP tersinkron | Case study Netiquette (pengganti screenshot) | 16:9 | Video loop 6 s + poster |
| Objek CTA kontak | Section Contact di Home | 1:1 | Video loop 4 s + poster |
| Gambar Open Graph | Share link tiap halaman | 1200×630 | Gambar diam |

**1. Hero object loop.**

Gambar:

```
A single sculptural object floating in the center: a small stack of five thin rounded rectangular tiles, like interface cards, slightly fanned out and offset, one tile in cobalt blue, the rest matte off-white and frosted glass. Three-quarter view, object fills about 45% of the frame, centered with empty space around. [style block]
```

Video:

```
The stacked tiles slowly fan open and close again, rotating gently about 10 degrees on the vertical axis, smooth ease-in-out motion, seamless loop where the last frame matches the first, locked static camera, background stays perfectly plain and unchanged, no new objects appear, 5 seconds.
```

**2. Modul ERP tersinkron (Netiquette).**

Gambar:

```
Four small abstract blocks arranged in a loose square: a receipt-like strip, a small cash-drawer shape, a stack of boxes, and a simple ledger book shape, all abstract and without any writing. Thin glowing cobalt lines connect each block to a small frosted glass sphere in the center. Top-down three-quarter view, wide composition with space on the sides. [style block]
```

Video:

```
Small cobalt light pulses travel along the thin lines from each block to the central sphere and back, the sphere glows softly each time a pulse arrives, blocks stay still, calm steady rhythm, seamless loop, locked static camera, background unchanged, 6 seconds.
```

**3. Objek CTA kontak.**

Gambar:

```
A single rounded speech-bubble shape made of frosted glass with a small cobalt blue sphere resting inside it, floating slightly above a soft shadow, centered, object fills about 40% of the frame. [style block]
```

Video:

```
The glass bubble bobs up and down very gently while the cobalt sphere inside rolls slowly in a small circle, subtle and calm, seamless loop, locked static camera, background unchanged, 4 seconds.
```

**4. Gambar Open Graph.**

```
Wide banner composition 1200 by 630: the stacked interface tiles object from the hero placed on the right third, the left two thirds left completely empty for a title to be added later in code. [style block]
```

Judul dan nama ditambahkan lewat kode (Next.js `opengraph-image`), bukan lewat AI, agar teksnya rapi dan bisa dibuat per bahasa.

**Setelah generate.**

- Pilih hasil yang gerakannya pelan dan loop-nya tanpa sambungan terlihat.
- Kompres: MP4 (H.264) dan WebM (VP9), target di bawah 1 MB untuk desktop dan versi 540 px untuk HP.
- Cek bahwa warna latar video persis #F4F3EF; kalau bergeser, sesuaikan `--bg` atau koreksi warna videonya.
- Video dimuat setelah halaman selesai load, hanya diputar saat terlihat di layar.

## Tech stack & arsitektur

Stack mengikuti yang sudah Rizki kuasai (Next.js, TypeScript, Tailwind), ditambah GSAP dan Lenis untuk motion; semua tools inti gratis.

| Layer | Pilihan | Alasan |
| --- | --- | --- |
| Framework | Next.js 16 (App Router) + TypeScript | Sudah dipakai di Dikita dan PUFA; SSR/SSG untuk SEO |
| Styling | Tailwind CSS v4 + CSS variables | Token warna dan motion di satu tempat |
| Animasi | GSAP + ScrollTrigger + SplitText, `@gsap/react` (`useGSAP`) | Semua plugin gratis; cleanup otomatis di React |
| Smooth scroll | Lenis | Ringan, standar industri |
| Bahasa | next-intl, rute `/en` dan `/id` | Routing dan terjemahan per locale |
| Konten | MDX (case study) + JSON (teks UI) di repo | Tanpa biaya CMS, mudah diedit |
| Contact form | Server Action + validasi Zod + Resend | Email langsung ke riiizkiadiii@gmail.com |
| Gambar | `next/image` (AVIF/WebP), `priority` untuk gambar hero | Performa dan Priority Hints |
| Font | `next/font` (Geist, Instrument Serif) | Tanpa layout shift |
| Hosting | Vercel + domain rizkiadiprasetyo.site | Deploy otomatis dari GitHub |
| Analytics | Vercel Analytics + Speed Insights | Kunjungan dan Core Web Vitals |

**Struktur folder (usulan).**

```
app/[locale]/
  page.tsx            # Home
  work/page.tsx       # Work
  work/[slug]/page.tsx# Case study
  about/page.tsx
  contact/page.tsx
components/motion/    # RollText, Reveal, SplitHeading, Marquee, Odometer, WordRotator
components/ui/        # Button, Card, Header, Footer, LangSwitch
content/{en,id}/work/ # netiquette.mdx, dikita.mdx, pufa.mdx, finance.mdx
messages/{en,id}.json # teks UI
lib/motion.ts         # motion tokens + registrasi GSAP
lib/lenis.tsx         # provider Lenis + sinkron ScrollTrigger
```

## Kebutuhan non-fungsional

Situs harus cepat di HP kelas menengah, mudah ditemukan di Google dalam dua bahasa, dan bisa dipakai tanpa mouse maupun animasi.

**Performa.**

- LCP ≤ 2,5 s, INP ≤ 200 ms, CLS ≤ 0,1 di mobile.
- Gambar hero dimuat dengan prioritas tinggi; gambar lain lazy load.
- GSAP dan Lenis tidak boleh menunda render konten pertama.
- Tidak ada task JavaScript di atas 50 ms saat scroll.

**SEO.**

- Title dan meta description unik per halaman dan per bahasa.
- `hreflang` EN/ID dan canonical di setiap halaman.
- `sitemap.xml`, `robots.txt`, dan gambar Open Graph per case study.
- Structured data `Person` (nama, jabatan, LinkedIn, GitHub).
- Redirect 301 dari web lama ke domain baru jika web lama tidak dipertahankan.

**Aksesibilitas (WCAG 2.2 AA).**

- Kontras teks minimal 4,5:1.
- Semua fungsi bisa dipakai dengan keyboard, fokus terlihat jelas.
- `prefers-reduced-motion` dihormati di semua komponen.
- Marquee dan word rotator punya cara berhenti.
- Gambar punya alt text di kedua bahasa.

**Bilingual.**

- Bahasa Inggris sebagai default di `/en`, Indonesia di `/id`.
- Toggle bahasa tetap di halaman yang sama (misal `/en/work/dikita` ↔ `/id/work/dikita`).
- Bahasa browser boleh dipakai sebagai saran pertama, tapi pilihan pengguna diingat.

**Kompatibilitas.** Chrome, Safari (termasuk iOS), Firefox, dan Edge dua versi terakhir; lebar layar mulai 360 px.

## Timeline & milestone

Target launch 21 Oktober 2026, dibagi menjadi tiga minggu dengan satu gate di akhir minggu 1 dan 2.

&#91;embedded content: timeline · 3 minggu, 2 gate, launch\]

Jika gate "Konten EN siap" terlewat, transisi halaman dan preloader dipindah ke v1.1 agar tanggal launch tetap.

## Risiko, asumsi & pertanyaan terbuka

Risiko terbesar adalah menulis konten 4 case study dalam dua bahasa dalam 3 minggu; kode dan motion bisa dikerjakan paralel, konten tidak bisa ditunda.

| Risiko | Dampak | Mitigasi |
| --- | --- | --- |
| Penulisan konten bilingual molor | Launch mundur | Tulis EN minggu 1, terjemahkan ID minggu 2; arsip cukup satu kalimat |
| Motion menurunkan performa | Skor CWV gagal, terasa lambat di HP | Aturan motion system, tes di HP menengah tiap milestone |
| Detail Netiquette terlalu sensitif | Masalah dengan perusahaan | Tanpa screenshot asli, tanpa nama klien, minta persetujuan teks |
| Scope creep (blog, dark mode, 3D) | Deadline terlewat | Semua fitur "Won't (v1)" masuk backlog v2 |

**Asumsi.**

- Email publik: riiizkiadiii@gmail.com (menggantikan email di web lama dan PDF).
- Domain rizkiadiprasetyo.site masih dimiliki dan bisa diarahkan ke Vercel.
- Angka hasil proyek diambil dari CV dan PDF portfolio apa adanya.

**Pertanyaan terbuka.**

- [ ] Status kerja saat launch: tetap di Netiquette, atau "open to opportunities"?
- [ ] Nomor WhatsApp +62 896-7046-8240 boleh ditampilkan publik?
- [ ] Perlu persetujuan Netiquette untuk teks case study?
- [ ] Link live dan repo GitHub mana saja yang boleh ditampilkan per proyek?
- [ ] Foto profil baru dengan gaya editorial, atau pakai foto yang ada?
- [ ] Web lama di-redirect ke domain baru atau dihapus?
