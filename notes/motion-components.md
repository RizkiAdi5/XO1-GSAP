# Komponen motion #2-9 (GSAP-based)

Batch besar: semua komponen motion dari katalog PRD yang butuh GSAP (beda dari
RollText yang pure CSS). Semuanya pakai pola yang sama: `useGSAP` dari
`@gsap/react` + `gsap.matchMedia()` buat reduced-motion, import token dari
`lib/motion.ts`.

## Pola yang diulang di semua komponen (baca ini dulu)

```ts
useGSAP(() => {
  const mm = gsap.matchMedia();
  mm.add({ reduceMotion: "(prefers-reduced-motion: reduce)" }, (context) => {
    const { reduceMotion } = context.conditions;
    if (reduceMotion) { /* fallback statis */ return; }
    /* animasi GSAP normal */
  });
  return () => mm.revert();
}, { scope: ref });
```

`gsap.matchMedia()` itu API resmi GSAP buat kondisional berbasis media query
— dipilih ketimbang cek manual `window.matchMedia(...).matches` sekali di
awal, karena `matchMedia` GSAP **re-run otomatis** kalau media query berubah
(misal user ganti setting reduced-motion di OS saat tab masih kebuka) dan
`mm.revert()` di cleanup otomatis balikin semua state GSAP ke kondisi semula
— nggak perlu nulis cleanup manual per kondisi.

## SplitHeading (`components/motion/SplitHeading.tsx`)

- Pakai `SplitText.create(el, { type: "lines", mask: "lines", autoSplit: true, onSplit })`.
- **`mask: "lines"` otomatis bikin overflow-hidden wrapper di tiap baris** —
  nggak perlu nulis manual. Ini fitur built-in SplitText versi yang di-bundle
  sekarang (dulu di versi lama harus bikin sendiri).
- **`autoSplit: true` otomatis re-split saat resize** (pakai
  `ResizeObserver` + debounce 200ms bawaan, lihat `node_modules/gsap/src/
  SplitText.ts`) — poin "re-split on resize (debounced)" dari prompt PRD
  udah otomatis ke-cover tanpa kode tambahan.
- `onSplit` callback return animasi GSAP-nya — SplitText otomatis nge-handle
  seamless replay kalau di-resplit ulang.
- **Wajib diingat:** JANGAN dipakai di H1 hero (ada komentar JSDoc di file-
  nya). Alasan: split+reveal nunda visual complete dari elemen yang jadi LCP.

## Reveal (`components/motion/Reveal.tsx`)

- `gsap.set(targets, { opacity: 0, ... })` dipanggil **di dalam `useGSAP`**
  (client-side, setelah mount) — BUKAN lewat className/inline style di JSX.
  Kalau taruh `opacity-0` di className, server HTML bakal punya elemen yang
  invisible permanen kalau JS gagal load. Aturan ini eksplisit di prompt
  PRD ("Elements must be visible if JavaScript fails").
- Prop `stagger` (boolean) — kalau true, animasi jalan per-children
  (`gsap.utils.toArray(ref.current.children)`), bukan wrapper-nya sekaligus.

## Marquee (`components/motion/Marquee.tsx`)

- Item di-render dua kali (`[...items, ...items]`), track digeser
  `xPercent: -50` infinite (`repeat: -1`) — begitu geser sampai -50% (pas
  salinan kedua di posisi awal salinan pertama), loop keliatan mulus karena
  isinya identik.
- **Percepatan pas scroll cepat**: subscribe ke `lenis.on("scroll", ...)`,
  baca `velocity` dari payload event, `gsap.to(tween, {timeScale: boost})`
  — animasi di-tween lagi (tweening property dari tween lain), bukan di-set
  langsung, biar transisi kecepatannya halus bukan patah-patah.
- **Tombol pause WAJIB ada** (WCAG 2.2.2 — konten bergerak otomatis harus
  bisa dihentikan user). Status pause disimpan di `useRef` (bukan cuma
  `useState`) supaya closure event listener (`visibilitychange`,
  `mouseenter/leave`) selalu baca nilai TERBARU, bukan nilai basi dari saat
  effect pertama jalan.

## Odometer (`components/motion/Odometer.tsx`)

- Tiap digit = kolom vertikal 0-9 di dalam `overflow-hidden`, digeser
  `yPercent` biar landing di digit yang benar. Karakter non-digit (`+`, `%`,
  `,`) dirender statis, nggak ikut animasi.
- **Aksesibilitas**: seluruh visual (kolom-kolom) dibungkus
  `aria-hidden="true"`, lalu `aria-label={value}` di elemen luar — screen
  reader baca "70+" langsung, bukan coba "baca" 10 angka per kolom.
