# Hero redesign (gaya upsunday.co)

Rizki minta hero Home diganti: copy lama terlalu panjang dan kurang menarik,
style diminta ngikutin hero upsunday.co (kartu gradient besar, judul 2 baris
raksasa di kiri, teks pendek + 2 tombol pill di kanan).

> PRD awalnya bilang upsunday cuma acuan teknik, desainnya tidak ditiru.
> Ini diubah atas permintaan eksplisit Rizki (2026-10-01). Yang ditiru cuma
> layout & gaya visual; teks dan aset 3D tetap milik sendiri.

## Yang diubah
- `app/[locale]/page.tsx` → komponen `Hero`: section jadi kartu
  `rounded-[32px]` dengan `bg-linear-to-b from-hero-from to-hero-to`.
  Grid 12 kolom di `lg`: judul 7 kolom, teks + tombol 5 kolom.
- `globals.css`: token baru `--hero-from` / `--hero-to`, didaftarkan di
  `@theme inline` supaya jadi kelas Tailwind (`from-hero-from`).
- `messages/*.json`: `headline`, `subhead`, `seeWork` diganti,
  `startProject` baru. Tombol kedua tidak lagi pakai `header.letsTalk`.

## Copy (versi "Safe", yang dipasang)
| | EN | ID |
| --- | --- | --- |
| Headline | Websites & / Systems | Website & / Sistem |
| Subhead | I design and build websites and business software, from ERP to POS. Built around how your business actually runs. | Saya merancang dan membangun website serta software bisnis, dari ERP sampai POS. Dibuat sesuai cara bisnis Anda berjalan. |
| Tombol | See my work · Start a project | Lihat karya · Mulai proyek |

Versi "Bolder" (cadangan, belum dipasang):
- EN: "Less Spreadsheets. / More Systems." + "I turn the manual work your
  team does every day into software they'll actually use. ERP, accounting,
  POS, and the website in front of it."
- ID: "Kurangi Excel. / Pakai Sistem." + "Pekerjaan manual tim Anda saya ubah
  jadi software yang benar-benar dipakai. ERP, akuntansi, POS, sampai
  website-nya."

## Keputusan teknis & gotcha
- **Pindah baris di judul pakai `\n` di JSON + `whitespace-pre-line`.**
  Lebih simpel daripada `t.rich` atau dua key terpisah, dan tiap bahasa bisa
  mutusin sendiri di mana barisnya patah.
- **H1 tetap tanpa animasi**, karena H1 ini elemen LCP (aturan PRD). Yang
  di-`Reveal` cuma badge, subhead, dan tombol.
