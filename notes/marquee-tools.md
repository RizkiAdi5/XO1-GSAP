# Marquee: tombol Pause dihapus, isi ditambah tools

- Rizki minta tombol Pause/Play di pojok marquee dihapus. Yang dihapus:
  tombolnya, state `paused`, `manuallyPausedRef`, dan key `marquee.pause/play`
  di `messages/*.json`.
- Yang **tetap ada**: berhenti pas di-hover mouse, berhenti pas tab nggak
  aktif, dan marquee diam total kalau user nyalain reduced motion.
- **Trade-off aksesibilitas (sadar diambil):** WCAG 2.2.2 minta konten
  yang gerak sendiri lebih dari 5 detik bisa di-pause. Hover cuma nolong
  user mouse, bukan keyboard atau touch. Reduced motion tetap jadi jalan
  keluar. Kalau nanti audit a11y (roadmap fase 4) mempermasalahkan ini,
  opsinya: pause juga saat `focus-within`, atau balikin tombol kecil
  yang nggak terlalu kelihatan.
- Isi marquee: 4 domain (ERP, Accounting, POS, E-Invoicing) + 13 tools.
  Tools-nya **diambil dari field `stack` di MDX case study**, bukan
  dikarang: Next.js, React, TypeScript, Tailwind CSS, Go, Laravel,
  Filament, PHP, PostgreSQL, MySQL, Prisma, REST API, ColdFusion.