- Stagger `{ each, from: "end" }` — animasi jalan dari digit PALING KANAN
  duluan (sesuai PRD: "stagger dari kanan ke kiri").

## WordRotator (`components/motion/WordRotator.tsx`)

- Lebar container ikut animasi nyesuaiin lebar kata berikutnya
  (`gsap.to(container, {width: ...})`) — lebar tiap kata diukur dari
  `offsetWidth` masing-masing `<span>` kata (React ref callback per kata),
  bukan dihitung manual.
- Timeline pause otomatis kalau di luar viewport (`ScrollTrigger`
  `toggleActions: "play pause resume pause"`) DAN pause manual saat hover —
  dua-duanya kontrol timeline yang sama, jadi nggak saling override asal
  urutannya benar (pause/resume call terakhir yang menang, that's fine untuk
  UX ini).

## MenuOverlay (`components/ui/MenuOverlay.tsx`, ganti nama dari MobileMenu)

- Timeline dibangun **sekali** saat mount (`dependencies: []`), state
  `open` cuma manggil `.play()` / `.reverse()` di effect terpisah — bukan
  rebuild timeline tiap kali menu dibuka/tutup. Alasan performa + supaya
  state animasi (posisi tengah-tengah kalau di-klik cepat) nggak reset.
- **Tutup 40% lebih cepat**: `tl.timeScale(1 / 0.6).reverse()` — `1/0.6 ≈
  1.67`, artinya 67% lebih cepat = durasi jadi 60% dari aslinya = "40% lebih
  cepat" sesuai definisi PRD.
- **Scroll lock**: `lenis?.stop()` + fallback CSS `document.body.style.
  overflow = "hidden"` — fallback ini penting karena kalau reduced-motion
  aktif, `LenisProvider` sama sekali nggak bikin instance Lenis (lihat
  `motion-foundation.md`), jadi `lenis` bisa `null` dan scroll lock HARUS
  tetap jalan lewat CSS murni.
- **Focus trap** ditulis manual (bukan library) — cuma nangkep Tab di
  elemen fokus pertama/terakhir dalam panel, wrap ke ujung lain. Sengaja
  simpel (YAGNI) karena menu cuma punya beberapa link + tombol, nggak perlu
  library focus-trap buat kasus sesederhana ini.
- Tutup otomatis saat ganti halaman: `usePathname()` di-watch, kalau
  sebelumnya `open` lalu pathname berubah → `onClose()`.

## ProjectCard (`components/ui/ProjectCard.tsx`)

- Label "View" ngikutin posisi cursor pakai `gsap.quickTo()` — API GSAP
  khusus buat animasi yang dipanggil BERKALI-KALI per frame (mousemove),
  jauh lebih murah daripada `gsap.to()` biasa yang bikin tween baru tiap
  panggilan.
- `gsap.matchMedia()` di sini punya **dua kondisi sekaligus** (`pointerFine`
  dan `reduceMotion`) — pill cursor cuma dipasang listener-nya kalau
  `pointer: fine` (device dengan mouse presisi, bukan touch).
- Device touch dapet panah statis (`→`) sebagai gantinya, pakai arbitrary
  Tailwind variant `[@media(pointer:fine)]:hidden` (kebalikan dari pill yang
  `[@media(pointer:fine)]:flex`) — Tailwind v4 ini nggak punya utility
  `pointer-fine:` bawaan, jadi ditulis manual arbitrary variant.

## ParallaxImage (`components/motion/ParallaxImage.tsx`)

- `scrub: true` di ScrollTrigger — animasi "nempel" ke posisi scroll
  (bukan jalan sendiri kayak reveal), gerak maju-mundur ngikutin arah
  scroll user.
- Image di-scale `1.2` lewat class (`scale-[1.2]`) supaya pas digeser
  `yPercent -10..10`, nggak ada celah kosong kelihatan di tepi frame.
- Sama kayak ProjectCard, nonaktif total di `pointer: coarse` (touch) DAN
  saat reduced motion.

## Update: MenuOverlay diganti jadi card slide-from-right (2026-10-01)

Awalnya `MenuOverlay` fullscreen (clipPath dari bawah, PRD spec asli). Atas
permintaan Rizki (referensi visual upsunday.co), didesain ulang jadi:

- **Bukan lagi fullscreen** — card kecil (`max-w-xs`) nempel di pojok
  kanan-atas, dua kartu terpisah (nav links + kartu kontak gelap), bukan
  satu panel penuh layar.
