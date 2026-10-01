# Footer reveal effect

Rizki minta footer dengan pola "reveal": footer nongol cuma pas user
scroll sampai abis halamannya, konten di atasnya (yang di-scroll) jadi
"layer kedua" yang nutupin dia sambil ada rounding di sudut bawah.

## Teknik: `position: sticky; top: 100vh` di Footer (BUKAN `bottom: 0`)

Percobaan pertama di kepala sempat kepikiran pakai `sticky bottom-0` +
DOM order footer-duluan + z-index/negative-margin buat bikin main
"nutupin" footer — ternyata salah kaprah dan ribet nggak perlu. Teknik
yang benar (dan udah lama jadi pola umum buat "reveal footer") itu
sederhana banget:

- **DOM order TETAP normal**: Header → main → Footer, persis kayak
  struktur halaman biasa, nggak ada pembalikan urutan.
- Footer dikasih `position: sticky; top: 100vh;` (bukan `bottom: 0`).
  Penjelasan cara kerjanya: sticky dengan `top: 100vh` bikin browser
  "nggak boleh" render footer lebih tinggi dari 100vh-dari-atas-container
  — efeknya footer nunggu di luar viewport (persis di bawah tepi layar)
  selama masih ada konten `main` yang lebih panjang buat di-scroll. Begitu
  scroll nyampe titik di mana posisi asli footer (kalau nggak sticky)
  udah lewat dari ambang 100vh itu — yaitu pas `main` beneran abis — sticky
  "ngelepas" footer dan dia keliatan slide masuk dari bawah layar.
- **Nggak butuh overlap/z-index tricks sama sekali** buat nyembunyiin
  footer — dia beneran nggak ke-render di area visible selama masih ada
  konten `main` di bawahnya buat di-scroll, jadi nggak ada yang perlu
  "ditutupin".

## Rounding: di `main`, bukan di footer

