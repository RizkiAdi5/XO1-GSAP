# Komponen motion #1: RollText

Komponen pertama di katalog animasi PRD — dipilih duluan karena paling
sederhana: **pure CSS, nggak butuh GSAP sama sekali**. Cocok jadi pemanasan
sebelum komponen yang butuh GSAP timeline (SplitHeading, Marquee, dst).

## Cara kerja

Dua salinan teks ditumpuk di dalam kontainer `overflow-hidden`:
- Salinan 1 (kelihatan, posisi normal) — geser ke atas (`-translate-y-full`)
  saat hover/focus.
- Salinan 2 (`aria-hidden`, mulai dari `translate-y-full` — persis satu
  tinggi baris di bawah área yang kelihatan) — geser naik ke posisi normal
  (`translate-y-0`) barengan, jadi keliatannya teks "roll" berganti mulus.

Efeknya: dari luar terlihat teks lama geser ke atas dan hilang, teks baru
(yang isinya sama) muncul dari bawah gantiin — padahal itu teks yang sama
persis dua kali, animasinya cuma transform, bukan ganti konten asli.

## Kenapa `aria-hidden` di salinan kedua

Screen reader cuma boleh baca teksnya **sekali**. Tanpa `aria-hidden`, screen
reader bakal baca "Contact Contact" — dua kali karena dua `<span>` isinya
sama persis.

## Kenapa `motion-safe:` bukan override manual

Pendekatan awal yang lebih ribet: tulis transform animasi dulu, baru
"batalkan" pakai `motion-reduce:`. Masalahnya dua media-query variant beda
(`group-hover` + `motion-reduce`) bisa tabrakan urutan CSS-nya tergantung
cara Tailwind generate kelasnya — nggak reliable.

Solusi yang dipakai: bungkus SEMUA class terkait transform/transisi dengan
prefix `motion-safe:` (variant Tailwind bawaan untuk
`@media (prefers-reduced-motion: no-preference)`). Efeknya rapi: animasi
transform HANYA aktif kalau user nggak minta reduced motion — nggak perlu
"membatalkan" apa-apa. Sebagai gantinya, fallback reduced-motion cuma ganti
warna teks (`motion-reduce:group-hover:text-accent`) sesuai spesifikasi PRD
("Reduced motion: Ganti warna saja").

## CSS token tambahan (`app/globals.css`)

RollText murni CSS, bukan GSAP — jadi nggak bisa baca `motionTokens` (object
JS) dari `lib/motion.ts`. Makanya ditambahkan versi CSS-nya sendiri di
`:root` (`--duration-fast`, `--ease-in-out`, dst), nilainya harus tetap sama
persis dengan versi JS. Ini satu-satunya duplikasi token yang disengaja di
project ini — dua bahasa (CSS vs JS) butuh format beda untuk nilai yang
sama, bukan dua sumber kebenaran yang independen.

## Dipasang di

`components/ui/Header.tsx` (nav link, tombol "Let's talk", tombol Menu) dan
`components/ui/MobileMenu.tsx` (tombol Close) — semua tombol/link teks di
Header sesuai baris "Tombol & link" di katalog animasi PRD.

## Next
- Komponen berikutnya: **SplitHeading** — butuh GSAP `SplitText` +
  `ScrollTrigger`, level kompleksitas naik dari RollText. WAJIB diingat:
  jangan dipakai di H1 hero (aturan eksplisit PRD soal LCP).
