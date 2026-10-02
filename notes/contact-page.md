# Contact page: layout ala upsunday (dirapikan)

Urutan dari atas: judul → **kartu Book a call** (fokus utama) → 3 kartu
kontak alternatif → form "Or send a message" → FAQ.

## Keputusan
- **Book a call jadi aksi utama.** Kartu putih besar `rounded-[32px]`, 2
  kolom di desktop (info 2/5, Calendly 3/5), 1 kolom di HP. Badge
  "Recommended" pakai **warna aksen cobalt, bukan oranye** seperti di
  referensi, supaya konsisten dengan brand sendiri.
- **Chip "30 min" + "Google Meet" bukan karangan.** Datanya diambil dari
  API publik Calendly untuk event `discovery-call`: `duration: 30`,
  lokasi `google_conference`. Kalau setting di Calendly diubah, chip
  ini juga harus diubah (`contact.call.duration`).
- **Form kontak tetap dipertahankan** (di referensi nggak ada). Form ini
  sudah tersambung ke Server Action + Resend, dan berguna buat orang yang
  lebih suka nulis. Posisinya di bawah, jadi nggak ngalahin Book a call.
- **Kartu Follow cuma LinkedIn + GitHub** (ikonnya sudah ada di
  `icons.tsx`). Instagram/X dari referensi nggak dipakai karena nggak ada
  datanya. **URL-nya masih `#`**, sama seperti di Footer dan MenuOverlay.
  Ditandai dengan komentar `ponytail:`.
- **FAQ pakai `<details>/<summary>` bawaan browser**, bukan komponen
  accordion JS. Keyboard & screen reader langsung jalan, tetap bisa dibuka
  walau JS gagal, dan nggak butuh state.
  - Ikon `+` diputar 45° (`group-open:rotate-45`), jadi kelihatan `×`.
  - Animasi tinggi: `::details-content` + `interpolate-size:
    allow-keywords` (CSS di `globals.css`, class `.faq`). Cuma jalan di
    Chromium 131+. Browser lain langsung kebuka tanpa animasi, tapi tetap
    berfungsi. Reduced motion: transisi dimatikan.
  - Kata "reach"/"menghubungi" di judul pakai `t.rich` + `<em>` →
    Instrument Serif italic warna muted. Ini font aksen dari PRD ("satu-dua
    kata penekanan di judul").

## Copy
Ditulis pakai aturan copywriting Rizki: "I", bukan "we"; tanpa em dash;
tanpa kata-kata AI. Bahasa Indonesianya pakai "kamu", sama seperti intro
contact yang sudah ada.

**Perlu dicek Rizki** (isinya klaim soal proses kerja, bukan fakta yang
sudah ada di repo):
- FAQ biaya: "setelah call pertama saya kirim estimasi tertulis (cakupan,
  timeline, harga)".
- FAQ call pertama: "30 menit bahas bisnis kamu, saya banyak bertanya".
- FAQ klien luar negeri: "sudah biasa kerja lintas zona waktu". Ini sesuai
  bio di About.

## Revisi: FAQ cuma satu yang kebuka
Semua `<details>` dikasih `name="faq"` yang sama. Itu fitur "exclusive
accordion" bawaan HTML: kalau satu dibuka, browser otomatis nutup yang
lain. Nggak perlu state React atau JS sama sekali. Sudah didukung Chrome
120+, Safari 17.2+, Firefox 130+. Di browser yang lebih lama, semua item
tetap bisa dibuka bebas, jadi nggak ada yang rusak.

## Revisi: tombol WhatsApp hijau
Tombol "Chat on WhatsApp" diganti dari hitam ke hijau resmi WhatsApp
`#25D366`. **Teksnya hitam (`text-ink`), bukan putih.** Putih di atas
#25D366 kontrasnya cuma sekitar 2:1, gagal WCAG. Hitam di atasnya sekitar
10:1. Warnanya ditulis langsung (`bg-[#25D366]`), bukan dijadiin token,
karena ini warna brand WhatsApp, bukan warna situs, dan cuma dipakai di
satu tempat.

## Revisi: pilihan "Type" jadi pill, bukan dropdown
`<select>` diganti jadi `<fieldset>` berisi 3 pill (Job opportunity /
Freelance project / Other).
- Tiap pill adalah `<label>` yang membungkus `<input type="radio">` asli
  dengan class `sr-only` (tersembunyi secara visual). Jadi tetap bisa
  dipilih pakai keyboard (Tab, lalu panah kiri/kanan) dan dibaca screen
  reader. Form juga tetap ngirim field `type` yang sama, jadi Server
  Action + Zod nggak perlu diubah.
- Styling pill terpilih pakai `has-[:checked]:` di label (CSS `:has()`),
  tanpa state React. Fokus keyboard pakai `has-[:focus-visible]:outline-…`.
- `required` di radio: kalau belum milih, browser nolak submit, sama
  seperti `<select required>` dulu.
- Key `contact.form.typePlaceholder` ("Select one") dihapus karena sudah
  nggak dipakai.

## Revisi: form dirapikan + pilihan ditambah
- **Pilihan "What do you need?"** (dulu "Type", cuma 3 opsi: Job /
  Freelance / Other) sekarang 6, disesuaikan dengan jenis pekerjaan di
  situs: Website · Dashboard or admin panel · ERP or business system ·
  Process automation · Job opportunity · Something else.
  - Sumber tunggal: `CONTACT_TYPES` di `lib/contact-schema.ts`. Dipakai
    Zod (`z.enum(CONTACT_TYPES)`) **dan** form, jadi pill yang tampil
    selalu sama dengan nilai yang diterima server. Label ada di
    `contact.form.types.<value>`.
  - "freelance" dihapus. Klien sekarang milih jenis pekerjaannya langsung,
    dan nilai itu ikut masuk ke subjek email Resend
    (`New contact (dashboard) — …`). Jadi dari inbox langsung kelihatan
    orangnya butuh apa.
- **Tampilan:** form di kartu putih `rounded-[24px]`. Nama + email sejajar
  2 kolom. Field-nya isian abu (`bg-bg`) tanpa garis, dan waktu fokus jadi
  putih + border & ring aksen. Ada placeholder contoh. Tombol kirim pill
  hitam + lingkaran panah, sama dengan tombol hero. Pesan sukses ada ikon ✓.
- **Hint "At least 20 characters"** di bawah pesan: server (Zod) nolak
  pesan < 20 karakter. Dulu user nggak dikasih tahu dan cuma dapat error
  umum.
- Error sekarang tampil di kotak abu yang netral, dengan email yang
  bisa diklik.

## Revisi: field Subject
- Field baru **Subject** (ID: Subjek), wajib diisi, maks 120 karakter,
  posisinya di bawah Nama/Email. Placeholder: "e.g. New website for my
  café".
- Divalidasi di 3 lapis yang sama dengan field lain: atribut HTML
  (`required`, `maxLength`) → Zod (`trim().min(1).max(120)`) → baru
  dipakai di email.
- Subjek email Resend sekarang `<subject> · <nama> (<type>)`, contoh
  `Website baru untuk kafe · Budi (website)`. Isi email juga ada baris
  `Subject:`.
- `trim()` di Zod: subjek yang isinya cuma spasi dianggap kosong dan
  ditolak, nggak lolos jadi email tanpa judul.