- **Warna gradient pakai warna sendiri, bukan warna upsunday.** Awalnya
  gradient lavender→oranye mirip referensi. Rizki minta warnanya jangan
  disamain, jadi diganti ke cobalt brand (`--accent` #2F45FF) yang memudar ke
  periwinkle #6B7BFF. Bonusnya, kontras teks putih jadi sekitar 6.4:1 di
  atas dan 4.2:1 di bawah, jauh lebih aman dibanding gradient referensi
  (sekitar 2:1). `--hero-from` langsung merujuk `var(--accent)`, jadi kalau
  warna brand diganti, hero ikut berubah.
- Panah di tombol cuma karakter `→` dengan `aria-hidden`, nggak perlu
  komponen ikon baru.

## Belum ada: objek 3D
Di referensi ada objek 3D (matahari) di bawah tengah kartu. **Matahari itu
punya upsunday, jadi tidak dipakai.** Prompt-nya sengaja melarang matahari,
sinar, dan bentuk bulat bercahaya. Konsepnya diganti jadi tiga kartu UI
(website, grafik, struk) di atas alas kaca, sesuai headline "Websites &
Systems". Asetnya di-generate sendiri oleh Rizki.

Background dibuat polos #6B7BFF (= `--hero-to`, warna bawah kartu), supaya
nanti tepinya bisa dipudarkan pakai `mask-image` dan nyatu sama gradient.
Taruh hasilnya di `public/images/hero/` (poster WebP + MP4 + WebM).

Gambar (16:9):
```
Three floating rounded rectangular interface cards hovering in a gentle arc above a long, low frosted-glass platform. Left card: a simple website window with an empty header bar and soft blank content blocks. Center card, slightly larger and closer: a clean bar chart made of short rounded bars. Right card: a narrow receipt-like strip with blank horizontal lines. Cards are made of frosted glass and matte warm off-white (#F4F3EF), each with tiny soft cobalt blue (#2F45FF) details. Thin glowing white lines softly connect the three cards to each other. Front view, slightly from above, the whole group sits in the lower center of the frame with wide empty space above and on both sides. Solid plain background color #6B7BFF edge to edge, no gradient, no horizon. Minimal editorial 3D render, soft matte and glossy materials, soft diffused studio light from top left, gentle soft shadows on the platform, calm and premium, high detail. No sun, no sunrise, no rays, no glowing sphere, no circular burst shapes, no text, no letters, no numbers, no logos, no watermark, no people.
```

Video (5 detik, dari gambar di atas):
```
The three cards float gently up and down out of sync, each rising a few centimeters and settling back, the center chart bars slowly grow and shrink a little, small light pulses travel along the thin lines between the cards, smooth ease-in-out motion, seamless loop where the last frame matches the first, locked static camera, background stays perfectly plain #6B7BFF and unchanged, no new objects appear, no sun, no rays, 5 seconds.
```

Gotcha: model video sering bikin warna background bergeser sedikit. Kalau
kelihatan "kotak" di kartu, cek warna di frame pertama & terakhir, lalu
samakan `--hero-to` ke warna itu (atau perlebar fade di `mask-image`).

## Objek 3D terpasang (`public/images/hero-brand.webp`)
- File dari Rizki ternyata **animated WebP**, bukan video: 480 frame,
  24 fps (loop 20 detik), 1280×720, **5,3 MB**.
- Background asli asetnya **#7084E8**, bukan #6B7BFF seperti di prompt.
  Model AI-nya menggeser warna. Jadi `--hero-to` diganti ke #7084E8, dan
  gradient pakai `to-70%` supaya bagian bawah kartu sudah full warna itu
  sebelum gambarnya mulai.
- Tepi gambar dipudarkan pakai `mask-image: radial-gradient(...)`, jadi
  nggak kelihatan kotak.
- Dipasang pakai `<picture>` + `<img>` biasa, bukan `next/image`, karena:
  (1) Next memang nggak meng-optimize gambar animasi, dan (2) `<picture>`
  bisa kasih `<source media="(prefers-reduced-motion: reduce)">` yang
  menampilkan **frame pertama statis** (`hero-brand-poster.webp`, 12 KB)
  buat user yang matiin animasi. Ini aturan PRD: semua motion harus punya
  versi reduced motion.
- `alt=""` karena gambarnya dekoratif. Isinya sudah diwakili headline.
- Layout desktop: gambar `max-w-5xl` (awalnya 3xl, kata Rizki kekecilan), `lg:-mt-44` menarik gambar ke atas, ke area kosong di
  bawah tombol, supaya objeknya kelihatan tanpa scroll. Teks dikasih
  `relative z-10`, gambar `pointer-events-none`, supaya pinggir gambar
  yang transparan nggak nutupin atau nge-block klik tombol.
- Ukuran headline turun ke `clamp(3.5rem,8.5vw,8rem)`. Di 10rem,
  "Websites &" kepecah jadi 3 baris di kolom 7/12.

### TODO performa
5,3 MB terlalu berat buat area di atas lipatan (fold). PRD minta format
akhir video **MP4 + WebM + poster**. Kalau dikonversi ke MP4 (H.264),
ukurannya biasanya jauh di bawah 1 MB. Butuh `ffmpeg`
(`brew install ffmpeg`), dan sekarang belum terinstall. Sudah dicoba
kompres ulang WebP ke 12 fps q60: hasilnya 2,1 MB dan gerakannya jadi
patah-patah, jadi nggak dipakai.
