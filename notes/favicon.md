# Ikon situs (favicon + app icon)

Ikon yang muncul di tab browser, bookmark, dan home screen HP. Sekarang
masih `app/favicon.ico` bawaan create-next-app (logo Next.js).

## Aturan desain ikon
- Ikon ini dilihat di ukuran **16–32px** (tab browser). Jadi bentuknya
  harus **satu bentuk tebal, kontras tinggi, tanpa detail kecil**. Detail
  halus, bayangan tipis, dan kaca bening bakal hilang atau jadi kotoran
  di 16px.
- Background **solid cobalt**, bukan transparan. Generator AI jarang bisa
  bikin transparan yang bersih, dan kotak cobalt tetap kebaca di tab
  terang maupun gelap.
- Generate **1024×1024**. Nanti di-resize di kode jadi `icon.png`,
  `apple-icon.png` (180px), dan `favicon.ico` (16/32/48).

## Prompt A: monogram "R" (disarankan)
```
App icon, 1024x1024 square. A single bold rounded lowercase letter "r" in warm off-white (#F4F3EF), thick geometric strokes like SF Pro Rounded Bold, perfectly centered, filling about 55% of the canvas. Solid flat cobalt blue background (#2F45FF) edge to edge with no gradient, no texture, no border. Flat 2D vector style, no 3D, no shadow, no glow, no other text, no extra letters, no watermark. Clean, minimal, high contrast, must stay readable when scaled down to 16x16 pixels.
```

## Prompt B: simbol tanpa huruf (kalau huruf dari AI jelek)
```
App icon, 1024x1024 square. A simple bold symbol of two overlapping rounded rectangles, like two stacked interface cards, the back one slightly offset up and to the right, both in warm off-white (#F4F3EF) with a small gap between them, centered and filling about 55% of the canvas. Solid flat cobalt blue background (#2F45FF) edge to edge with no gradient, no texture, no border. Flat 2D vector style, no 3D, no shadow, no glow, no text, no letters, no watermark. Clean, minimal, high contrast, must stay readable when scaled down to 16x16 pixels.
```

## Sesudah dapat filenya
Taruh di `public/` atau `~/Downloads`, kabari namanya. Langkah
selanjutnya: bikin `app/icon.png`, `app/apple-icon.png`, `app/favicon.ico`
(Next.js App Router otomatis nambahin `<link rel="icon">` dari nama file
itu), lalu hapus favicon Next.js bawaan.

## Terpasang (dari `public/images/logo.jpeg`, Prompt A, 2048×2048)
- File di `app/` (konvensi Next.js App Router, otomatis jadi `<link>`
  di `<head>`, lengkap dengan hash di URL, jadi ganti ikon langsung
  nembus cache):
  - `favicon.ico`: 16/32/48px. Huruf dibikin **75%** tinggi kanvas
    (dicrop lebih rapat), supaya tetap kebaca di tab 16px (sudah dicek
    hasil 16px-nya).
  - `icon.png` 512px & `apple-icon.png` 180px: huruf **52%** tinggi
    kanvas. Ruang lebih lega karena iOS/Android memotong sudutnya jadi
    membulat.
- Posisi huruf diukur dari piksel (bbox piksel off-white). Ternyata sudah
  tepat di tengah (1024, 1024).
- **Gotcha:** Turbopack menolak `.ico` yang isinya PNG **RGB**
  ("The PNG is not in RGBA format"). Harus disimpan RGBA, walaupun
  gambarnya nggak punya bagian transparan.
- `favicon.ico` bawaan Next.js diganti (cadangannya ada di scratchpad
  sesi, nggak di repo).

## Revisi: sudut membulat
- `favicon.ico` & `icon.png` sekarang rounded square (radius 22% sisi),
  dan **sudut luarnya transparan**. Masker digambar di 4× ukuran lalu
  diperkecil, supaya tepi lengkungnya halus (anti-aliased), bukan
  bergerigi.
- **`apple-icon.png` sengaja tetap kotak penuh.** iOS otomatis memotong
  ikon home screen jadi rounded, dan bagian transparan di
  apple-touch-icon malah dirender **hitam** oleh iOS.
- Dicek di latar tab terang (#F4F3EF) dan gelap (#202124): dua-duanya
  kebaca.
