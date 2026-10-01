# Global layout: Header, Footer, Mobile Menu (versi statis)

Fase 1 roadmap poin 2 & 3 (design tokens + layout statis) digabung jadi satu
sesi karena saling berkaitan langsung.

## Apa yang dibangun

- `app/globals.css` — token warna (`--bg`, `--surface`, `--ink`, `--muted`,
  `--line`, `--accent`), radius (`--radius-ui`, `--radius-card`), dan font
  token (`--font-sans`, `--font-serif`) didaftarkan ke Tailwind lewat
  `@theme inline`.
- `app/[locale]/layout.tsx` — load font `Geist` (sans, body+display) dan
  `Instrument Serif` (serif, aksen italic) lewat `next/font/google`, lalu
  bungkus `<Header />` + `{children}` + `<Footer />` di dalam
  `NextIntlClientProvider`.
- `components/ui/Header.tsx` — logo/nama, nav (Work/About/Contact), language
  switch, tombol "Let's talk", tombol menu mobile.
- `components/ui/MobileMenu.tsx` — overlay fullscreen (toggle via `useState`
  di Header), berisi link besar + email/WhatsApp/LinkedIn.
- `components/ui/Footer.tsx` — ajakan kontak, kanal kontak, lokasi
  "Cikarang, Indonesia · GMT+7", copyright dinamis (`{year}`).
- `components/ui/LangSwitch.tsx` — ganti locale sambil tetap di halaman yang
  sama (`/id/work/dikita` ↔ `/en/work/dikita`), caranya: ambil `pathname`
  saat ini, buang prefix locale lama, pasang prefix locale baru.

## Kenapa BELUM ada animasi sama sekali

Ini sengaja. Urutan di `roadmap.md` naruh "layout statis" sebelum "motion
foundation" — alasannya: motion itu lapisan tambahan di atas struktur yang
sudah benar, bukan pengganti struktur. Kalau animasi dibangun duluan sebelum
elemen aslinya jelas, nanti pas komponen di-refactor, animasinya ikut rusak
dan harus diulang. `MobileMenu` sekarang buka/tutup pakai kondisi biasa
(`if (!open) return null`) — nanti di Fase 2 ini diganti animasi GSAP
timeline sesuai PRD (clipPath inset + stagger link), TANPA ubah struktur
HTML-nya.

## Keputusan teknis & alasan

- **`LangSwitch` pakai string replace pada pathname**, bukan routing
  terpisah per-locale-slug. Ini valid karena PRD contoh URL-nya konsisten:
  slug sama persis di kedua bahasa (`/en/work/dikita-laundry` vs
  `/id/work/dikita-laundry`), bukan slug diterjemahkan.
- **`Footer` sengaja Server Component** (tanpa `"use client"`) karena isinya
  statis, nggak ada interaktivitas. `Header` harus Client Component karena
  butuh `useState` buat toggle menu mobile.
- **`useTranslations` dipakai langsung dari `'next-intl'`** di Server
  Component (`Footer`) — next-intl mendukung ini tanpa perlu `'next-intl/
  server'` versi async (`getTranslations`), karena next-intl pakai
  `AsyncLocalStorage` di server untuk nyimpen context locale per-request.

## Yang masih placeholder / perlu dikonfirmasi sebelum launch

- Link LinkedIn & GitHub di Header/Footer masih `href="#"` — belum ada URL
  aslinya.
- Nomor WhatsApp yang dipakai (`+62 896-7046-8240`) — ini salah satu
  **pertanyaan terbuka di PRD** ("boleh ditampilkan publik?"), belum
  dikonfirmasi. Sementara dipasang karena itu satu-satunya nomor yang ada di
  PRD, tapi WAJIB dicek ulang sebelum launch.
- Copy nav "Work" diterjemahkan jadi "Karya" di `messages/id.json` — cek
  lagi apa istilah ini yang Rizki mau pakai atau tetap "Work".

## Next
- Lanjut ke Fase 2: `lib/motion.ts` (motion tokens) + `lib/lenis.tsx`
  (Lenis provider), fondasi sebelum bikin komponen motion satu-satu.
