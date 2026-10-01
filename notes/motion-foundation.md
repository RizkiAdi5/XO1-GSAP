# Motion foundation: `lib/motion.ts` + `lib/lenis.tsx`

Fase 2 roadmap poin 4 & 5. Ini fondasi yang dipakai SEMUA komponen motion
nanti (RollText, SplitHeading, Marquee, dst) — belum ada komponen visual di
sini, cuma infrastrukturnya.

## `lib/motion.ts`

- Registrasi plugin GSAP (`ScrollTrigger`, `SplitText`, `CustomEase`) sekali
  di satu tempat, dibungkus `if (typeof window !== "undefined")` karena
  plugin GSAP butuh akses `window`/DOM — kalau dipanggil saat SSR (server
  render), akan error karena `window` belum ada di Node.js.
- `motionTokens` — satu sumber kebenaran untuk durasi/easing/stagger/jarak,
  persis dari tabel "Motion tokens" PRD. Komponen lain WAJIB import dari
  sini, jangan nulis angka mentah (`0.35`, `24px`, dst) langsung di
  komponen — itu aturan eksplisit di PRD.
- **`ease.inOut` pakai `CustomEase`, bukan named ease bawaan GSAP.** PRD
  kasih nilai persis `cubic-bezier(.7, 0, .2, 1)` tanpa nama ease GSAP yang
  cocok (beda dengan `ease.out` yang PRD sendiri bilang "expo.out" setara
  dengan `cubic-bezier(.16,1,.3,1)`). Kalau dipaksa pakai `power2.inOut`,
  kurva geraknya beda dari spek — makanya di-register manual sekali pakai
  `CustomEase.create("motionInOut", "0.7, 0, 0.2, 1")`, lalu direferensikan
  by name di `motionTokens.ease.inOut`.

## `lib/lenis.tsx`

- `LenisProvider` — bikin instance Lenis sekali di root, expose lewat
  `useLenis()` hook (React Context) biar komponen lain bisa panggil
  `lenis.scrollTo(...)` tanpa bikin instance baru.
- **Sinkronisasi Lenis ↔ GSAP ScrollTrigger** pakai pola resmi dari
  dokumentasi Lenis: `gsap.ticker.add((time) => lenis.raf(time * 1000))` +
  `gsap.ticker.lagSmoothing(0)`. Alasan pola ini (bukan
  `requestAnimationFrame` manual): GSAP ticker sudah satu "jantung" timing
  buat semua animasi GSAP; kalau Lenis pakai `requestAnimationFrame`
  terpisah, dua sistem animasi jalan di clock yang beda → potensi jank pas
  scroll sambil ada animasi GSAP jalan bareng. `lagSmoothing(0)` matiin
  fitur GSAP yang "mempercepat" animasi setelah tab di-background lama —
  kalau nyala, efeknya scroll bisa nyentak pas balik ke tab.
- **Reduced motion: instance Lenis nggak dibuat sama sekali** kalau
  `prefers-reduced-motion: reduce` aktif (dicek sekali di `useEffect`, bukan
  cuma di-skip animasinya doang) — browser fallback ke native scroll
  otomatis. Ini pilihan paling aman: daripada percaya opsi bawaan Lenis
  `respectReducedMotion` (defaultnya `true`, tapi behavior persisnya nggak
  didokumentasikan detail), kita kontrol eksplisit sesuai aturan wajib PRD
  ("Semua efek dibungkus kondisi prefers-reduced-motion").
- **Scroll ke atas tiap ganti halaman** (`lenis.scrollTo(0, {immediate:
  true})` di `useEffect` yang watch `pathname`) — tanpa ini, pindah halaman
  di Next.js App Router bisa mempertahankan posisi scroll lama, kelihatan
  aneh kalau halaman baru lebih pendek.

## Wiring

`LenisProvider` dipasang di `app/[locale]/layout.tsx`, membungkus
`<Header /><main>{children}</main><Footer />` di dalam
`NextIntlClientProvider`. Urutan nesting: `NextIntlClientProvider` di luar
karena semua teks (termasuk di komponen motion nanti) butuh akses
terjemahan; `LenisProvider` di dalamnya karena cuma urusan scroll behavior.

## Next
- Komponen motion pertama: **RollText** (paling sederhana — CSS-only, nggak
  butuh GSAP sama sekali, cuma `group-hover`/`overflow-hidden`/
  `translateY`). Dipilih duluan sesuai urutan "Prompt kode motion" PRD.
