# What I do — 4 kartu mendatar + aset 3D per kartu

## Layout & motion (sudah jadi)
- Grid `sm:grid-cols-2 lg:grid-cols-4`, kartu `bg-surface rounded-card
  min-h-64`, nomor 01–04 di atas, judul + deskripsi nempel bawah
  (`mt-auto`).
- Muncul satu per satu: `Reveal stagger="slow"` → token baru
  `motionTokens.staggerSlow` (0,15 s). Stagger default 0,06 s terlalu
  cepat buat 4 kartu besar, kelihatan muncul barengan.

## Aset 3D per kartu (di-generate Rizki, satu per satu)
Ukuran: **1:1, 1024×1024**. Kartu di desktop lebarnya cuma sekitar 200–270 px,
jadi 1024 sudah cukup tajam untuk layar retina dan masih ringan.
Background **#FFFFFF polos**, sama dengan `--surface` (warna kartu), supaya
gambarnya nyatu tanpa kotak.
Nama file: `public/images/what-i-do/<slug>.webp`.

Style block (sama untuk keempat kartu):
```
Minimal editorial 3D render, soft matte materials with subtle frosted glass, warm off-white (#F4F3EF) forms with one cobalt blue (#2F45FF) accent, solid plain pure white background (#FFFFFF) edge to edge, soft diffused studio light from top left, gentle soft shadow under the object, object centered and filling about 55% of the frame, generous empty space, calm and premium, high detail. No text, no letters, no numbers, no logos, no watermark, no people, no sun, no rays. Square 1:1, 1024x1024.
```

### 01 Frontend engineering → `frontend.webp`
Gambar:
```
A small floating browser window card with rounded corners, made of frosted glass, with three tiny dots in its top bar. Inside it, three stacked UI pieces float slightly forward in layers: a cobalt blue pill-shaped button, a small toggle switch, and a soft blank content block. A smooth rounded mouse cursor arrow hovers next to the button. Three-quarter view. [style block]
```
Video (loop, 4 detik):
```
The cursor glides to the cobalt button and gently presses it, the button sinks slightly and springs back, the toggle switch slides on, the layered UI pieces drift forward and back very softly, smooth ease-in-out motion, seamless loop where the last frame matches the first, locked static camera, background stays pure white and unchanged, no new objects appear, 4 seconds.
```

#### Hasil 01 (`public/images/motion-frontend.webp`)
- Yang datang **16:9 (1280×720)**, bukan 1:1, dan background-nya abu
  terang #E8E8E4, bukan putih. 240 frame, sekitar 1,3 MB.
- **Nggak di-crop atau di-encode ulang.** Gambarnya ditaruh sebagai
  "tile" di atas kartu: `aspect-square object-cover rounded-[8px]`. Browser
  yang motong ke persegi di sekitar objek yang sudah di tengah. Karena
  tile-nya punya background sendiri (abu), bedanya sama kartu putih justru
  kelihatan disengaja, jadi nggak perlu nyamain warna.
- Mapping per kartu ada di array `whatIDoMotion` di `page.tsx`, urutannya
  sama dengan `home.whatIDo.items`. Kartu yang belum punya aset nggak
  nampilin gambar.
- Reduced motion: `motion-frontend-poster.webp` (frame pertama, 6 KB).
- `loading="lazy"` karena section ini di bawah lipatan.
- Kartu berikutnya: kalau hasilnya tetap 16:9, nggak apa-apa, asal objeknya
  di tengah. Background abu-abu yang sama malah bagus, biar 4 tile seragam.

### 02 ERP & integrasi sistem → `motion-erp.webp`
Style block untuk kartu 02–04 diubah: background **#E8E8E4** (bukan putih),
16:9, supaya seragam dengan hasil 01.

Prompt versi pertama (kubus, cakram, bola) kata Rizki **kurang related**:
terlalu abstrak, orang nggak langsung nangkep "ERP". Versi baru pakai
benda bisnis yang langsung dikenali: mesin kasir (penjualan), tumpukan
kardus (gudang/stok), lembar invoice (keuangan). Ketiganya disambung ke
satu layar dashboard di tengah. Itu inti ERP: semua bagian bisnis masuk ke
satu sistem.

