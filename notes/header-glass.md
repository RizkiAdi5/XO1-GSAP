# Header glass

Pill di header sempat diubah (di luar sesi) jadi `bg-bg/90 backdrop-blur`.
Isinya hampir solid, jadi nggak kelihatan kayak kaca. Sekarang semua pill
pakai utility CSS bersama di `globals.css`:

- `.glass` (logo, ID/EN, Let's talk): `background: white/35%` +
  `backdrop-filter: blur(16px) saturate(180%)`.
- `.glass-dark` (tombol Menu): `ink/60%` + blur yang sama.

## Kenapa begini
- **Kesan kaca datang dari cahaya, bukan dari isi.** Isinya dibikin tipis
  (35%) supaya konten yang lewat di bawah header tetap kelihatan samar.
  Kesan tebal kacanya dari:
  1. rim atas terang (`inset 0 1px 1px white/90%`), kayak pantulan cahaya
     di tepi kaca melengkung,
  2. rim bawah gelap tipis (`inset 0 -1px 2px`),
  3. bayangan luar lembut, supaya pill "ngambang" di atas halaman.
- `saturate(180%)` bikin warna di balik kaca lebih hidup (kayak hero biru
  pas lewat di bawah header). Ini ciri khas glass gaya Apple.
- Dibikin class CSS biasa, bukan deretan utility Tailwind di tiap elemen,
  karena ada 4 pill yang harus identik. Kalau mau ubah, cukup di satu
  tempat.
- `-webkit-backdrop-filter` tetap ditulis untuk Safari versi lama.

## Gotcha
- Efek kaca baru kelihatan waktu **ada konten di belakangnya** (waktu
  scroll). Di posisi paling atas halaman, latarnya off-white polos, jadi
  pill kelihatan kayak kaca buram terang. Itu wajar.
- Belum pakai lensa `feDisplacementMap` (kayak cursor) buat efek refraksi
  di tepi. Bisa ditambah, tapi cuma jalan di Chrome dan lebih berat,
  karena header selalu ada di layar.

## Revisi: border dikurangi
Rizki: "jangan terlalu di-border-kan". Border 1px putih dan rim bawah gelap
dihapus. Highlight atas dilemahkan (`inset 0 1px 0 white/50%`, tanpa blur)
dan bayangan luar diturunkan ke 14%. Sekarang pill dibentuk oleh blur dan
bayangan saja, nggak ada garis tepi yang kelihatan.
