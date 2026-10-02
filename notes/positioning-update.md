# Perubahan positioning: Frontend Engineer → Software Developer

PRD awal nentuin positioning hybrid "Frontend engineer who understands how
businesses run" (EN) / "Frontend engineer yang paham cara bisnis berjalan"
(ID). Rizki minta ini digeneralisir jadi "Software Developer" — nggak mau
dibatasin ke FE doang, karena pengalamannya emang lintas stack (backend Go/
Laravel, database, leadership), bukan cuma frontend.

**Dikonfirmasi eksplisit dulu via pertanyaan** (bukan asumsi sepihak) —
Rizki pilih tetap pertahanin sudut pandang "paham cara bisnis berjalan"
(itu yang bedain dari developer lain), cuma titelnya yang digeser.

## Yang diubah (scope dikonfirmasi: Hero + About bio doang)

- `messages/en.json` & `id.json`:
  - `home.headline`: "Frontend engineer..." → "Software developer..."
  - `about.bio`: ditulis ulang, "I'm a frontend engineer" → "I'm a software
    developer", sekalian ditambah satu kalimat pembeda ("yang bikin beda
    adalah kebiasaan memahami masalah bisnis dulu sebelum nulis kode") biar
    nggak jadi generic "software developer" doang tanpa sudut pandang.

## Yang SENGAJA BELUM diubah (di luar scope yang dikonfirmasi)

- `home.subhead` — "ERP, accounting and business systems, built with
  craft." tetep akurat, nggak nyebut kata "frontend" jadi nggak perlu
  diubah.
- `home.whatIDo.items[0]` — masih "Frontend engineering" sebagai salah
  satu dari 4 kartu skill (bukan headline utama, representasinya masih
  valid karena itu emang salah satu kemampuannya, bukan klaim tunggal).
- `footer.tagline`, meta/SEO description per halaman — belum disentuh,
  nunggu konfirmasi lanjut kalau Rizki mau ini juga diupdate.
- Narasi 6 section case study (`content/*/work/*.mdx`) — masih TODO,
  nunggu Rizki cerita pengalaman asli per project (bukan dikarang).

## Catatan buat sesi berikutnya

Kalau mau lanjut update bagian lain (footer tagline, meta description,
atau isi "What I do"), tanya dulu scope-nya spesifik — jangan asumsi
"positioning berubah" otomatis nyebar ke semua tempat yang nyebut kata
"frontend".

## Update 2026-10-02: riwayat kerja & pendidikan dihapus dari situs
Keputusan Rizki: situs ini buat **nunjukin diri dan kemampuan**, bukan CV.
Jadi semua yang sifatnya riwayat dihapus:
- About: section Journey (2020–2026), Education (program, IPK,
  beasiswa), Organizations, Certifications. Key-nya juga dihapus dari
  `messages/*.json`.
- About bio: kalimat soal jabatan di Netiquette Asia dan sekolah/kampus
  (Darussalam Sengkubang, President University, PUFA) dihapus. Bio sekarang
  cuma soal cara kerja. Em dash juga dibuang, sesuai aturan copywriting.
- Home: section Experience (jabatan Netiquette + link "More about me")
  dihapus.
- Yang **tetap ada**: Skills, Languages (sekarang tampil sebagai pill), dan
  case study Netiquette Cloud ERP, karena itu contoh karya, bukan riwayat
  kerja.
- PRD baris "Perjalanan" ditandai sudah dihapus dari situs.

## Update: nggak ada lagi kesan "cari kerja"
- Badge hero "Open to opportunities" / "Terbuka untuk peluang baru" diganti
  jadi **"Available for new projects"** / **"Menerima project baru"**.
  Situs ngomong ke klien, bukan ke perekrut.
- Opsi "Job opportunity" / "Peluang kerja" dihapus dari form kontak
  (`CONTACT_TYPES`). Sisa 5 opsi: Website, Dashboard, ERP, Process
  automation, Something else. Zod ikut menolak `type=job`, karena memakai
  daftar yang sama.

