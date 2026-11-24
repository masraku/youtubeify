/**
 * Tutorial ekspor Google Takeout.
 * Label tombol ditulis dalam bahasa Indonesia + Inggris (dalam kurung),
 * karena tampilan Takeout mengikuti bahasa akun Google masing-masing.
 */
export default function Tutorial({ open = true }: { open?: boolean }) {
  return (
    <details className="tutorial" open={open}>
      <summary>Cara ambil data dari Google Takeout (±5 menit + menunggu email)</summary>
      <ol>
        <li>
          Buka <a href="https://takeout.google.com" target="_blank" rel="noreferrer">takeout.google.com</a> dan
          pastikan kamu login dengan akun Google yang dipakai di YouTube Music.
        </li>
        <li>
          Klik <span className="kbd">Batalkan semua pilihan</span> (<em>Deselect all</em>) di bagian atas daftar,
          supaya yang diekspor cuma data YouTube dan prosesnya cepat.
        </li>
        <li>
          Scroll ke bawah sampai <span className="kbd">YouTube dan YouTube Music</span>, lalu centang kotaknya.
        </li>
        <li>
          Di bawah YouTube, klik <span className="kbd">Beberapa format</span> (<em>Multiple formats</em>). Di baris{" "}
          <span className="kbd">riwayat</span> (<em>history</em>), ganti <code>HTML</code> menjadi{" "}
          <code>JSON</code>, lalu klik OK.{" "}
          <span className="hint">Langkah ini wajib. Aplikasi ini hanya bisa membaca format JSON.</span>
        </li>
        <li>
          Klik <span className="kbd">Semua data YouTube disertakan</span> (<em>All YouTube data included</em>) →{" "}
          <span className="kbd">Batalkan semua pilihan</span> → centang hanya <span className="kbd">riwayat</span>{" "}
          (<em>history</em>) → OK. <span className="hint">Video, playlist, dan komentar tidak dibutuhkan.</span>
        </li>
        <li>
          Scroll ke paling bawah, klik <span className="kbd">Langkah berikutnya</span> (<em>Next step</em>). Pilih:
          tujuan <span className="kbd">Kirim link download via email</span>, frekuensi{" "}
          <span className="kbd">Ekspor sekali</span>, jenis file <code>.zip</code>. Lalu klik{" "}
          <span className="kbd">Buat ekspor</span> (<em>Create export</em>).
        </li>
        <li>
          Tunggu email dari Google. Kalau cuma riwayat, biasanya beberapa menit sampai kurang dari satu jam. Klik link
          di email, lalu download file zip-nya.{" "}
          <span className="hint">Link download berlaku terbatas (biasanya sekitar seminggu).</span>
        </li>
        <li>
          Upload <strong>file .zip itu langsung</strong> di halaman ini. Kalau sudah diekstrak, upload file{" "}
          <code>Takeout/YouTube dan YouTube Music/…/watch-history.json</code> (nama folder bisa sedikit beda
          tergantung bahasa akun).
        </li>
      </ol>
      <p className="hint" style={{ fontSize: 13, marginTop: 0, marginBottom: 16 }}>
        Riwayat kosong? Cek apakah <em>Histori YouTube</em> aktif di{" "}
        <a href="https://myactivity.google.com/activitycontrols" target="_blank" rel="noreferrer">
          Kontrol aktivitas
        </a>
        . Kalau dijeda, lagu yang kamu putar tidak tercatat.
      </p>
    </details>
  );
}