- **Animasi ganti dari clipPath jadi slide + fade** (`xPercent: 120 → 0`
  plus `autoAlpha`) — lebih cocok buat card kecil dibanding efek "tirai"
  yang tadinya didesain buat panel fullscreen.
- **Trigger menu sekarang tampil di SEMUA breakpoint**, bukan cuma mobile.
  Nav bar horizontal desktop (Work · About · Contact langsung kelihatan)
  **dihapus total** — ini beda dari PRD awal yang nentuin "desktop nav bar
  biasa, mobile baru overlay". Keputusan ini dikonfirmasi eksplisit ke
  Rizki dulu sebelum diubah (bukan improvisasi sepihak), karena ini
  penyimpangan nyata dari spesifikasi.
- **Scroll lock DIHAPUS** (nggak ada lagi `lenis.stop()`/`body.overflow`) —
  karena sekarang ini popover kecil (nggak nutupin seluruh layar), bukan
  modal. Ganti pendekatan aksesibilitas: bukan focus-trap modal, tapi pola
  "disclosure" — fokus ke link pertama pas kebuka, klik di luar card
  ataupun Escape nutup, fokus balik ke tombol Menu pas ditutup.
- File nav links ditambah entri "Home" (sebelumnya nggak ada karena
  logo/nama udah jadi link ke home; sekarang perlu eksplisit karena nav
  horizontal desktop udah hilang).

### Bug: menu nggak muncul sama sekali pas diklik — GSAP diganti CSS murni

Rizki lapor klik tombol Menu nggak muncul apa-apa. Akar masalahnya: semua
komponen GSAP di project ini (termasuk `MenuOverlay` versi sebelumnya) cuma
pernah diverifikasi lewat `npm run build` — itu cuma compile TypeScript,
**nggak pernah benar-benar ngejalanin logic di browser**. Kombinasi
`display:none` (dari class Tailwind `hidden`) + GSAP `.set(display:"block")`
di dalam timeline itu rapuh dan susah di-debug tanpa devtools browser
langsung.

**Fix: `MenuOverlay` sekarang pure CSS transition**, bukan GSAP timeline
sama sekali — className berubah kondisional based on `open`
(`translate-x-0 opacity-100` vs `translate-x-[120%] opacity-0`), transisi
jalan lewat `transition-[transform,opacity]` + token durasi/easing CSS yang
udah ada di `globals.css` (`--duration-base`, `--ease-in-out`) — pola yang
sama kayak `RollText` (yang CSS-only dan konsisten jalan). Ini jauh lebih
predictable: nggak ada lagi ketergantungan ke urutan render GSAP timeline.
Konsekuensinya: kehilangan stagger animasi per-link yang tadinya GSAP
kasih — trade-off yang sepadan demi correctness (menu yang KELIATAN lebih
penting daripada polish stagger).

**Pelajaran buat komponen GSAP lain** (SplitHeading, Reveal, Marquee, dst):
mereka SEMUA baru lolos `npm run build`, belum pernah dites klik/scroll
beneran di browser oleh siapa pun. Kalau nemu yang juga nggak jalan, curigai
pola yang sama (interaksi `display`/visibility awal sebelum JS jalan).

### Header direstyle: per-section, bukan satu bar

Rizki minta header nggak jadi satu bar penuh (border-bottom + background
nutupin lebar layar) — tiap section (logo, grup tombol kanan) dibungkus
rounded pill sendiri-sendiri, mengambang di atas konten, persis pola
referensi upsunday. Perubahan teknis:
- `<header>` dari `sticky` + `border-b` + `bg-bg/90` (satu bar penuh) jadi
  `fixed` tanpa background/border sama sekali — cuma container posisi.
