# Font heading: SF Pro Rounded

Rizki minta semua tulisan besar (H1 tiap halaman) pakai SF Pro Rounded.

## ⚠️ Peringatan lisensi — sudah disampaikan, keputusan Rizki

SF Pro Rounded itu font proprietary Apple — lisensinya **melarang
redistribusi dan embedding di luar platform Apple**. Rizki nambahin file
`font/FontsFree-Net-SF-Pro-Rounded-Bold.ttf` sendiri ke project (dari
situs "font gratis" pihak ketiga, bukan dari Apple resmi). Sudah
diinformasikan risikonya (situs publik yang embed font ini berpotensi
melanggar lisensi Apple) via pertanyaan eksplisit — **Rizki pilih tetap
pakai file ini**, jadi diwire up sesuai permintaan. Tanggung jawab
kepatuhan lisensi ada di Rizki sebagai pemilik situs, bukan sesuatu yang
diputuskan sepihak di sini.

Kalau nanti berubah pikiran: solusi legal-nya ganti ke font Google Fonts
yang bentuknya rounded juga (Quicksand, Baloo 2, Nunito) via
`next/font/google` — gratis dan sah dipakai di web publik.

## Cara lama (sebelum ada file lokal): CSS generic `ui-rounded`

`ui-rounded` itu keyword CSS bawaan (CSS Fonts Level 4) yang khusus
di-resolve browser Apple (Safari, macOS, iOS) jadi SF Pro Rounded ASLI
punya sistem operasi — otomatis, tanpa perlu download apa pun. Di browser
non-Apple (Chrome di Windows, Firefox, dll), keyword ini nggak dikenali
dan browser skip ke fallback berikutnya di font stack.

```css
--font-rounded: ui-rounded, "SF Pro Rounded", var(--font-geist-sans), sans-serif;
```

**Konsekuensi:** efek ini CUMA kelihatan buat pengunjung yang pakai
device/browser Apple. Pengunjung Windows/Android/Linux tetap lihat Geist
(font display yang udah ada). Ini batas teknis nyata, bukan bug — nggak
ada workaround selain itu tanpa lisensi khusus dari Apple.

## Implementasi sekarang: `next/font/local`

File font di-load via `next/font/local` (bukan `next/font/google`, karena
ini file lokal bukan dari Google Fonts) di
`app/[locale]/layout.tsx`:

```ts
const sfProRounded = localFont({
  src: "../../font/FontsFree-Net-SF-Pro-Rounded-Bold.ttf",
  variable: "--font-sf-pro-rounded",
  weight: "700",
  display: "swap",
});
```

- Path `src` relatif dari file layout-nya sendiri (`app/[locale]/
  layout.tsx` → `../../font/...` naik dua folder ke root project).
- Cuma ada 1 file/1 weight (Bold 700) — nggak masalah karena dipakai buat
  H1 doang yang emang butuh bold.
- `display: "swap"` — teks tetap kelihatan pakai font fallback (Geist)
  duluan sementara SF Pro Rounded masih di-download, baru di-swap begitu
  selesai. Mencegah teks invisible (FOIT) yang bisa ganggu LCP di hero.
- Token `--font-rounded` di `globals.css` di-update: sekarang
  `var(--font-sf-pro-rounded)` jadi prioritas utama (bukan lagi
  `ui-rounded`), dengan `ui-rounded` tetap disisain sebagai fallback kedua
  kalau-kalau font lokalnya gagal load karena suatu hal.

## Update: jadi primary font buat SEMUA heading, bukan cuma H1

Rizki koreksi: awalnya cuma dipasang manual di 5 H1 lewat className
`font-rounded`. Ternyata maunya lebih luas — semua judul section (H2/H3
kayak "Selected work", "What I do", nama project di card, dst) ikut pakai
font ini, deskripsi/body text TETAP Geist.

Daripada nempelin className `font-rounded` manual di belasan tempat
(rapuh — gampang kelupaan pas nambah heading baru nanti), solusinya
ditaruh di **CSS global** (`app/globals.css`), nge-target SEMUA elemen
heading sekaligus:

```css
h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-rounded);
}
```

Ini otomatis berlaku ke SEMUA `<h1>`-`<h6>` di seluruh situs — termasuk
heading di dalam konten MDX case study (`## Context & problem`, dst, lewat
`mdx-components.tsx`) — tanpa perlu disentuh satu-satu. ClassName manual
`font-rounded` yang sempat ditambahin ke 5 H1 udah dihapus lagi (jadi
redundan, rule CSS global ini udah nyakup elemen `<h1>` juga).

Body text (`<p>`, `<li>`, form field, dll) nggak kena rule ini — tetap
`--font-sans` (Geist) dari rule `body { font-family: ... }`.
