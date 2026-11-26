import type { Metadata } from "next";
import Link from "next/link";
import LegalShell from "@/components/LegalShell";
import { CONTACT_EMAIL, LEGAL_UPDATED, SITE_NAME } from "@/lib/config";

export const metadata: Metadata = {
  title: "Ketentuan Layanan",
  description: `Ketentuan penggunaan ${SITE_NAME}.`,
};

export default function TermsPage() {
  return (
    <LegalShell>
      <h1>Ketentuan Layanan</h1>
      <p className="legal-meta">Terakhir diperbarui: {LEGAL_UPDATED}</p>

      <p>
        Dengan memakai {SITE_NAME}, kamu menyetujui ketentuan di bawah ini. Kalau tidak setuju, mohon tidak memakai
        layanan ini.
      </p>

      <h2>1. Layanan</h2>
      <p>
        {SITE_NAME} adalah alat gratis untuk membuat gambar &quot;struk&quot; dari lagu yang kamu sukai atau putar di
        YouTube Music, berdasarkan data dari akun Google atau file Google Takeout milikmu.
      </p>

      <h2>2. Tidak berafiliasi dengan YouTube atau Google</h2>
      <p>
        {SITE_NAME} adalah proyek independen. Proyek ini tidak dibuat, didukung, atau disponsori oleh YouTube maupun
        Google. YouTube dan YouTube Music adalah merek dagang milik Google LLC.
      </p>

      <h2>3. Ketentuan YouTube</h2>
      <p>
        Mode Login Google memakai YouTube API Services. Dengan memakainya, kamu juga setuju untuk terikat pada{" "}
        <a href="https://www.youtube.com/t/terms" target="_blank" rel="noreferrer">Persyaratan Layanan YouTube</a>.
      </p>

      <h2>4. Penggunaan yang wajar</h2>
      <ul>
        <li>Gunakan {SITE_NAME} hanya dengan akun dan data milikmu sendiri.</li>
        <li>
          Jangan mencoba mengganggu, membebani secara berlebihan, atau menyalahgunakan layanan maupun API yang
          dipakainya.
        </li>
        <li>Jangan memakai {SITE_NAME} untuk tujuan yang melanggar hukum.</li>
      </ul>

      <h2>5. Konten</h2>
      <p>
        Judul lagu dan nama artis yang tampil di struk adalah milik pemiliknya masing-masing. Gambar struk yang kamu
        unduh boleh kamu pakai dan bagikan untuk keperluan pribadi.
      </p>

      <h2>6. Privasi</h2>
      <p>
        Cara kami memperlakukan data kamu dijelaskan di <Link href="/privacy">Kebijakan Privasi</Link>.
      </p>

      <h2>7. Tanpa jaminan</h2>
      <p>
        Layanan disediakan &quot;sebagaimana adanya&quot;. Kami tidak menjamin layanan selalu tersedia, bebas error,
        atau bahwa data dari YouTube/Google selalu lengkap dan akurat. Sejauh diizinkan hukum, kami tidak bertanggung
        jawab atas kerugian yang timbul dari pemakaian layanan ini.
      </p>

      <h2>8. Perubahan dan penghentian</h2>
      <p>
        Kami dapat mengubah ketentuan ini, mengubah fitur, atau menghentikan layanan kapan saja. Tanggal
        &quot;Terakhir diperbarui&quot; akan ikut berubah setiap kali ketentuan diperbarui.
      </p>

      <h2>9. Kontak</h2>
      <p>
        Pertanyaan soal ketentuan ini bisa dikirim ke <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
      </p>
    </LegalShell>
  );
}
