# Performa: "splash" waktu pindah halaman

Keluhan Rizki: waktu pindah halaman ada kedipan/"splash" sepersekian detik,
dan dia curiga karena loading aset. Dia juga nyebut "cookies". **Situs ini
nggak pakai cookie sama sekali**, jadi nggak perlu banner cookie. Yang
bantu kecepatan itu **cache**.

## Diagnosis (direkam pakai CDP `Page.startScreencast`, klik "See my work")
| | `npm run dev` | production (`next start`) |
|---|---|---|
| Jeda beku setelah klik | sekitar 650 ms (128 → 786 ms) | nggak ada, transisi mulai sekitar 200 ms |
| Gambar motion di halaman baru | kosong dulu, baru muncul | langsung ada (poster) |

- Jeda beku di dev itu **kompilasi on-demand**: `next dev` mengompilasi
  route waktu pertama kali dibuka. Di Vercel (production) ini nggak
  terjadi. **Jadi jangan menilai kehalusan transisi dari `npm run dev`.**
- Masalah nyata yang tetap ada di production: aset animasi berat (1,3–5,3
  MB per file, semuanya 1280px walau ada yang tampil cuma sekitar 270px),
  dan cache `public/` bawaan `max-age=0`.

## Yang dilakukan
1. **Animated WebP di-encode ulang sesuai ukuran tampil × 2 (retina)**,
   pakai PIL. Fps dan jumlah frame dipertahankan, quality 65–70:
   - Tile What I do (tampil sekitar 270px) → 768px: frontend 1315→439 KB,
     erp 2910→1296 KB, business 3262→1537 KB.
   - Motion header halaman (`max-w-xl`) → 1024px: work 2784→1968,
     about 2588→1730, contact 1845→1151 KB.
   - Hero & footer (lebar) tetap 1280px, cuma quality: hero 5246→4490,
     footer 2622→2080 KB.
   - Total folder: sekitar 27 MB → 18 MB. File asli masih ada di git
     (`git show HEAD:public/images/<file>`).
2. **Poster sebagai placeholder**: `<img>` animasi dikasih
   `background: url(<name>-poster.webp) center/cover`. Poster (sekitar
   10 KB) langsung tampil, lalu animasi (MB) menimpanya begitu selesai
   dimuat. Slot gambar nggak pernah kosong. Dipasang di `HeaderMotion`,
   hero, dan tile What I do. Mask & brightness tetap berlaku karena
   background-nya ada di elemen `<img>` itu sendiri.
3. **Cache header** di `next.config.ts` untuk `/images/*`:
   `public, max-age=86400, stale-while-revalidate=604800`. Sebelumnya
   setiap pindah halaman, browser nanya ulang ke server untuk tiap
   animasi.
   - ponytail: nama file `public/` nggak di-hash. Kalau aset diganti
     dengan nama sama, pengunjung lama bisa lihat versi lama sampai 1 hari.
     Ganti nama file kalau tukar aset (pelajaran dari kasus
     `next/image` sebelumnya).
4. `teamlead-motion-poster.webp` dibuat ulang dari frame pertama animasi
   yang baru (yang lama masih dari gambar diam).

## Sisa / langkah berikutnya
- Lompatan terbesar: **konversi ke MP4/WebM** (`<video autoplay muted loop
  playsinline>`). Biasanya 5–10× lebih kecil dari animated WebP. Butuh
  `ffmpeg` (`brew install ffmpeg`).
- `public/images/motion-programer.webp` (2,6 MB) identik dengan
  `footer-illustration.webp` dan nggak dipakai di mana pun. Aman dihapus,
  menunggu konfirmasi Rizki.
- Hero 4,5 MB masih yang paling berat (480 frame / 20 detik loop).