## Update: About diisi lebih lengkap (biar klien tertarik)
Sumber: PDF portfolio + data project yang sudah ada. Tetap nggak ada
riwayat kerja atau sekolah.
- **Bio 3 paragraf** (`about.bio` sekarang array). Paragraf pertama lebih
  besar: posisi "paham cara bisnis berjalan", dengan contoh konkret (order
  dari kasir ke pembukuan, stok, laporan). Paragraf 2: cara kerjanya
  (petakan → sederhanakan → bangun) + area terkuat dari PDF (produksi,
  penjualan, pengadaan, keuangan). Paragraf 3: lintas stack + memimpin tim
  kecil.
- **How I work**: 4 langkah (Understand → Map → Build & connect → Launch &
  improve), kartu bernomor gaya What I do. Ini menjawab pertanyaan
  pertama klien: "kerjanya gimana?".
- **Industries I've worked with**: Manufacturing, Laundry & services,
  Food & beverage, Education, Cloud ERP & accounting. Semua dipetakan dari
  project nyata (Finance, Dikita, Kopi Tarik/Hazel, PUFA, Netiquette).
- **Tools dari PDF** dimasukkan ke grup skill yang ada (bukan grup ke-7,
  supaya grid 3 kolom tetap rapi): Git & GitHub + Docker → Backend, Odoo →
  ERP, Trello + Notion + Miro → Leadership.
- **Perlu dicek Rizki:** langkah 4 menjanjikan "documentation and a
  walkthrough". PDF menyebut dokumentasi di project Epicor, tapi pastikan
  memang selalu dikasih ke klien.

## Update: About diringkas, ikut struktur upsunday.co/about
Rizki: tulisannya kepanjangan. Referensi upsunday.co/about dibuka & dibedah:
tiap section = label kecil (eyebrow) + headline besar dengan 1 kata
ditekankan + maksimal 2 kalimat + elemen visual. Strukturnya ditiru, isinya
punya Rizki sendiri.
- Hero: "About" + **tagline 1 kalimat** (bio 3 paragraf dihapus).
- "In short": headline "Software that fits how your business *runs*" +
  2 kalimat + tombol See my work / Start a project.
- "Track record": baris angka besar, ambil dari `home.numbers`, jadi
  angkanya satu sumber dengan Home.
- "How I work": deskripsi tiap langkah dipendekkan jadi 1 kalimat.
- Industries / Skills / Languages tetap, judulnya jadi eyebrow kecil.
- Kata yang ditekankan pakai `<em>` di pesan → `t.rich` → Instrument
  Serif italic aksen (sama seperti judul FAQ Contact).
- Bug ikut ketemu & diperbaiki di `Odometer`: "+", "%", "," posisinya
  lebih rendah dari angka (inline-block overflow-hidden disejajarkan dari
  tepi bawah). Sekarang semua karakter kotak 1em, rata atas.

## Update: foto + profil singkat ("Behind the work")
- Mengikuti section "Leadership" upsunday: foto kiri (5/12, rasio 4:5,
  rounded), kanan eyebrow + nama besar + peran (warna aksen) + 2 paragraf.
  Posisinya setelah "How I work", sebelum Industries.
- Foto: `public/images/rizki-portrait.jpg`, 896×1195 (ukuran dari chat),
  dikompres jadi 78 KB. Pakai `next/image` static import + `placeholder="blur"`
  dan `sizes`. Alt text deskriptif per bahasa.
- Profil sengaja **pengalaman kerja yang relevan buat klien**, bukan CV:
  peran sekarang di Netiquette Asia + apa yang dikerjakan, lalu project
  yang pernah dipimpin/dibangun. Sekolah/kampus tetap nggak disebut. Tanpa
  angka "x tahun pengalaman" karena nggak ada datanya.
