import Link from "next/link";
import BrandLink from "@/components/BrandLink";

const ERRORS: Record<string, string> = {
  access_denied: "Login dibatalkan. Coba lagi kalau sudah siap.",
  state: "Sesi login kedaluwarsa atau tidak valid. Silakan login ulang.",
  token: "Gagal menukar kode login dengan token. Cek GOOGLE_CLIENT_ID/SECRET dan redirect URI.",
  config: "Server belum dikonfigurasi. Isi GOOGLE_CLIENT_ID dan GOOGLE_CLIENT_SECRET di environment variables.",
};

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main className="container">
      <header className="topbar">
        <BrandLink />
      </header>

      <section className="hero">
        <h1>Lagu YouTube Music kamu, dicetak jadi struk.</h1>
        <p>Pilih cara ambil datanya, atur isinya, lalu download sebagai gambar buat dibagikan.</p>
      </section>

      {error && <div className="notice error" style={{ marginBottom: 16 }}>{ERRORS[error] ?? `Terjadi kesalahan: ${error}`}</div>}

      <section className="modes">
        <article className="mode-card">
          <span className="tag">Instan</span>
          <h2>Login dengan Google</h2>
          <p>Struk dari lagu yang kamu like di YouTube Music. Langsung jadi setelah login.</p>
          <ul>
            <li>Isi: lagu yang di-like, urut dari yang terbaru</li>
            <li>Kolom kanan: durasi lagu</li>
            <li>Data tidak disimpan di server</li>
          </ul>
          <a href="/api/auth/login" className="btn btn-primary">Login dengan Google</a>
        </article>

        <article className="mode-card">
          <span className="tag">Paling akurat</span>
          <h2>Upload Google Takeout</h2>
          <p>Struk lagu yang paling sering kamu putar, dihitung dari riwayat lengkapmu.</p>
          <ul>
            <li>Top tracks atau top artists</li>
            <li>4 minggu, 6 bulan, 1 tahun, atau sepanjang waktu</li>
            <li>File diproses di browser, tidak di-upload ke server</li>
          </ul>
          <Link href="/takeout" className="btn">Upload Takeout + Tutorial</Link>
        </article>
      </section>

      <p className="footnote">
        Proyek independen, tidak berafiliasi dengan YouTube atau Google.
      </p>
    </main>
  );
}