- Logo dibungkus `rounded-ui bg-bg/90 backdrop-blur` sendiri.
- Grup tombol kanan (LangSwitch + Let's talk + Menu) dibungkus
  `rounded-ui bg-bg/90 backdrop-blur` sendiri, terpisah dari logo.
- Karena header jadi `fixed` (lepas dari document flow), `<main>` di
  `app/[locale]/layout.tsx` ditambah `pt-20` supaya konten halaman nggak
  ketutupan header yang mengambang di atasnya.

### Animasi masuk "miring" — pindah dari Tailwind arbitrary class ke inline style

Setelah CSS-transition fix di atas, Rizki masih lapor animasinya kerasa
nggak smooth/miring pas masuk dari kanan. Class Tailwind arbitrary value
(`translate-x-[120%]`, `ease-[var(--ease-in-out)]`) itu tetap beresiko
salah parse atau ke-override kelas lain yang nggak kelihatan jelas dari
nama class-nya. Diganti ke **inline `style` langsung** di
`MenuOverlay.tsx` — `transform: translateX(...)`, `opacity`,
`transitionProperty/Duration/TimingFunction` ditulis eksplisit sebagai
nilai literal (`cubic-bezier(0.7, 0, 0.2, 1)`, `0.7s`), bukan lewat
className sama sekali. Ini paling gampang dipastiin benar karena nggak ada
lapisan "apakah Tailwind generate class ini dengan benar" di antaranya.

### Ikon sosial media, bukan teks

Link WhatsApp/LinkedIn/Email (di `MenuOverlay` dan `Footer`) sekarang pakai
ikon bulat (`components/ui/icons.tsx` — `MailIcon`, `WhatsAppIcon`,
`LinkedInIcon`, `GitHubIcon`, inline SVG, path data dari Simple Icons,
nggak nambah dependency npm), bukan teks label polos — sesuai referensi
visual Rizki. Tiap ikon tetap dikasih `aria-label` di elemen `<a>`-nya
(screen reader tetap baca "WhatsApp"/"LinkedIn"/dst meskipun visualnya
cuma ikon, bukan teks).

### Round 2 fixes: ukuran, animasi rotate, dan bug tombol Close

1. **Card diperbesar & dijauhin dari tepi** — `max-w-sm` → `max-w-md`,
   `right-4/right-8` → `right-6/right-12`, `top-20` → `top-24`.
2. **Tombol "Let's talk" dikasih ikon** (`ChatIcon`, bubble chat) di dalam
   badge bulat kecil — sebelumnya cuma teks doang, sekarang konsisten sama
   tombol Menu yang udah ada badge "···"-nya.
3. **Animasi masuk sengaja dibikin miring dulu baru lurus** — bukan cuma
   geser lurus dari kanan. `transform` awal:
   `translateX(8rem) rotate(10deg)` → `translateX(0) rotate(0deg)`, dengan
   `transformOrigin: "top right"` (titik rotasi di pojok kanan-atas card,
   biar rotasinya kerasa natural kayak kertas yang "dibuka" dari situ,
   bukan muter dari tengah). Dua transform (translate + rotate) jalan
   BARENG dalam satu transition — hasilnya card kelihatan miring pas awal
   gerak, terus "settle" jadi lurus pas nyampe posisi akhir. Easing pake
   `cubic-bezier(0.16, 1, 0.3, 1)` (expo.out, token `ease.out` PRD) biar
   gerakannya berasa "meluncur & berhenti", bukan konstan.
4. **Bug: tombol Close nggak bisa nutup menu — FIXED.** Root cause:
   `MenuOverlay` punya listener "klik di luar card = tutup", tapi tombol
   trigger Menu/Close di `Header` **secara teknis ada DI LUAR card**
   (berbeda parent). Pas card lagi kebuka dan user klik tombol Close:
   1. Event `pointerdown` fire duluan → listener "klik di luar" di
      `MenuOverlay` DETECT ini sebagai klik luar → panggil `onClose()` →
      `menuOpen` jadi `false`.
   2. Event `click` fire abis itu di tombol yang sama → handler
      `onClick={() => setMenuOpen(v => !v)}` di `Header` toggle LAGI →
      `menuOpen` balik jadi `true`.
   3. Net effect: card KETUTUP sekejap terus KEBUKA lagi, user ngerasa
      "nggak bisa ditutup".

   **Fix**: `MenuOverlay` sekarang terima prop `triggerRef` (ref ke tombol
   Menu di `Header`), dan listener "klik di luar" DIKECUALIKAN buat
   elemen itu (`!triggerRef.current?.contains(target)`) — biar cuma
   `onClick` tombolnya sendiri yang handle toggle, nggak dobel sama
   listener outside-click.
5. **Dua kartu (nav + kontak) sekarang animasi SENDIRI-SENDIRI, bukan satu
   blok.** Sebelumnya `transform` diterapkan ke wrapper luar, jadi dua
   card ketarik jadi satu gerakan kaku ("nyatu"). Sekarang tiap card
   punya `style` transform/transition sendiri (`cardStyle(delayMs)`
   helper), wrapper luar cuma jadi container posisi doang (nggak punya
   transform). Kartu nav masuk duluan (`delay: 0`), kartu kontak nyusul
   120ms kemudian (`delay: 120ms`) — kelihatan sebagai dua section yang
   entrance berurutan, bukan satu unit. Pas nutup, dua-duanya bareng
   (nggak ada delay) biar kesannya cepat/snappy.

## Update: Page transition akhirnya diimplementasi (2026-10-01)

Rizki minta efek eksplisit: pindah halaman itu halaman baru naik dari
bawah (rounded di sudut atas), halaman lama tetap kelihatan di belakang.
Solusinya BUKAN nunggu React `ViewTransition` ke-expose (masih belum ada,
lihat gap di bawah) — dipakai **browser View Transitions API langsung**
(`document.startViewTransition()`), API native browser yang independen
dari React, jadi nggak perlu nunggu dependency itu.

- **`components/motion/PageTransitions.tsx`** — satu listener klik global
  di `document`, nyegat semua klik ke `<a>` internal (termasuk yang
  di-render `next/link`, karena ujungnya tetap jadi tag `<a>` biasa).
  Dipilih pendekatan "satu listener global" ketimbang bikin custom
  `<TransitionLink>` dan ganti semua pemakaian `next/link` di codebase
  (Header, MenuOverlay, ProjectCard, Footer, dst) — lebih DRY, satu
  tempat, otomatis kepasang ke semua link tanpa nyentuh file lain.
- Alur: `e.preventDefault()` → `document.startViewTransition(() =>
  router.push(url))`. Browser capture snapshot state SEBELUM callback,
  jalanin callback (navigasi Next.js), lalu capture state SESUDAH, dan
  browser sendiri yang render dua snapshot itu via pseudo-element CSS
  (`::view-transition-old(root)`, `::view-transition-new(root)`).
- **CSS di `globals.css`**: `::view-transition-old(root) { animation:
  none; }` — halaman lama SENGAJA nggak dikasih animasi keluar, jadi dia
  cuma diem/kelihatan terus di belakang (matching persis permintaan
  "page sebelumnya masih nampak"). `::view-transition-new(root)` dikasih
  keyframe `page-rise`: mulai dari `translateY(100%)` +
  `border-radius: 32px 32px 0 0` (rounded di atas doang, kayak sheet),
  settle ke `translateY(0)` + radius 0 (rata penuh layar). Stacking
  old-di-bawah/new-di-atas itu default behavior View Transitions API,
  nggak perlu z-index manual.
- **Skip kalau**: klik modifier key (cmd/ctrl/shift/alt — biar "buka tab
  baru" tetap kerja normal), link eksternal, `target="_blank"`,
  `download`, link ke halaman yang sama, atau browser nggak dukung
  `document.startViewTransition` (Safari versi lama, dll — fallback ke
  navigasi Next.js biasa tanpa animasi, TIDAK error).
- **Reduced motion**: dicek di awal `useEffect`
  (`window.matchMedia("(prefers-reduced-motion: reduce)")`) — kalau aktif,
  listener-nya nggak dipasang sama sekali, semua klik jalan normal via
  Next.js `<Link>` default (nggak ada view transition dipanggil).

**Bug ketemu & fix: listener harus di capture phase, bukan bubble.** Versi
pertama pakai `document.addEventListener("click", onClick)` (default =
bubble phase) — ternyata nggak pernah kepake sama sekali, karena
`next/link` punya handler klik sendiri yang dipasang React lebih deket ke
elemen target, jadi DIA yang jalan duluan pas event bubbling, navigasi
udah kejadian lewat Link sebelum listener kita sempet `preventDefault()`.
Dicek langsung source-nya (`node_modules/next/dist/client/link.js:374`):
Link punya pengecekan `if (e.defaultPrevented) return;` di awal handler-nya
— itu pintu masuknya. Fix: pasang listener di **capture phase**
(`{ capture: true }`) yang jalan SEBELUM bubble phase, jadi kita
`preventDefault()` duluan sebelum Link sempet proses, Link pun skip
navigasinya sendiri dan navigasi kita (dibungkus `startViewTransition`)
yang jalan.

**Round 2 fixes (masih sesi yang sama):**
1. **Header sempat dikecualikan dari animasi, lalu di-ralat balik.**
   Awalnya dikasih `viewTransitionName: "site-header"` + CSS buat
   ngediemin dia (pola "anchoring the header" dari dokumentasi Next.js
   sendiri) — tapi Rizki minta batalin, dia MAU header ikut kelihatan
   animasinya. Jadi sekarang header ikut ter-snapshot sebagai bagian dari
   root transition (nggak ada exclusion sama sekali) — kalau nanti mau
   dibalikin ke versi "header diem", tinggal search history/notes ini,
   caranya udah dijelasin di atas.
2. **Durasi kecepetan** — sempet pakai `--duration-base` (0.7s), padahal
   PRD eksplisit nentuin `dur-slow` (1.2s) buat "transisi halaman" di
   tabel Motion tokens-nya sendiri. Dibetulin ke `var(--duration-slow)`.
3. **Rounded cuma di atas, kiri-kanan nempel tepi** — ganti pendekatan
   dari `transform: translateY` + `border-radius` (yang cuma bisa
   ngerounded sudut atas doang karena elemen tetap full-width) ke
   **`clip-path: inset(... round Npx)`**. `inset()` clip-path bisa kasih
   jarak dari SEMUA sisi sekaligus (`inset(top right bottom left round
   radius)`) — jadi start state `inset(100% 24px 0 24px round 32px)`
   berarti: belum kelihatan sama sekali dari atas (`100%`), tapi udah ada
   margin 24px kiri-kanan dengan sudut rounded 32px di keempat titiknya,
   lalu animasi ke `inset(0 0 0 0 round 0)` (full-bleed, rata). Efeknya:
   selama transisi jalan, kelihatan kayak card rounded yang naik dari
   bawah DAN rounded di kiri-kanan, baru pas nyampe akhir dia "flatten"
   jadi full screen.

**Round 3: digabung — halaman lama shrink+glass, halaman baru tetap naik
dari bawah.** Rizki mau dua efek sekaligus, bukan salah satu:
- `::view-transition-old(root)` (halaman lama): `scale(1) → scale(0.88)`
  + `filter: blur(14px) brightness(0.85)` + `border-radius: 0 → 32px` —
  kesannya halaman lama "mundur/terdorong menjauh" dengan efek kaca
  buram, bukan diem doang kayak sebelumnya.
- `::view-transition-new(root)` (halaman baru): TETEP pakai animasi
  `clip-path: inset(...)` naik-dari-bawah yang udah ada — nggak diganti,
  cuma yang lama yang ditambahin efek baru.
- **Header sengaja TIDAK dikecualikan** (nggak ada `viewTransitionName`
  khusus) — dia ikut jadi bagian dari snapshot whole-page, jadi ikut
  shrink+blur (pas halaman lama) dan ikut naik (pas halaman baru) bareng
  konten lain. Ini beda dari draft awal yang sempat exclude header, sudah
  dikoreksi dua kali oleh Rizki ("headernya juga ikutan jangan
  dikecualikan").

**Round 4: `page-rise` diganti dari clip-path-doang jadi ada `translateY`
beneran.** Versi sebelumnya (`clip-path: inset(100% ...)` → `inset(0 ...)`)
itu efeknya cuma MASKING reveal — elemen halaman barunya diem di tempat,
yang berubah cuma seberapa banyak yang "kebuka". Rizki bilang itu masih
kurang: dia mau elemennya BENERAN "dibawa naik" dari bawah (gerakan
spasial asli, bukan cuma reveal). Fix: tambahin `transform: translateY
(12%) → translateY(0)` barengan sama clip-path (yang sekarang cuma ngurus
rounded kiri-kanan doang, top-inset-nya tetep `0` dari awal — nggak lagi
dipakai buat reveal). Elemen halaman baru sekarang literally digeser ke
bawah viewport dulu (kepotong sama `overflow: hidden` bawaan
`::view-transition-group`), baru animasi naik ke posisi asli — itu yang
bikin kerasa "dibawa dari bawah" beneran, bukan sekadar wipe mask.

Stacking old-di-bawah/new-di-atas ("halaman awal layer pertama, halaman
tujuan layer kedua") itu **default behavior View Transitions API**, bukan
sesuatu yang perlu di-set manual — udah otomatis bener dari awal, Rizki
cuma mastiin/restate requirement-nya.

**Ceiling yang perlu diinget** (ditandai `ponytail:` di kode): pola ini
bergantung ke `router.push()` ke-flush sebelum browser sempet capture
snapshot "new" state — ini KERJA untuk route yang udah di-*prefetch*
(default behavior `next/link`, biasanya udah ke-cache pas link kelihatan
di viewport), tapi nggak dijamin 100% oleh spec buat route yang belum
di-prefetch / lambat. Kalau gagal ke-capture tepat waktu, efeknya BUKAN
error — cuma navigasi biasa tanpa animasi. Rizki WAJIB test manual di
browser (Chrome/Edge terbaru yang paling lengkap dukungannya) buat
mastiin animasinya konsisten muncul di alur navigasi yang penting
(Header → Work → case study, dst).

## Bug: WordRotator nampilin SEMUA kata sekaligus (bukan roll satu-satu)

Dipakai di `CtaReveal`, keempat kata (`together`/`great`/`real`/`lasting`)
kelihatan SEMUA sekaligus numpuk ke bawah, bukan roll satu kata pada satu
waktu — artinya clipping (`overflow-hidden` + `height: 1em`) yang
harusnya nyembunyiin kata-kata lain nggak berfungsi.

**Fix**: properti kritis (`position`, `display`, `height`, `overflow`,
`whiteSpace`, `lineHeight`) di `WordRotator.tsx` dipindah dari Tailwind
className ke inline `style` eksplisit. Ini konsisten sama pola yang udah
berkali-kali terbukti lebih reliable sesi ini (RollText, MenuOverlay,
Footer) — kapan pun ada properti CSS yang KRUSIAL buat behavior (bukan
sekadar kosmetik), inline style lebih aman daripada percaya className
Tailwind ke-generate/ke-apply dengan benar di semua kondisi.

## Bug: jeda antar kata nggak konsisten — dependency array unstable

Setelah clipping-nya kelar, masalah baru muncul: jeda 2 detik antar kata
nggak konsisten/kepotong, kayak nggak ada ritme. Penyebabnya: `useGSAP`
di `WordRotator` punya `dependencies: [words, interval]`, dan `words`
diterima dari `t.raw("footer.ctaWords")` (next-intl) — fungsi ini
ngembaliin ARRAY BARU (referensi beda) tiap kali komponen re-render,
meskipun ISINYA persis sama. React (dan `useGSAP` yang berbasis
`useEffect`/`useLayoutEffect`) ngebandingin dependency ARRAY BERDASARKAN
REFERENSI, bukan isi — jadi tiap re-render (dari sumber apa pun, bahkan
yang nggak ada hubungannya kayak Header re-render), seluruh timeline
`WordRotator` DIBONGKAR PASANG ULANG dari nol, motong hold 2 detik yang
lagi jalan sebelum sempat kelar.

**Fix**: dependency diganti jadi `words.join("|")` (string stabil dari
ISI array) bukan `words` itu sendiri — sekarang `useGSAP` cuma re-run
kalau ISI kata-katanya BENERAN berubah, bukan tiap kali referensi array
berubah.

## GAP: React `<ViewTransition>` component — masih belum tersedia

PRD minta page transition pakai React `<ViewTransition>` (komponen native
React 19.2, bukan raw browser API manual) — ini pendekatan resmi yang
didokumentasikan Next.js 16 (`node_modules/next/dist/docs/01-app/02-guides/
view-transitions.md`) dan disebut sebagai fitur utama React 19.2 di
`upgrading/version-16.md`.

**Tapi setelah dicek langsung** (`node -e "console.log(Object.keys(require
('react')))"`), export `ViewTransition` **TIDAK ADA** di package `react`
versi 19.2.8 yang ter-install di project ini — padahal dua fitur React 19.2
lain yang disebutkan di guide yang sama (`Activity`, `useEffectEvent`) ADA.
Dicek juga nggak ada di subpath lain (`react/package.json` exports map cuma
punya `.`, `./jsx-runtime`, `./jsx-dev-runtime`, `./compiler-runtime`).

Kesimpulan: dependency yang ter-install belum benar-benar nyediain fitur
yang didokumentasikan. Daripada maksa workaround manual pakai
`document.startViewTransition()` mentah (rapuh di App Router, biasanya
butuh `flushSync` buat maksa commit sinkron — solusi yang justru BUKAN
alasan React bikin komponen native ini), fitur ini **ditunda**. Ini juga
konsisten sama prioritas PRD sendiri: page transition statusnya "Should",
bukan "Must" — nggak sepadan effort-nya dibanding lanjut ke fitur "Must"
(halaman, contact form, SEO, a11y).

**Action item kalau mau lanjutin nanti:** cek ulang `Object.keys(require
('react'))` setelah update dependency — begitu `ViewTransition` muncul,
tinggal wrap `<main>{children}</main>` di `app/[locale]/layout.tsx` dengan
`<ViewTransition default="page-fade">`, plus CSS keyframes
`page-fade-out`/`page-fade-in` di `globals.css` (fade+shift -16px view
keluar durasi fast, fade masuk durasi base, versi reduced-motion cuma
crossfade tanpa shift).

## Next
- Fase 2 selesai (kecuali page transition, ditunda). Lanjut ke Fase 3:
  struktur konten (MDX case study + JSON UI text), lalu halaman Home →
  Work → Case study → About → Contact.

## Fix WordRotator (2026-10-02): kata melayang + celah lebar
Rizki lapor CTA "Have a project in mind? Let's launch." berantakan: kata
yang berputar posisinya lebih tinggi dari kalimat, dan ada celah sebelum
titik. Ada **tiga bug terpisah** di `WordRotator.tsx`. Karena diperbaiki di
komponennya, CTA di Home dan `CtaReveal` (footer) dua-duanya ikut beres:

1. **Kata melayang ke atas.** Kontainernya `inline-block` +
   `overflow:hidden`. Elemen seperti itu disejajarkan berdasarkan **tepi
   bawahnya**, bukan baseline teks. Ditambah tingginya dipatok `1.3em`,
   sedangkan line-height induknya beda. Fix: `height: 1lh` (= line-height
   induk) + `vertical-align: top`. Kotaknya jadi persis setinggi satu baris
   dan baseline-nya sama dengan kalimat.
2. **Celah lebar (penyebab utama).** Tiap kata `display:block` di dalam
   flex column, dan flex column defaultnya `align-items: stretch`. Jadi
   **semua kata selebar kata terpanjang**. Diukur lewat CDP: `offsetWidth`
   semua kata = 154px ("launch"), padahal "build" cuma 116px. Kontainer
   nggak pernah menyempit. Fix: `alignItems: flex-start` + `width:
   max-content` per kata.
3. **Lebar diukur sebelum font siap.** Waktu mount, Instrument Serif belum
   tentu sudah termuat. Sekarang lebar dibaca lewat function value
   (`width: () => measure(i)`) waktu tween jalan, dan diset ulang setelah
   `document.fonts.ready`.

Sekalian di CTA Home:
- Kata "Let's" dulu hardcoded di JSX, jadi halaman ID tampil "Ada project
  yang ingin didiskusikan? **Let's** bangun." Sekarang dari pesan:
  `home.contactLets` ("Let's" / "Ayo").
- Jadi `<h2>` (font rounded) `text-4xl md:text-6xl leading-[1.2]`.
  Leading 1.2 sengaja, supaya ekor huruf (g, p) nggak kepotong `overflow`
  kotak 1lh. Kata yang berputar pakai Instrument Serif italic + warna
  aksen (font aksen PRD untuk penekanan).
- Tombol "Let's talk" jadi pill hitam + lingkaran panah (konsisten dengan
  hero & form).

### CTA Home: selalu 2 baris
- Kalimatnya dipecah jadi 2 baris yang tetap: pertanyaan, lalu `<span
  className="block">Let's <WordRotator/>.</span>`. Dulu jumlah barisnya
  berubah-ubah karena kata yang berputar beda-beda lebarnya: kata pendek
  muat 1 baris, kata panjang turun.
- Copy ID dipendekkan: "Ada project yang ingin didiskusikan?" (selalu
  kepotong jadi 2 baris sendiri) → **"Punya ide project?"**
- Ukuran font `clamp(1.75rem, 7vw, 3.75rem)`: tiap baris tetap 1 baris
  sampai HP sekitar 360px, maksimal 60px (= `text-6xl` sebelumnya).

## Fix page transition: "splash" halaman lama (2026-10-02)
Gejala di live (rizkiadi.space): Home → klik Contact. Transisi naiknya
halus, tapi **yang naik itu halaman Home**, baru setelah itu Contact
tiba-tiba muncul. Direkam lewat CDP screencast di situs live: frame 229–804
ms halaman barunya masih Home, Contact baru nongol sekitar 939 ms.

Penyebab: callback `document.startViewTransition(() => router.push(...))`
langsung selesai, padahal `router.push` itu async. Browser ngambil
snapshot "halaman baru" waktu DOM masih Home. (Komentar `ponytail:` lama
memang sudah memperingatkan ini.)

Fix di `PageTransitions.tsx`:
- Callback sekarang mengembalikan **Promise** yang baru resolve waktu
  route benar-benar ter-commit. `useLayoutEffect` yang bergantung pada
  `usePathname()` memanggil resolver-nya tepat setelah React menulis DOM
  halaman baru, sebelum frame berikutnya. Jadi snapshot "baru" =
  halaman tujuan.
- Jaring pengaman `COMMIT_TIMEOUT_MS = 2500`: kalau route nggak pernah
  commit (error, kasus khusus), promise tetap resolve. Chrome membatalkan
  transisi kalau update callback lebih dari sekitar 4 detik.
- Animasi CSS (`page-glass-shrink` / `page-rise`) nggak diubah.

Verifikasi: rekam ulang navigasi yang sama di production build lokal.
Halaman yang naik = Contact sejak frame pertama.
**Catatan:** live baru beres setelah deploy ulang ke Vercel.