Gambar:
```
A small central dashboard monitor made of frosted glass showing a simple cobalt blue (#2F45FF) bar chart and a donut chart, no text. Around it, three small recognizable business objects float at the same height: on the left a compact point-of-sale cash register, on the right a neat stack of three cardboard shipping boxes, in front a paper invoice sheet with blank lines and a small cobalt stamp mark. Thin smooth glowing lines connect each object to the monitor. Three-quarter view, slightly from above. Minimal editorial 3D render, soft matte materials with subtle frosted glass, warm off-white (#F4F3EF) and soft kraft-brown forms with cobalt blue accents, solid plain light grey background (#E8E8E4) edge to edge, soft diffused studio light from top left, gentle soft shadows, the whole group centered and filling about 50% of the frame, generous empty space on all sides, calm and premium, high detail. No text, no letters, no numbers, no logos, no watermark, no people, no sun, no rays. Wide 16:9, 1280x720.
```
Video (loop, 4 detik):
```
The cash register drawer slides open and closes, a box on the stack lifts slightly and settles, the invoice sheet flutters gently, and after each action a small cobalt light pulse travels along its line into the central monitor, where one bar in the chart grows a little and the donut chart shifts slightly, smooth ease-in-out motion, seamless loop where the last frame matches the first, locked static camera, background stays plain light grey and unchanged, no new objects appear, 4 seconds.
```

#### Hasil 02 (`public/images/motion-erp.webp`)
- File awalnya ada di `~/Downloads`, lalu di-copy ke `public/images/`.
  16:9, 240 frame, 2,9 MB. Background sekitar #D4D4D0.
- Objeknya melebar (dari kasir sampai kardus, x ≈ 250–1020 dari 1280).
  Crop persegi (lebar 720 px di tengah) bakal motong kasir dan kardus.
  **Tile semua kartu diganti dari `aspect-square` ke `aspect-[4/3]`**:
  crop-nya jadi selebar 960 px, cukup buat semua objek. Kartu 01 tetap aman
  karena objeknya di tengah.
- Gotcha buat kartu 03–04: objek harus muat di 75% lebar tengah frame.

### 03 Sistem bisnis untuk UMKM → `motion-umkm.webp`
Konsep: toko kecil (kios beratap kanopi) yang kasirnya sudah pakai tablet,
ditambah HP untuk order online dan printer struk mini. Ini gambaran UMKM yang
sudah pakai sistem, bukan sistem korporat yang besar.
Gambar:
```
A small cute shop kiosk with a striped cobalt blue (#2F45FF) and off-white awning, a wooden counter in front. On the counter: a tablet on a stand showing a simple blank POS grid with one cobalt button, a small mini receipt printer, and a smartphone standing upright beside it showing a blank order card. A few small cardboard product boxes sit on a shelf behind. Three-quarter view, slightly from above. All objects placed close together within the center of the frame, nothing near the left or right edges. Minimal editorial 3D render, soft matte materials with subtle frosted glass, warm off-white (#F4F3EF) and soft kraft-brown forms with cobalt blue accents, solid plain light grey background (#E8E8E4) edge to edge, soft diffused studio light from top left, gentle soft shadows, the whole group filling about 45% of the frame, generous empty space, calm and premium, high detail. No text, no letters, no numbers, no logos, no watermark, no people, no sun, no rays. Wide 16:9, 1280x720.
```
Video (image-to-video, upload gambar di atas, loop 4 detik):
```
A small cobalt notification bubble pops up from the smartphone, the tablet's cobalt button pulses once as if tapped, then the mini printer prints a short paper receipt that curls out gently and slides back in, the awning sways very slightly, smooth ease-in-out motion, seamless loop where the last frame matches the first, locked static camera, background stays plain light grey and unchanged, no new objects appear, 4 seconds.
```

#### Hasil 03 (`public/images/business-motion.webp`)
- Nama file dari Rizki `business-motion.webp` (bukan `motion-umkm`), jadi
  namanya dipakai apa adanya di array `whatIDoMotion`. Rizki sendiri yang
  naruh file-nya di `public/images/`. 16:9, 240 frame, 3,3 MB.
- Objek kios di tengah (x ≈ 415–875), aman di crop 4:3.

### 04 Kepemimpinan tim & proyek → nama file bebas, kabari
Konsep: papan kanban (alur kerja tim) + globe kecil dengan titik-titik
yang tersambung (tim lintas negara). Satu kartu tugas pindah kolom sampai
"selesai". Itu inti delivery.
Gambar:
```
A frosted glass kanban board standing upright with three columns, each holding a few small rounded off-white task cards with blank lines; the rightmost column has one cobalt blue (#2F45FF) card. Beside the board on the right, a small matte off-white globe on a stand with three cobalt dots on it connected by thin glowing arcs. Three-quarter view, slightly from above. All objects placed close together within the center of the frame, nothing near the left or right edges. Minimal editorial 3D render, soft matte materials with subtle frosted glass, warm off-white (#F4F3EF) forms with cobalt blue accents, solid plain light grey background (#E8E8E4) edge to edge, soft diffused studio light from top left, gentle soft shadows, the whole group filling about 45% of the frame, generous empty space, calm and premium, high detail. No text, no letters, no numbers, no logos, no watermark, no people, no sun, no rays. Wide 16:9, 1280x720.
```
Video (image-to-video, loop 4 detik):
```
One off-white task card in the left column slides smoothly to the middle column, then to the right column, where it softly turns cobalt blue, while the globe slowly rotates a little and small light pulses travel along the arcs between the cobalt dots, smooth ease-in-out motion, seamless loop where the last frame matches the first, locked static camera, background stays plain light grey and unchanged, no new objects appear, 4 seconds.
```

