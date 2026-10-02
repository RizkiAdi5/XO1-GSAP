# Calendly di halaman Contact

Section "Or book a call" / "Atau jadwalkan panggilan" ditaruh di bawah form
contact. Isinya widget inline `calendly.com/riiizkiadiii/discovery-call`.
Komponennya `components/ui/CalendlyEmbed.tsx`.

## Kenapa nggak tempel snippet Calendly apa adanya
Snippet resmi Calendly (`<div class="calendly-inline-widget">` + `<script
async>`) bergantung ke script yang **cuma nyari div itu sekali, waktu
script pertama kali dimuat**. Di Next.js, pindah halaman itu client-side:
1. Buka /contact → script dimuat → widget muncul.
2. Pindah ke /work, lalu balik ke /contact → script sudah ada, nggak
   dijalankan ulang → **kotaknya kosong**.

Solusinya: `next/script` dengan `onReady`. `onReady` jalan **setiap kali
komponen di-mount** (baik script baru dimuat maupun sudah ada). Di dalamnya
dipanggil `Calendly.initInlineWidget({ url, parentElement })` ke div milik
kita sendiri. Ada cek `childElementCount > 0` supaya widget nggak dobel.

## Detail lain
- `strategy="lazyOnload"`: script Calendly dimuat waktu browser idle,
  jadi nggak bersaing sama render halaman.
- URL ditambah `hide_gdpr_banner=1` dan `primary_color=2f45ff` (warna
  aksen). Catatan: `primary_color` cuma ngefek kalau akun Calendly-nya
  paket berbayar. Di paket gratis diabaikan, nggak error.
- Div widget dikasih `data-cursor="hide"`. Di dalam iframe, halaman kita
  nggak nerima event pointer lagi, dan iframe pakai cursor bawaannya
  sendiri. Tanpa ini, tetes liquid cursor bakal macet di pinggir iframe.
- Bahasa widget ikut setting browser/akun Calendly, bukan locale situs.
- Sudah dicek di Chrome headless: iframe Calendly ke-insert dengan URL yang
  benar (`embed_domain=localhost:3000`). Isi kalendernya butuh beberapa
  detik untuk muncul.

## Gotcha: format `messages/*.json`
Waktu nambah key `contact.call`, `json.dump` sempat memformat ulang seluruh
file (semua array inline jadi multi-baris), jadi diff-nya berisik.
Formatnya sudah dibalikin ke gaya asli. Pelajaran: kalau edit JSON terjemahan
lewat script, sisipkan teks, jangan dump ulang seluruh objeknya.