Sesuai deskripsi Rizki ("yang discroll ini jadi layer kedua dan
rounding") — `<main>` (pembungkus `{children}`, isi tiap halaman) dikasih
`rounded-b-[32px]` + `bg-bg` eksplisit (`app/[locale]/layout.tsx`). Karena
warna `bg-bg` sama persis kayak warna body, secara visual nggak ada
sambungan aneh antara "dalam main" dan "luar main" — tapi begitu scroll
nyampe ke footer (`bg-ink`, gelap), sudut rounded di bawah `main` itu jadi
kelihatan sebagai lengkungan transisi dari terang ke gelap.

## Ilustrasi: `assets/motion/motion-programer.webp`

Rizki nambahin file ilustrasi 3D (programmer duduk pakai laptop, gaya
sama kayak referensi visual PRD — background polos, warna pastel). Di-copy
ke `public/images/footer-illustration.webp`, dipasang di footer pakai
`next/image` (otomatis di-resize/optimize sama Next.js ke ukuran render
256px, jadi nggak masalah walau file asalnya 2.6MB). `alt=""` sengaja
kosong karena ini ilustrasi dekoratif doang — nggak nambah informasi di
luar teks CTA yang udah ada di sebelahnya (aturan aksesibilitas: gambar
dekoratif nggak perlu alt text, malah harus dikasih alt kosong biar screen
reader skip).

## Isi footer di-upgrade sekalian

Selain reveal effect, footer-nya juga ditambah:
- Background jadi gelap (`bg-ink`, konsisten sama kartu kontak di
  `MenuOverlay`).
- Tombol CTA "Let's talk" (link ke `/contact`) yang sebelumnya nggak ada.
- Ikon kontak (Mail/WhatsApp/LinkedIn/GitHub) disesuain warnanya buat
  background gelap (`border-surface/20`, bukan `border-line` yang didesain
  buat background terang).

## Update: footer distrukturkan jadi 3 zona (referensi upsunday.co)

Rizki kasih referensi footer upsunday.co — ternyata di sana CTA+ilustrasi
itu cuma bagian ATAS dari footer yang lebih lengkap: ada blurb brand +
kolom navigasi di tengah, baru copyright+ikon sosmed di baris paling
bawah. Footer kita direstruktur jadi 3 zona (masih satu `<footer>`, masih
pakai mekanisme reveal `sticky top-[100vh]` yang sama, cuma isinya
diperkaya):

1. **CTA + ilustrasi** (udah ada sebelumnya) — teks ajakan + tombol
   "Let's talk" + ilustrasi 3D.
2. **Brand blurb + navigasi** (BARU) — nama + satu kalimat positioning
   (`footer.tagline`, diambil dari kalimat yang sama kayak hero Home) di
   kiri, kolom "Navigate"/"Jelajahi" isinya link Home/Work/About/Contact
   di kanan. Sengaja PAKAI HALAMAN ASLI kita (bukan niru "Services/Blog/
   Careers" dari referensi yang nggak ada padanannya di situs ini —
   jangan bikin link ke halaman yang nggak exist).
3. **Copyright + lokasi + ikon sosmed** (dipindah dari zona 1, sekarang
   baris sendiri paling bawah, sesuai posisi di referensi).

Referensi upsunday juga punya form newsletter signup — ini SENGAJA
DILEWATIN karena nggak ada di scope PRD dan butuh backend/integrasi email
marketing yang belum ada (nggak masuk akal nambah fitur yang nggak
diminta cuma buat niru visual).

## Bug: `top: 100vh` doang nggak pernah keliatan — fixed pakai tinggi terukur

Setelah dites beneran, footer-nya statis aja, reveal-nya nggak kejadian.
Ternyata logika `top: 100vh` yang ditulis di awal itu **matematis salah**:

Sticky `top: X` artinya "elemen nggak boleh punya jarak-dari-atas-viewport
kurang dari X". Kalau `X = 100vh` (= tinggi viewport persis), begitu
constraint itu mulai aktif, posisi elemen ke-clamp PERSIS di tepi bawah
viewport (jarak dari atas = tinggi viewport = pas di garis bawah) — dan
karena clamp itu jaraknya udah pas segaris sama tepi bawah, elemen nggak
pernah geser lebih jauh dari itu (nggak ada "sisa ruang" buat dia naik
kelihatan), jadi 0px dari footer yang pernah kebuka. Salah kaprah dari
awal, based on ingetan pola yang ternyata kurang presisi.

**Rumus yang bener**: `top: calc(100vh - tinggi_footer)`. Dengan
threshold ini, footer BARU keliatan pas sisa jarak scroll yang tersisa
persis sama kayak tinggi dia sendiri — dan makin banyak di-scroll, dia
makin "masuk" ke layar dari bawah, persis efek reveal yang dimaksud.

**Masalahnya**: tinggi footer kita nggak fix (responsive — 3 zona yang
stacking beda-beda di mobile vs desktop, bisa berubah kalau konten
berubah). Nggak bisa di-hardcode angka pixel di CSS. Solusinya: ukur
tinggi asli footer pakai `ResizeObserver` (`useEffect` di Footer.tsx,
sekarang jadi Client Component `"use client"`), simpan hasilnya sebagai
CSS custom property `--footer-height` di elemen `<footer>` itu sendiri,
terus `top: calc(100vh - var(--footer-height, 640px))` — angka `640px`
di situ cuma fallback buat sekejap sebelum JS sempet ngukur (atau kalau
`ResizeObserver` gagal karena alasan aneh), bukan nilai yang dipakai
beneran.

## Ganti total pendekatan: `sticky` → `fixed` (masih belum reveal juga)

Fix rumus `calc(100vh - tinggi)` di atas ternyata MASIH belum keliatan
reveal-nya pas dites Rizki. Daripada terus corat-coret kemungkinan
penyebab `sticky` (udah dicek: bukan gara-gara Lenis — `overflow: clip`
yang Lenis pasang ke root element cuma aktif kalau `autoToggle: true` DAN
`lenis.stop()` dipanggil, dan kita nggak pakai fitur itu lagi setelah
`MenuOverlay` didesain ulang jadi popover ringan tanpa scroll lock — tapi
`position: sticky` itu sensitif ke banyak hal lain yang susah dipastikan
tanpa devtools browser beneran), diganti total ke teknik yang lebih
predictable: **`position: fixed`**, yang di project ini udah terbukti
reliable (dipakai buat Header & MenuOverlay).

**Cara kerja baru:**
- `<Footer>`: `position: fixed; bottom: 0;` — DARI AWAL nempel di bawah
  viewport, nggak pernah gerak, nggak pernah "aktif secara kondisional"
  kayak sticky. Dia lepas dari document flow (nggak makan tempat scroll).
- `<main>`: dikasih `margin-bottom: var(--footer-height, 640px)` — ruang
  kosong kosong yang sengaja dicadangkan di akhir halaman, sebesar tinggi
  footer persis. Ruang kosong inilah yang jadi total tambahan tinggi
  scroll di akhir.
- Kenapa reveal-nya tetep kejadian meski footer "selalu ada" dari awal:
  selama masih ada isi `main` yang di-scroll, `main` (z-index lebih
  tinggi, background solid `bg-bg`) nutupin SELURUH area viewport
  termasuk area tempat footer nempel — jadi footer nggak kelihatan bukan
  karena dia "belum ada", tapi karena keketutup. Begitu `main` abis
  (masuk ke zona `margin-bottom` yang kosong), nggak ada lagi yang
  nutupin di situ, footer (yang emang udah di situ dari tadi) jadi
  kelihatan.
- `--footer-height` sekarang di-set ke `document.documentElement` (bukan
  ke footer itu sendiri) via `ResizeObserver`, biar bisa dibaca dari
  `<main>` juga (custom property CSS nurun ke bawah/accessible dari
  elemen manapun kalau di-set di `<html>`).
- Footer dipindah ke LUAR wrapper `max-w-[1440px]` di `layout.tsx` (jadi
  full-bleed kayak Header), dengan wrapper `max-w-[1440px]` sendiri DI
  DALAM footer buat align konten — pola yang sama persis kayak Header.

## Update: container 100% + padding adaptif (bukan box max-width)

Rizki koreksi keras: teknik `mx-auto max-w-[1440px]` yang dipakai buat
Header & wrapper `main` itu SALAH secara konsep — itu bikin elemen jadi
"kotak" yang punya lebar terbatas beneran, bukan yang diminta. Yang bener:
elemen tetap 100% lebar (nggak pernah jadi box sempit), yang nambah cuma
PADDING-nya begitu viewport lebih lebar dari 1440px.

Teknik diganti ke:
```
px-[max(1rem,calc((100%-1440px)/2+1rem))]
md:px-[max(2rem,calc((100%-1440px)/2+2rem))]
```
Logikanya: `(100% - 1440px) / 2` itu nol atau NEGATIF selama viewport
≤1440px — dibungkus `max(1rem, ...)` (atau `2rem` di breakpoint md) biar
nggak pernah kurang dari padding dasar yang emang udah dipakai selama ini.
Begitu viewport > 1440px, bagian `(100%-1440px)/2` jadi positif dan mulai
nambah inset ekstra di atas padding dasar — otomatis "mendorong" konten
ke dalam supaya visually center di 1440px, TANPA bikin elemen pembungkus
jadi kotak sempit. Dipasang di `app/[locale]/layout.tsx` (wrapper `main`)
dan `Header.tsx`.

## Update: footer dipecah jadi 2 section terpisah (motion sbg background)

Rizki minta footer-nya bukan satu blok gelap doang — dipecah jadi:

1. **Section A** — ilustrasi motion (`footer-illustration.webp`) dipasang
   sebagai BACKGROUND full-bleed (`next/image` dengan prop `fill` +
   `object-cover`, bukan gambar kecil di pojok kayak sebelumnya), teks CTA
   + tombol "Let's talk" di atasnya (`position: relative z-auto` alami
   karena berada dalam normal flow di atas gambar yang `absolute`).
   Background section ini warna `#F4F3EF` (senada sama `--bg` token),
   teks pakai `text-ink` (gelap) karena background-nya terang.
2. **Section B** — blok solid gelap (`bg-ink`) isinya brand blurb +
   navigasi + copyright + ikon sosmed (gabungan zona 2 & 3 yang lama).

Efek `Float` (bobbing) yang tadinya dipasang ke ilustrasi DICABUT — nggak
masuk akal lagi animasiin gambar yang sekarang fungsinya jadi background
full-bleed (`fill`), soalnya geser naik-turun bakal nyisain celah kosong
di tepi atas/bawah section, bukan mulus.

`next/image fill` butuh parent `position: relative` (ada, via class
`relative`) dan tinggi ditentuin otomatis dari konten teks di atasnya
(karena `fill` itu `position:absolute`, nggak ikut ngitung tinggi parent
via normal flow) — jadi tinggi section A ngikutin tinggi teks+tombol+
padding vertikal `py-16`, gambar background otomatis ngisi persis segitu.

## Update: reveal-nya sekarang scroll-scrubbed (ngikutin posisi scroll beneran)

Rizki minta reveal-nya bukan cuma "ketutup/kebuka" biner (yang emang udah
dikerjain sama teknik `fixed` + `margin-bottom`), tapi isinya ada animasi
yang progress-nya BENERAN ngikutin posisi scroll — kalau discroll ke
bawah dikit, isi footer keliatan dikit; discroll balik ke atas, animasinya
mundur juga (sebelumnya "statis", nongol/ilang tanpa transisi apa pun).

**Solusi: GSAP ScrollTrigger dengan `scrub: true`.** Bedanya sama animasi
`Reveal` biasa (yang cuma main SEKALI pas masuk viewport): `scrub`
ngebuat progress animasi literally = posisi scroll saat ini (dipetakan ke
rentang 0-1), jadi otomatis jalan maju kalau discroll ke bawah DAN
otomatis jalan mundur kalau discroll ke atas — nggak perlu logic
tambahan buat "arah sebaliknya", itu udah built-in dari cara kerja
`scrub`.

**Masalah teknis: ScrollTrigger butuh elemen trigger normal-flow, padahal
Footer `position: fixed`** (posisinya nggak pernah berubah relatif
viewport, jadi nggak bisa dipakai buat ngitung "kapan harus mulai/
berhenti" berdasarkan posisi scroll). Solusinya: bikin **sentinel**
(`<div data-footer-sentinel>`, tinggi 1px, `position: absolute bottom-0`)
di dalam `<main>` (persis di `app/[locale]/layout.tsx`, setelah
`{children}`) — elemen ini nggak fixed, punya posisi dokumen yang jelas,
dan karena ditaruh `absolute bottom-0` di dalam `<main>` yang
`position: relative`, dia otomatis berada PERSIS di batas akhir konten
asli (sebelum `margin-bottom` cadangan mulai) — persis titik di mana
"zona reveal" seharusnya dimulai.

ScrollTrigger di `Footer.tsx` nge-trigger dari sentinel ini:
```js
ScrollTrigger.create({
  trigger: sentinel,
  start: "bottom bottom",       // sentinel nyentuh tepi bawah viewport
  end: () => `+=${heightRef.current}`, // +tinggi footer (px), bukan persentase
  scrub: true,
  animation: gsap.fromTo(contentRef.current, {autoAlpha:0, y:40}, {autoAlpha:1, y:0}),
});
```
`end: "+=Npx"` (bukan keyword `"top"` atau persentase) dipilih spesifik
karena rentang scroll yang pas buat "selesai reveal" itu HARUS persis
setinggi footer sendiri (`heightRef.current`, hasil ukur `ResizeObserver`
yang sama kayak sebelumnya) — bukan setinggi 1 viewport penuh (yang bisa
beda jauh dari tinggi footer, bikin animasi kelar kecepetan/kelamaan).

`ScrollTrigger.refresh()` dipanggil tiap kali `ResizeObserver` ngedeteksi
perubahan tinggi footer (misal resize window, ganti breakpoint) — biar
titik start/end ScrollTrigger ke-kalkulasi ulang sesuai tinggi terbaru.

## Update: ganti dari GSAP ScrollTrigger scrub → pola sama kayak MenuOverlay

Rizki bilang scroll-scrub-nya masih kerasa "statis" (nggak sesuai
ekspektasi) dan minta mekanismenya disamain kayak `MenuOverlay` — boolean
state `open` + CSS transition, bukan animasi terikat scrub ke posisi
scroll piksel-demi-piksel.

**Diganti total**: GSAP `ScrollTrigger` + sentinel-based scrub DICABUT,
diganti `IntersectionObserver` biasa yang mantau sentinel yang sama
(`[data-footer-sentinel]` di `app/[locale]/layout.tsx`) — begitu sentinel
itu masuk viewport (`entry.isIntersecting`), `setOpen(true)`; begitu
keluar lagi (scroll balik ke atas), `setOpen(false)`. State ini
nge-toggle className Tailwind (`opacity-0 translate-y-10` ↔
`opacity-100 translate-y-0`) dengan `transition-[opacity,transform]` —
**pola identik** sama `MenuOverlay.tsx` (boolean state dari event tertentu
→ toggle className → CSS transition bawaan browser yang handle animasinya
sendiri), bukan GSAP sama sekali buat bagian ini.

Kenapa ini lebih robust: `IntersectionObserver` cuma perlu tau "elemen ini
kelihatan atau nggak", itu API yang jauh lebih simpel dan predictable
dibanding ngitung scroll progress presisi ala `ScrollTrigger` yang perlu
sentinel+refresh+dynamic-end-calculation (banyak bagian gerak, banyak
kemungkinan meleset). Trade-off: animasinya sekarang "on/off" sekali jalan
(0.7s) begitu sentinel masuk/keluar viewport, BUKAN progress yang nempel
pas-pasan ke tiap pixel scroll — tapi ini emang yang diminta ("cara
kerjanya sama dengan buka menu").

## Update BESAR: seluruh trik "layer fixed" DICABUT — footer balik flow normal

Pas dites beneran sambil scroll, kombinasi `position: fixed` + animasi
scale mid-transition bikin ilustrasinya kelihatan KEPOTONG (cuma separuh
badan karakter yang kelihatan, kepala ilang) — karena footer lagi
setengah ke-reveal (sebagian ketutup `main`, sebagian kelihatan) BARENGAN
sama animasi scale-nya jalan, dua sumber "pemotongan visual" itu numpuk
jadi hasil yang kacau. Rizki bilang tegas: **footer harusnya ngikutin
alur halaman sebelumnya kayak biasa, BUKAN jadi "layer" terpisah yang
statis nunggu di belakang.**

**Keputusan final: seluruh mekanisme `fixed` + `margin-bottom` +
`ResizeObserver` + sentinel + `IntersectionObserver`/`ScrollTrigger`
DIHAPUS TOTAL.** Footer sekarang:
- Elemen **normal document flow** — sibling biasa setelah `<main>`,
  persis kayak footer pada umumnya (nggak ada `position: fixed` sama
  sekali).
- `<main>` balik ke className sederhana (`bg-bg pt-20`), nggak ada lagi
  `margin-bottom`/`rounded-b`/sentinel — semua itu udah nggak relevan
  begitu footer bukan lagi elemen fixed.
- Animasi masuknya pakai **pola yang SAMA kayak komponen `Reveal`** yang
  udah dipakai di semua section lain di situs ini: `ScrollTrigger` dengan
  `start: "top 85%", once: true` (main SEKALI pas footer masuk viewport,
  bukan berulang/terikat scroll-scrub) — cuma bedanya animasinya `scale`
  (0.9→1) + `opacity`, bukan `y`-offset kayak `Reveal` biasa (biar cocok
  sama permintaan "masuk kecil ke besar").

**Pelajaran dari seluruh proses footer ini**: fitur "layer/pinned reveal"
itu secara teknis jauh lebih rumit dan rapuh (banyak cara salah: `sticky`
math, `overflow` ancestor, ResizeObserver timing, ScrollTrigger sentinel)
dibanding niat visualnya yang sebenarnya sederhana. Begitu diturunin ke
pola standar "elemen normal + animasi masuk sekali pas keliatan" (pola
yang udah terbukti solid dipakai di semua komponen `Reveal`-style lain),
semua masalah cropping/timing/"kerasa statis" hilang sekaligus.

## Update: GSAP ScrollTrigger diganti IntersectionObserver + CSS transition

Setelah fix `all: true` di `notes/CRITICAL-matchmedia-bug.md`, animasi
masuk footer MASIH nggak kelihatan pas dites. Daripada terus gali
kemungkinan penyebab lain di GSAP/ScrollTrigger (udah beberapa kali bikin
masalah sesi ini), diganti total ke pola yang SAMA kayak `MenuOverlay`
(yang udah terbukti reliable): `IntersectionObserver` biasa + state
boolean (`shown`) + CSS transition (`scale`+`opacity` lewat className
Tailwind, bukan GSAP `gsap.set`/`gsap.to` sama sekali). `once`-behavior
(cuma main sekali) diimplementasi manual dengan `observer.disconnect()`
begitu `entry.isIntersecting` true — setara `once: true` punya
ScrollTrigger, versi native browser API.

## Ketemu akar masalah sebenarnya: threshold ketrigger kecepetan buat elemen setinggi ini

Setelah dicek step-by-step bareng Rizki (termasuk mastiin bukan cache
HMR basi, bukan `prefers-reduced-motion` aktif), ketemu akar masalah
aslinya: **`Footer` itu elemen yang TINGGI** (dua section gabungan bisa
700-900px), tapi `IntersectionObserver` di-set `threshold: 0` — artinya
trigger begitu SATU PIKSEL doang dari tepi atas footer nyenggol viewport.
Titik itu kejadian jauh SEBELUM user beneran bisa lihat isi footer (CTA
text, blok hitam) — dan animasinya (1.2 detik) udah kelar duluan sebelum
scroll nyampe ke bagian yang keliatan. Hasilnya: begitu bagian yang
"berarti" akhirnya masuk pandangan, transisinya udah lama selesai — GAK
ADA BUG, tapi trigger-nya emang ketrigger kepagian buat elemen setinggi
ini.

**Fix**: `threshold: 0.5` — observer baru nge-trigger begitu 50% dari
badan footer udah kelihatan, bukan sekadar ujungnya doang. Ini bikin
transisi 1.2 detiknya jalan pas user beneran lagi scroll ngelewatin
bagian yang keliatan, bukan udah kelar dari jauh-jauh hari.

Sekalian dirapihin: `transform`/`opacity` yang tadinya toggle via
className Tailwind (`scale-90`/`scale-100`) diganti ke **inline `style`**
langsung — nyamain persis pola yang udah terbukti reliable di
`MenuOverlay` (component ini emang bolak-balik dites, jadi mending pakai
yang paling minim ketidakpastian).

## Balik ke GSAP scrub — ternyata itu emang yang dimaksud dari awal

Rizki jelasin lebih presisi: maunya progress animasi BENERAN nempel ke
posisi scroll (masih "belum jadi" selagi scroll, baru genap pas udah
selesai scroll) — itu definisi `scrub`, bukan animasi durasi-tetap
(seberapa pun pas threshold-nya diatur, durasi tetap akan HABIS duluan
sebelum atau selagi scroll, karena scroll manusia nggak seragam
kecepatannya).

**Nyadar**: percobaan GSAP `ScrollTrigger` scrub yang PERTAMA (jauh di
atas) itu sebenarnya udah pendekatan yang BENER — yang bikin dia
kelihatan "nggak jalan" bukan konsep scrub-nya yang salah, tapi karena
ke-hit bug `gsap.matchMedia()` (`notes/CRITICAL-matchmedia-bug.md`) yang
BELUM ketemu/fixed waktu itu. Sekarang dicoba lagi persis pola yang sama
(scrub, trigger dari footer sendiri, `start: "top bottom"` sampai
`end: "top 40%"`) TAPI pakai `all: true` di `mm.add()` — seharusnya
sekarang beneran jalan.

## REWRITE BESAR: teknik "3-layer sticky stacking" (spesifikasi presisi dari Rizki)

Rizki kasih spesifikasi teknis lengkap (hasil analisa detail referensi
upsunday.co) yang ternyata beda konsep dari semua percobaan sebelumnya.
Ini BUKAN "satu footer yang reveal", tapi **3 layer terpisah yang saling
menumpuk**:

1. **`<main>`** (konten tiap halaman) — layer PALING ATAS (`z-30`),
   scroll NORMAL (nggak sticky), sudut BAWAH rounded (`rounded-b-[20px]`
   mobile / `32px` desktop). Nutupin CtaBand di bawahnya selagi masih
   di-scroll.
2. **`CtaBand`** (komponen BARU, `components/ui/CtaBand.tsx`) — layer
   TENGAH (`z-10`, paling rendah), `position: sticky; top: 0; height:
   100vh`. Diem di tempat selama `<main>` masih nutupin dia dari atas.
   Begitu `<main>` udah lewat semua, CtaBand "muncul" (padahal dia dari
   tadi diem doang, cuma baru kelihatan karena nggak ketutup lagi).
   Isinya: ilustrasi jadi background full-bleed (`fill` + `object-cover`,
   pas buat 100vh section), judul CTA dengan **WordRotator** di kata
   terakhir (`footer.ctaPrefix` + `footer.ctaWords`), tombol "Let's talk".
   Parallax: konten teks digeser dikit (`yPercent -6 → 6`) + opacity
   `0.6 → 1`, di-scrub GSAP ScrollTrigger sepanjang section ini
   ke-scroll.
3. **`<footer>`** (disederhanain, cuma isi blok gelap doang — bagian
   ilustrasi+CTA dipindah ke `CtaBand`) — layer PALING BAWAH visual tapi
   `z-20` (di ANTARA main dan CtaBand), scroll NORMAL (bukan sticky),
   sudut ATAS rounded, dan **margin-top NEGATIF kecil**
   (`-mt-8`/`-mt-10`) yang sengaja bikin dia CUMA menutupi SEBAGIAN
   CtaBand — nyisain sedikit (kira-kira sesuai besaran margin negatifnya)
   bagian bawah CtaBand (tombol, ilustrasi) tetap kelihatan pas scroll
   udah mentok di ujung halaman.

### Kenapa urutan z-index-nya begini (30 > 20 > 10)

Karena SEMUA elemen ini di-render dalam document flow NORMAL (kecuali
CtaBand yang sticky), z-index nentuin SIAPA YANG MENANG kalau posisi
layar mereka tumpang tindih. `<main>` paling atas (30) karena dia harus
bisa nutupin CtaBand total selagi masih ada isi buat di-scroll. Footer
(20) di tengah — dia perlu bisa nutupin CtaBand (makanya z-20 > CtaBand's
10) TAPI nggak perlu menang lawan main (main udah nggak overlap footer
posisinya secara natural, jadi z-30 vs z-20 nggak pernah benar-benar
"bentrok" langsung).

### Kenapa CtaBand kelihatan "diam lalu ke-reveal" padahal dia sticky terus

Sticky bikin CtaBand SELALU nempel di `top:0` viewport begitu titik
normalnya udah lewat — tapi dia CUMA KELIHATAN kalau nggak ada yang
nutupin di depannya. Selagi `<main>` (z lebih tinggi) masih se-tinggi
layar atau lebih nutupin area itu, CtaBand secara visual invisible
walau udah "nempel" dari tadi. Begitu `<main>` abis (udah discroll
semua), baru area itu kosong dan CtaBand yang emang udah nempel di situ
jadi kelihatan — itu bedanya sama footer versi lama yang beneran
`display:none`/`opacity:0` sampai di-trigger.

### File yang berubah

- **BARU**: `components/ui/CtaBand.tsx` — layer tengah, sticky, isi
  ilustrasi+WordRotator+parallax.
- **Disederhanain total**: `components/ui/Footer.tsx` — sekarang CUMA
  blok gelap (brand+nav+copyright+sosmed), nggak ada lagi ilustrasi/CTA
  di dalamnya (pindah ke CtaBand), nggak ada lagi GSAP scale-in scrub
  (diganti stagger fade-up per kolom pakai `IntersectionObserver`+CSS,
  60ms per kolom sesuai spek "stagger 60ms per kolom").
- **`app/[locale]/layout.tsx`**: urutan render jadi `Header` →
  `<main z-30 rounded-b>` → `<CtaBand>` → `<Footer z-20 rounded-t -mt>`.
- Warna: TIDAK niru gradient ungu-oranye referensi (PRD eksplisit:
  "Desain, teks, dan aset visualnya tidak ditiru" dari upsunday.co) —
  CtaBand pakai `#F4F3EF` (senada token `--bg` kita) + ilustrasi yang
  udah ada, bukan gradient baru.
- Newsletter form & 3 kolom link (Services/Company/Legal) dari
  referensi SENGAJA DILEWATIN (udah dicatat sebelumnya juga) — nggak ada
  backend newsletter, dan nggak ada halaman Services/Legal di situs ini.

## Fix: CtaBand punya bug sama — trigger GSAP nempel ke elemen `sticky`

Rizki lapor stagger di Footer (blok hitam) udah jalan, tapi CtaBand
(bagian ilustrasi/"motion") diem aja. Penyebabnya PERSIS pola bug yang
sama kayak beberapa kali sebelumnya di sesi ini: `ScrollTrigger` di-set
`trigger: sectionRef.current`, padahal `sectionRef` itu elemen yang
`position: sticky` — ScrollTrigger nggak bisa diandalkan baca posisi
elemen sticky buat ngitung kapan mulai/berhenti scroll (root cause yang
sama kayak percobaan-percobaan gagal Footer sebelumnya).

**Fix: efek parallax scroll-linked di CtaBand DIHAPUS TOTAL** (bukan
diperbaiki lagi dengan trik lain — udah cukup banyak waktu abis di
"GSAP + elemen sticky" yang berulang kali nggak reliable). `WordRotator`
di judulnya tetap jalan (itu animasi GSAP timeline biasa yang independen,
nggak nyentuh scroll position sama sekali, jadi nggak kena masalah yang
sama) — itu udah cukup ngasih "motion" ke section ini tanpa perlu nambah
lapisan scroll-effect yang rawan.

## WordRotator juga kena — ScrollTrigger internal-nya dicabut

Ternyata `WordRotator` (dipakai di dalam CtaBand buat kata yang
berganti) PUNYA `ScrollTrigger` sendiri di dalamnya (`toggleActions:
"play pause resume pause"`, buat pause animasi kalau komponennya di luar
layar — optimasi performa). Karena `WordRotator` di CtaBand ini hidup DI
DALAM elemen `position: sticky`, ScrollTrigger-nya kena bug yang sama:
salah baca posisi, jadi timeline-nya ke-pause dari awal dan nggak pernah
`play()` sama sekali.

**Fix: `ScrollTrigger` di `WordRotator.tsx` dicabut total** — sekarang
timeline-nya jalan terus-terusan (`repeat: -1` doang, nggak ada kondisi
pause-offscreen). Trade-off yang diambil sadar: kehilangan optimasi
"jangan animasi kalau nggak kelihatan" demi korbanin sesuatu yang KECIL
buat dapetin sesuatu yang PASTI JALAN — komponen ini ringan, biaya jalan
terus-terusan nggak signifikan.

**Pola yang udah kelihatan jelas sesi ini**: `GSAP ScrollTrigger`
(termasuk yang nempel tidak langsung lewat ancestor) itu nggak boleh
dipasang di elemen manapun yang punya ANCESTOR `position: sticky` di
atasnya — bukan cuma elemen sticky-nya sendiri yang bermasalah, TURUNAN
di dalamnya juga ikut kena.

## CtaBand ditambah fade-in juga (tetep komponen terpisah, bukan digabung)

Rizki sempet nanya apa CtaBand sebaiknya dipindah jadi bagian dalam
`<footer>` biar "ikut" animasinya — dikonfirmasi dulu (AskUserQuestion)
karena kalau beneran digabung jadi satu elemen, CtaBand bakal kehilangan
`position: sticky`-nya dan seluruh efek 3-layer yang baru dibangun bakal
rusak. Rizki pilih opsi aman: **tetep komponen terpisah**, cuma ditambah
fade-in sendiri.

Fade-in-nya pakai pola yang sama kayak Footer: `IntersectionObserver` +
`useState` + inline `style` transition (opacity + translateY) — BUKAN
GSAP, karena CtaBand elemen `sticky` dan udah kebukti GSAP/ScrollTrigger
nggak reliable di situ. `IntersectionObserver` aman dipakai di elemen
sticky karena dia baca geometri LIVE (posisi render aktual), beda sama
ScrollTrigger yang ngitung berdasarkan posisi dokumen normal.

## REVERT: balik ke footer gabungan (sebelum CtaBand)

Rizki minta di-revert ke versi sebelum `CtaBand` + message key
`footer.ctaPrefix`/`footer.ctaWords` ditambahin. Dikembalikan:

- `components/ui/Footer.tsx` — balik jadi SATU komponen gabungan (Section
  A ilustrasi+CTA teks statis `footer.cta` + Section B blok hitam), pakai
  GSAP scale-in scrub (`scale 0.9→1`, `start: "top bottom"` →
  `end: "top top"`) di elemen footer itu sendiri (bukan sticky, normal
  flow, jadi ScrollTrigger di sini AMAN dipakai).
- `components/ui/CtaBand.tsx` — DIHAPUS.
- `app/[locale]/layout.tsx` — balik ke `<main className="bg-bg pt-20">`
  polos + `<Footer />` langsung sesudahnya, nggak ada lagi z-index/rounded/
  margin-negatif/CtaBand.
- `messages/en.json` & `id.json` — `footer.ctaPrefix`/`footer.ctaWords`
  dibalikin jadi `footer.cta` (kalimat statis, bukan word-rotator).

**Yang TETAP dipertahankan** (bukan bagian dari revert ini, fix bug
independen): `WordRotator.tsx` tetap tanpa `ScrollTrigger` internal
(dihapus sebelumnya karena beneran bug nyata, nggak ada hubungannya
sama ada/nggaknya CtaBand — WordRotator dipakai juga di Home).

## REWRITE FINAL: teknik "pinned reveal" yang bener (wrapper + sticky child)

Rizki kasih spesifikasi teknis super presisi yang ternyata ngungkap akar
masalah SEMUA percobaan sticky/ScrollTrigger yang gagal sepanjang sesi
ini: **ScrollTrigger nggak boleh di-trigger langsung dari elemen yang
`position: sticky`** — itu emang udah kesimpulan kita juga, tapi
solusinya bukan "hindari ScrollTrigger sama sekali di area sticky",
solusinya adalah **pisahin wrapper (normal flow) dari elemen sticky-nya**.

### Pola yang benar

```jsx
<div ref={wrapRef} className="relative z-10 -mt-[100vh] h-[200vh]">
  <section className="sticky top-0 h-screen overflow-hidden">
    {/* isi CTA */}
  </section>
</div>
```

- `wrapRef` itu `<div>` BIASA (bukan sticky), document flow normal, tinggi
  EKSPLISIT `200vh`. `-mt-[100vh]` narik dia naik supaya mulai PERSIS di
  belakang layar terakhir Section A.
- Elemen `sticky` ada DI DALAM wrapper ini sebagai child, `h-screen`.
  Karena wrapper-nya 200vh dan childnya sticky h-screen (100vh), child ini
  bakal nempel di `top:0` selama TEPAT 100vh scroll (dari titik wrapper
  mulai sampai wrapper abis).
- **ScrollTrigger di-trigger dari `wrapRef`, BUKAN dari elemen sticky-nya**
  (`trigger: wrapRef.current, start: "top top", end: "+=100%"`) — karena
  `wrapRef` posisinya deterministik di document flow (nggak sticky), GSAP
  bisa baca dan ngitung posisinya dengan benar. Ini yang bikin SEMUA
  percobaan sebelumnya gagal: kita selalu makai elemen sticky-nya sendiri
  (atau turunannya) sebagai trigger.

### Struktur final 3 bagian

1. **`<main>` (Section A)** — `app/[locale]/layout.tsx`: `relative z-20`,
   `rounded-b-[20px]` mobile / `32px` desktop, `shadow-[...]` lembut ke
   bawah, background solid (`bg-bg`). Scroll NORMAL, nggak ada trik apa
   pun — dia yang "menutupi" CtaReveal selagi masih ada isi.
2. **`CtaReveal` (Section B, BARU, `components/ui/CtaReveal.tsx`)** —
   pola wrapper+sticky di atas. Animasi di dalamnya (semua di-scrub dari
   `wrapRef`, progress 0-1 sepanjang 100vh scroll):
   - Overlay gelap (`dimRef`, `bg-black`) opacity `0.45 → 0` (redup ke
     terang).
   - Judul (`titleRef`) `blur(8px) → blur(0)` + opacity `0.5 → 1`.
   - Gambar (`imageRef`) `scale(0.9) → scale(1)`, `y: 60 → 0`,
     `blur(8px) → blur(0)`.
   - Kata terakhir di judul tetap pakai `WordRotator` (opsional per
     spek, tapi tetap dipasang karena udah ada komponennya).
3. **`<Footer>` (disederhanain lagi)** — `relative z-20`, `-mt-8` (narik
   naik dikit, numpuk di atas CtaReveal — efeknya sudut rounded footer
   nunjukkin warna CtaReveal di baliknya, bukan warna halaman),
   `rounded-t-[20px]/[32px]`, `min-h-[calc(100vh-70px)]` (jaminan tetep
   ada strip ±70px CtaReveal yang kelihatan di atas footer pas mentok).
   Scroll NORMAL, nggak sticky.

### Kenapa ini akhirnya bakal jalan (beda dari 6+ percobaan sebelumnya)

Setiap percobaan sebelumnya (sticky+margin-bottom+sentinel, GSAP scrub
langsung di elemen sticky, IntersectionObserver di elemen sticky buat
CtaBand) entah salah asumsi soal cara sticky bekerja, atau nempelin
ScrollTrigger ke elemen yang salah. Pola wrapper-200vh ini adalah teknik
BAKU yang emang didesain khusus buat masalah "pin section B sambil ngukur
progress scroll dengan presisi" — deterministic by construction, bukan
trial-and-error lagi.

## Fix: `min-h-[calc(100vh-70px)]` bikin footer nyaris 1 layar penuh, kosong

Dari screenshot, `justify-between` doang nggak nolongin — masalah
sebenarnya adalah `min-h-[calc(100vh-70px)]` maksa footer hampir setinggi
100vh, padahal konten aslinya (brand+nav, copyright+ikon) jauh lebih
pendek. Nyisain celah kosong RAKSASA di tengah nggak peduli gimana pun
kontennya di-distribusi.

**Fix**: `min-h` dihapus total — footer sekarang tingginya ngikutin
konten aslinya doang (`py-12` + isi). Konsekuensinya: jaminan "strip
±70px CtaReveal kelihatan di scroll-end" dari spek awal jadi nggak
presisi lagi (mungkin nggak ada peek sama sekali, atau beda ukuran) —
tapi footer yang proporsional sama isinya jauh lebih penting daripada
detail smallprint itu.

## Next
- Foto/ilustrasi ini bisa aja nanti diganti sama aset resmi dari PRD
  (video loop hasil AI-generate sesuai "Prompt aset visual" — kalau
  Rizki udah generate itu). Untuk sekarang pakai yang udah disediain.
