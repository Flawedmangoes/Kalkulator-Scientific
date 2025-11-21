# Kalkulator-Scientific
Kalkulator web dengan fitur scientific, penjumlahan sudut (DMS), dan kalkulasi skala peta/geografi, dibuat dengan HTML, CSS (Pastel Pink Theme), dan JavaScript murni.

Kalkulator Scientific & Skala Peta
Sebuah kalkulator web multifungsi yang mengombinasikan fungsi kalkulator scientific (log, sin, cos, faktorial, dll.) dengan kalkulator spesifik untuk perhitungan skala peta (mencari Jarak Sebenarnya, Jarak Peta, atau Skala itu sendiri). Dilengkapi juga dengan fitur penjumlahan sudut Derajat-Menit-Detik (DMS).
✨ Fitur Utama
1. Kalkulator Scientific
 * Operasi Dasar: Tambah, kurang, kali, bagi, pangkat (^).
 * Fungsi Lanjutan: Logaritma (log), Akar Kuadrat (√), Trigonometri (sin, cos, tan), Faktorial (x!).
 * Konstanta: Pi (π) dan Konstanta Euler (e).
 * Tampilan: Menampilkan riwayat ekspresi sebelum hasil (history-display).
2. Penjumlahan Sudut (DMS)
 * Mengizinkan input dalam format Derajat (°), Menit ('), Detik ('').
 * Secara otomatis mengonversi kelebihan detik/menit (misal: 65 detik menjadi 1 menit 5 detik) untuk hasil yang akurat.
3. Kalkulator Skala Peta
 * Mode Fleksibel: Pengguna dapat memilih untuk mencari:
   * Jarak Sebenarnya (Js): Menggunakan rumus Js = Jp \times S.
   * Jarak Peta (Jp): Menggunakan rumus Jp = Js / S.
   * Skala (S): Menggunakan rumus S = Js / Jp (dalam satuan 1:X).
 * Konversi Unit Otomatis: Mendukung satuan cm, dm, m, dan km untuk input dan target hasil. Semua perhitungan internal dikonversi ke cm untuk konsistensi.
🛠️ Teknologi yang Digunakan
 * HTML5: Struktur dasar halaman.
 * CSS3: Styling dengan tema Pastel Pink yang elegan (style.css). Menggunakan Flexbox dan Grid untuk tata letak tombol.
 * JavaScript (Vanilla JS): Logika utama kalkulator untuk scientific, DMS, dan skala (script.js).

   
🚀 Cara Menggunakan
  • Clone repositori ini:
   https://github.com/Flawedmangoes/Kalkulator-Scientific

  • Buka file kalkukator.html di browser web favorit Anda.
  • Pilih mode kalkulator yang ingin Anda gunakan (Scientific, DMS, atau Skala).