#### Hasil 04 (`public/images/teamlead-motion.webp`)
- **Masih gambar diam:** cuma 1 frame, 15 KB. Kayaknya ini baru hasil
  langkah gambar, belum lewat mode video. Sudah dipasang supaya kartu 04
  nggak kosong. Kalau versi animasinya sudah ada, cukup timpa file dengan
  nama yang sama dan buat ulang `teamlead-motion-poster.webp`.
- Komposisi aman di crop 4:3 (x ≈ 390–940).

## Gotcha: ganti gambar dengan nama file yang sama
`public/images/work/netiquette-cloud-erp.jpg` diganti (dari placeholder abu
jadi logo Netiquette), tapi kartunya tetap abu. Penyebabnya:
`next/image` nyimpen hasil optimasi di `.next/cache/images`, dengan kunci
URL-nya. Kalau URL-nya sama, yang disajikan versi cache lama. Browser juga
ikut nge-cache.
Solusinya: hapus `.next/cache/images`, restart `npm run dev`, lalu hard
reload (Cmd+Shift+R). Atau pakai nama file baru tiap kali gambar diganti.
Yang terakhir ini selalu aman, termasuk setelah deploy ke Vercel (CDN-nya
juga nge-cache per URL).

## Gotcha: `next/image` + `fill` tanpa `sizes`
Gejala: gambar kartu project tetap abu di layar lebar, tapi muncul waktu
window dikecilin. Server-nya sudah benar, karena semua lebar (`w=640`
sampai `w=3840`) ngirim gambar baru.
Penyebabnya: `<Image fill>` tanpa `sizes` dianggap `100vw`. Di layar besar
atau retina, browser milih varian `w=3840`, dan varian itu masih nyangkut
di cache browser (versi placeholder lama). Waktu window dikecilin, browser
minta varian lebar lain dengan URL berbeda, jadi gambar barunya kelihatan.
Fix di `ProjectCard`: `sizes="(min-width: 768px) 50vw, 100vw"`, sesuai grid
1 kolom / 2 kolom. Bonusnya, download-nya jauh lebih kecil. Aturannya:
**setiap `<Image fill>` wajib dikasih `sizes`**, kecuali kalau gambarnya
memang selebar layar (seperti `CtaReveal`).

## Koreksi: akar masalah sebenarnya + fix permanen
Dua catatan di atas (hapus `.next/cache/images` + tambah `sizes`) **belum
nyelesain masalahnya**. Yang sebenarnya terjadi:
- Next 16 nyimpen cache `npm run dev` di **`.next/dev/cache/images`**,
  bukan `.next/cache/images` (itu cache punya `next build`). Jadi yang
  dihapus kemarin folder yang salah.
- Di folder dev itu masih ada varian `w=3840` (WebP) dari placeholder abu
  lama: 2 KB, 1200×900, abu rata. Layar besar atau retina minta varian
  3840, jadi dapetnya abu. Layar kecil minta lebar lain yang belum
  ke-cache, jadi gambarnya muncul. Ini sudah dibuktikan di Chrome headless
  yang bersih (2560px @2x), jadi bukan cache browser.

Fix permanen buat **semua** gambar `next/image` (kartu project + ilustrasi
footer): ganti string `"/images/..."` jadi **static import**
(`import x from "@/public/images/work/x.jpg"`). URL-nya jadi
`/_next/static/media/x.<hash>.jpg`, dan hash-nya berubah tiap isi file
berubah. Jadi ganti gambar dengan nama file yang sama otomatis nembus
semua cache (Next, browser, CDN Vercel). Bonusnya, width/height kebaca
otomatis.
- `lib/featured-work.ts`: `image` sekarang `StaticImageData`. Tipe yang
  sama dipakai di `page.tsx`, `WorkList`, `ProjectCard`.
- `CtaReveal`: `footer-illustration.webp` di-import juga.
- `<img>` biasa (hero & kartu What I do) nggak lewat optimizer Next, jadi
  nggak kena masalah ini. Kalau suatu saat diganti, cukup hard reload.

## (Dibatalkan) kartu 04 jadi "Process automation"
Sempat diganti, lalu Rizki minta dikembalikan ke "Team & project leadership".
Kartu dan aset `teamlead-motion.webp` tetap seperti semula.
