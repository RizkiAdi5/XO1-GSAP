# Bug kritis: `gsap.matchMedia()` nggak pernah jalan buat mayoritas user

Ditemuin pas debug kenapa animasi Footer "nggak ada sama sekali" — ternyata
ini BUKAN bug lokal di satu komponen, ini bug yang kemungkinan besar bikin
**hampir semua animasi GSAP di seluruh situs nggak pernah jalan** buat user
yang nggak set `prefers-reduced-motion: reduce` di OS mereka (mayoritas
pengunjung).

## Akar masalah

Semua komponen motion (`Reveal`, `SplitHeading`, `Marquee`, `Odometer`,
`WordRotator`, `ProjectCard`, `ParallaxImage`, `Footer`, `Float`) pakai pola:

```js
const mm = gsap.matchMedia();
mm.add({ reduceMotion: "(prefers-reduced-motion: reduce)" }, (context) => {
  const { reduceMotion } = context.conditions;
  if (reduceMotion) return; // fallback statis
  // ...animasi beneran di sini
});
```

Asumsinya (ditulis di `notes/motion-components.md` sebelumnya): callback ini
SELALU dipanggil, `context.conditions.reduceMotion` isinya boolean true/
false yang bisa dicek. **Asumsi ini SALAH.**

Dicek langsung di `node_modules/gsap/src/gsap-core.js`, method
`MatchMedia.add()`:

```js
for (p in conditions) {
  if (p === "all") {
    active = 1;
  } else {
    mq = _win.matchMedia(conditions[p]);
    if (mq) {
      (cond[p] = mq.matches) && (active = 1);
      // ...
    }
  }
}
active && func(context, f => context.add(null, f));  // <-- callback CUMA jalan kalau active
```

`active` cuma jadi `1` kalau ADA MINIMAL SATU query di object `conditions`
yang match. Kalau cuma ada SATU key (`reduceMotion`) dan user nggak punya
reduced-motion aktif (kondisi paling umum), `mq.matches` itu `false`,
`active` tetep falsy, dan `func` (callback yang isinya SEMUA animasi kita)
**nggak pernah dipanggil sama sekali**. Efeknya: elemen tetap di CSS
default-nya (biasanya opacity 1, posisi normal) — kelihatan "statis",
karena `gsap.set()`/`gsap.to()` yang harusnya jalan nggak pernah dieksekusi.

Dua komponen (`ProjectCard`, `ParallaxImage`) pakai DUA kondisi
(`pointerFine` + `reduceMotion`) — ini kebetulan "nyaris selalu jalan" pas
testing karena browser desktop biasa punya `pointer: fine` match, jadi
`active` ke-set lewat situ. Tapi di device touch-only (nggak match
`pointerFine`, nggak match `reduceMotion` juga), dua komponen ini bakal
kena bug yang sama.

## Fix: key spesial `all: true`

GSAP nyediain key khusus `all` yang, kalau ada, langsung set `active = 1`
TANPA ngecek `matchMedia` sama sekali (`if (p === "all") { active = 1; }`)
— jadi callback-nya GARANSI selalu jalan, sementara key-key lain
(`reduceMotion`, `pointerFine`, dst) tetep diisi boolean sesuai kondisi
aslinya buat kita cek di dalam callback.

```js
mm.add({ all: true, reduceMotion: "(prefers-reduced-motion: reduce)" }, (context) => {
  const { reduceMotion } = context.conditions;
  if (reduceMotion) return;
  // sekarang beneran jalan buat user normal
});
```

## File yang kena fix (9 file)

`components/ui/Footer.tsx`, `components/ui/ProjectCard.tsx`,
`components/motion/Reveal.tsx`, `components/motion/SplitHeading.tsx`,
`components/motion/Marquee.tsx`, `components/motion/Odometer.tsx`,
`components/motion/WordRotator.tsx`, `components/motion/ParallaxImage.tsx`,
`components/motion/Float.tsx` — semua ditambahin `all: true,` di object
kondisi pertama `mm.add()`-nya.

## Kenapa ini baru ketauan sekarang, bukan dari awal

Semua komponen ini cuma pernah divalidasi lewat `npm run build`
(TypeScript/compile check doang, nggak ngejalanin logic runtime di
browser). Baru pas Footer dites beneran di browser dan animasinya
"nggak ada", bug ini kebongkar. **Kemungkinan besar SEMUA reveal/scroll
animation di Home/Work/About/Contact/case study yang udah dibangun dari
awal sesi ini JUGA nggak pernah jalan sampai fix ini** — Rizki WAJIB cek
ulang tiap halaman sekarang (terutama `Reveal` yang paling sering dipakai
buat section fade-in) buat mastiin semuanya beneran animasi sekarang.

## Pelajaran

Ini konfirmasi ulang catatan di `notes/motion-components.md`
("SEMUA komponen GSAP di project ini cuma pernah lolos `npm run build`,
belum pernah dites klik/scroll beneran di browser") — kali ini bukan
cuma satu komponen yang kena, tapi pola yang di-copy-paste ke SEMUANYA.
Kalau nemu komponen baru nanti yang "animasinya nggak ada", curigai pola
`mm.add()` ini duluan sebelum nyari penyebab lain.
