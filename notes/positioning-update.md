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
