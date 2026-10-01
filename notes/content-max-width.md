# Container max-width buat konten

Rizki bilang konten terlalu lebar di layar lebar, mau lebih banyak ruang
kosong di sisi kiri-kanan. PRD sendiri udah nentuin ini di tabel Design
tokens: "Grid | 12 kolom, max 1440 px" — cuma belum ada container yang
beneran nerapin batas itu, jadi section-section (yang masing-masing cuma
punya `px-4 md:px-8`) stretch ngikutin lebar viewport penuh di monitor
gede.

## Fix

Satu wrapper `<div className="mx-auto max-w-[1440px]">` dipasang di
`app/[locale]/layout.tsx`, ngebungkus `<main>` dan `<Footer />` bareng —
satu titik perubahan yang berlaku ke semua halaman, nggak perlu nyentuh
tiap page.tsx satu-satu. Header nggak ikut dibungkus karena dia emang
`fixed` + udah jadi pill-pill terpisah yang floating (sesuai desain
sebelumnya), bukan konten section biasa.

Di bawah 1440px lebar viewport, nggak ada bedanya sama sekali (`mx-auto`
cuma aktif kalau viewport lebih lebar dari max-width-nya). Efeknya baru
kelihatan di layar >1440px (monitor desktop biasa, ultrawide).

## Revert: page content nggak perlu max-width sama sekali

Rizki minta disederhanain lagi — buat KONTEN HALAMAN (bukan Header/
Footer), nggak perlu logic max-width 1440px ataupun padding adaptif
`calc()` sama sekali. Cukup padding kiri-kanan biasa yang udah ada di
tiap section (`px-4 md:px-8`). Wrapper `<div>` pembungkus `<main>` di
`app/[locale]/layout.tsx` DIHAPUS total — `<main>` sekarang langsung jadi
child dari `LenisProvider`, full width, padding diserahkan sepenuhnya ke
tiap section di masing-masing halaman.

Header & Footer TETAP pakai teknik padding adaptif (`px-[max(...,calc(...))]`)
karena itu nggak dikomplain — cuma konten halaman (list, card, dst) yang
diminta simpel.
