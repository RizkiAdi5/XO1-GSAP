# Motion di sisi kanan judul halaman (Work, About, Contact)

Layout yang direncanakan:
```
Contact                        ||   [motion loop]
Let's talk about your next…    ||
```
Asetnya di-generate sendiri oleh Rizki dari prompt di bawah.

## Aturan aset (sama untuk ketiganya)
- **Ukuran: 16:9, 1280×720**, loop **4–5 detik** (biar file ringan; hero
  dulu 20 detik = 5,3 MB).
- **Background #F4F3EF polos** = `--bg` web. Gambarnya ditaruh langsung di
  halaman tanpa kotak, jadi warnanya harus nyatu. Model AI biasanya
  menggeser warna sedikit (hero: #7084E8 bukan #6B7BFF). Kalau beda,
  tepinya dipudarkan pakai `mask-image` waktu dipasang, nggak perlu
  generate ulang.
- **Objek di tengah, sekitar 45% frame, jauh dari tepi kiri/kanan.**
  Di layar sempit, area tampilnya bisa dipotong jadi lebih persegi.
- Nama file: `public/images/motion-work.webp`, `motion-about.webp`,
  `motion-contact.webp`.

Style block (tempel di akhir setiap prompt gambar):
```
Minimal editorial 3D render, soft matte materials with subtle frosted glass, warm off-white (#F4F3EF) and light grey forms with one accent in soft matte cobalt blue (#4A5FD0), like painted clay, never neon or glowing, solid plain background color #F4F3EF edge to edge with no gradient, no vignette and no visible floor or horizon, soft diffused studio light from top left, a gentle soft contact shadow under the object only, object centered and filling about 45% of the frame, generous empty space on all sides, nothing near the left or right edges, calm and premium, high detail. No text, no letters, no numbers, no logos, no watermark, no people, no sun, no rays. Wide 16:9, 1280x720.
```

> **Revisi 3 (semua halaman):** Rizki minta konsep yang gampang dipahami,
> **bukan abstrak**. Jadi pakai benda sehari-hari yang langsung dikenali
> dalam 1 detik: laptop + HP, meja kerja, kotak surat. Gerakannya juga
> gerakan yang orang sudah kenal di dunia nyata (layar di-scroll, uap kopi
> naik, bendera kotak surat naik).

> **Revisi 4 (warna):** biru di hasil generate terlalu terang/neon. Rizki
> mau biru yang **sama dengan kartu "What I do"**. Biru itu di-sample dari
> poster keempat kartu: rata-rata **#4A5FD0**, cobalt lembut yang matte.
> Menariknya, kartu itu dulu di-prompt "cobalt blue (#2F45FF)", tapi
> material matte + cahaya studio bikin AI merender lebih lembut. Jadi yang
> bikin neon kemungkinan kata-kata "glow". Semua prompt sekarang pakai
> #4A5FD0 + "like painted clay", tanpa kata "glow". Biru aksen web
> (#2F45FF) nggak diubah.

## 1. Work → `motion-work.webp`
Konsep: **laptop dan HP yang sama-sama menampilkan sebuah website**.
Langsung kebaca "dia bikin website/aplikasi".

Gambar:
```
A modern open laptop and a smartphone standing next to it on its right, both showing the same simple clean website: a top navigation bar, a hero banner in soft matte cobalt blue (#4A5FD0), and rows of soft grey content cards below, all without any text. The laptop is matte off-white and light grey, the phone has a thin off-white frame. Three-quarter view, slightly from above. [style block]
```
Video:
```
Very slow and subtle motion. The website on both screens scrolls down smoothly at the same time, revealing more grey content cards, then scrolls back up to the top. The laptop and phone stay completely still, only the screen content moves. Smooth ease-in-out, seamless loop where the last frame matches the first, locked static camera, background stays plain #F4F3EF and unchanged, no new objects appear, 4 seconds.
```

## 2. About → `motion-about.webp`
Konsep: **meja kerja Rizki**: laptop, cangkir kopi, buku catatan, dan
tanaman kecil. Langsung kebaca "ini orangnya, ini tempat dia kerja".

Gambar:
```
A tidy small work desk setup: an open laptop whose screen shows a plain soft matte cobalt blue (#4A5FD0) wallpaper with no glow, a white ceramic coffee mug with a little steam, a closed notebook with a pen on top, and a small potted green plant, all arranged close together on a light wooden desktop that floats in empty space. Three-quarter view, slightly from above. [style block]
```
Video:
```
Very slow and subtle motion. Soft steam rises gently from the coffee mug and fades, the plant leaves sway very slightly as if in a light breeze. All objects stay in place and keep their exact shape. Smooth ease-in-out, seamless loop where the last frame matches the first, locked static camera, background stays plain #F4F3EF and unchanged, no new objects appear, 4 seconds.
```

## 3. Contact → `motion-contact.webp`
Konsep: **kotak surat** dengan bendera cobalt dan amplop. Simbol
"kirim pesan" yang paling universal.

Gambar:
```
A classic rounded mailbox on a short post, matte off-white with a soft matte cobalt blue (#4A5FD0) flag on its side raised halfway, its small front door slightly open with a white envelope peeking out. Three-quarter view, slightly from above. [style block]
```
Video:
```
Very slow and subtle motion. The blue flag on the mailbox rises up smoothly and lowers back down, the white envelope slides a little further out of the open door and then back in. The mailbox stays completely still and keeps its exact shape. Smooth ease-in-out, seamless loop where the last frame matches the first, locked static camera, background stays plain #F4F3EF and unchanged, no new objects appear, 4 seconds.
```

Tips umum prompt video:
- Satu gerakan utama per video. Jangan suruh objek tukar posisi atau
  keluar-masuk frame.
- Tulis "very slow and subtle" dan sebut yang harus **tetap sama**.
- Hasil AI video itu acak, jadi generate 2–3 kali lalu pilih yang paling
  bersih.

## Cara generate (pengingat)
1. Generate **gambar** dulu pakai prompt gambar + style block.
2. Buka mode **video / image-to-video / animate**, upload gambar itu,
   lalu tempel prompt video.
3. Export WebP animasi (atau MP4), simpan dengan nama file di atas, lalu
   kabari nama filenya.

## Terpasang: Contact (`contact-motion.webp`) & About (`about-motion.webp`)
- Komponen bersama `components/ui/HeaderMotion.tsx`: `<picture>` + poster
  frame pertama untuk reduced motion, `mask-image` radial (black 50% →
  transparan 70%) supaya tepi frame hilang, dan prop **`brightness`**.
- **Kenapa ada `brightness`:** background aset dari AI nggak pernah pas
  #F4F3EF. Contact sekitar #EFECE6, About sekitar #E5E2DB (lebih gelap,
  karena bayangan meja yang panjang). Mask cuma mudarin tepi; bagian
  tengah tetap kelihatan sebagai "kabut" abu. `filter: brightness()`
  ngangkat seluruh frame sampai latarnya sama dengan `--bg`.
  Nilainya diukur dari rata-rata piksel latar di poster:
  - Contact: rasio sekitar 1,02–1,04 → `1.03`
  - About: rasio sekitar 1,065–1,09 → 1.075 kebablasan (halo jadi #F7F5EF,
    lebih terang dari halaman) → turun ke **`1.06`**.

  Ini kenop kalibrasi (ditandai `ponytail:` di kode). Kalau asetnya
  di-generate ulang, ukur ulang.
- Layout: judul + intro di kiri, motion di kanan (`md:grid-cols-2`). Di HP
  motion turun ke bawah judul. Di About, placeholder foto dikecilin
  (32×32 → di atas judul).
- `fetchPriority="low"`: H1 tetap elemen LCP. File animasinya 1,8–2,6 MB,
  jadi jangan sampai bersaing dengan teks. TODO performa sama dengan hero:
  konversi ke MP4 kalau `ffmpeg` sudah ada.
- Work: `work-motion.webp` (laptop + HP dengan website), latar sekitar
  #EAE8E2 → `brightness 1.045`.

## Revisi: judul lebih besar, About tanpa foto
- Judul halaman Work/About/Contact diganti dari `text-4xl md:text-6xl`
  (60px) ke **`text-[clamp(3.5rem,8vw,8rem)] leading-[0.95]`**, maksimal
  128px. Dengan motion setinggi sekitar 320px di sebelahnya, judul 60px
  kelihatan kecil dan nggak seimbang. Skalanya ngikutin PRD (judul hero
  `clamp(3rem,10vw,9rem)`), cuma sedikit lebih kecil karena berbagi
  kolom.
- About: placeholder "Photo" dihapus, sesuai permintaan Rizki. Halaman
  About sekarang: judul + bio di kiri, meja kerja di kanan.

## Revisi: motion digeser ke kanan
`md:mr-0` (rata kanan kolom) hampir nggak kelihatan bedanya: di 1440px
lebar kolom kanan sekitar sama dengan `max-w-xl`, dan objek di dalam frame
sudah di tengah dengan ruang kosong di kiri-kanan. Jadi motion ditarik
masuk ke padding samping halaman pakai margin negatif:
`md:-mr-8 lg:-mr-20 xl:-mr-32`. Nilainya sengaja selalu lebih kecil dari
padding halaman di breakpoint itu (`md:px-12`=48, `lg:px-24`=96,
`xl:px-40`=160), jadi nggak bikin scroll horizontal. Hasilnya, ujung kanan
objek sejajar dengan tepi kanan konten (kartu project, Book a call). Aman
karena tepi frame transparan (mask).
