import type { Metadata } from "next";
import LegalShell from "@/components/LegalShell";
import { CONTACT_EMAIL, LEGAL_UPDATED, SITE_NAME } from "@/lib/config";

export const metadata: Metadata = {
  title: "Kebijakan Privasi",
  description: `Bagaimana ${SITE_NAME} mengakses, memakai, dan melindungi data kamu.`,
};

export default function PrivacyPage() {
  return (
    <LegalShell>
      <h1>Kebijakan Privasi</h1>
      <p className="legal-meta">Terakhir diperbarui: {LEGAL_UPDATED}</p>

      <p>
        {SITE_NAME} membuat gambar &quot;struk belanja&quot; dari lagu-lagu YouTube Music kamu. Halaman ini
        menjelaskan data apa yang kami akses, untuk apa, dan bagaimana data itu diperlakukan. Ringkasnya:{" "}
        <strong>kami tidak menyimpan data kamu di database, tidak menjualnya, dan tidak membagikannya.</strong>
      </p>

      <h2>1. Data yang diakses</h2>
      <h3>Mode &quot;Login dengan Google&quot;</h3>
      <p>Saat kamu login, kami meminta izin berikut melalui Google OAuth:</p>
      <ul>
        <li>
          <strong>Profil dasar</strong> (<code>openid</code>, <code>profile</code>): nama kamu, hanya untuk
          ditampilkan di struk. Kamu bisa menggantinya sebelum mengunduh.
        </li>
        <li>
          <strong>Baca data YouTube</strong> (<code>youtube.readonly</code>): daftar video yang kamu sukai (like),
          meliputi judul, nama channel, kategori, dan durasi. Data ini dipakai untuk memilih lagu dan menyusun struk.
        </li>
      </ul>
      <p>
        Kami tidak mengakses email, kontak, riwayat tontonan, langganan, komentar, maupun data lain di luar daftar di
        atas. Izin <code>youtube.readonly</code> hanya bisa membaca. Kami tidak bisa mengubah, menghapus, atau
        memposting apa pun atas nama kamu.
      </p>

      <h3>Mode &quot;Upload Google Takeout&quot;</h3>
      <p>
        File Takeout (<code>.zip</code> atau <code>watch-history.json</code>) <strong>diproses sepenuhnya di
        browser kamu</strong>. File tersebut tidak diunggah ke server kami dan hilang begitu halaman ditutup atau
        dimuat ulang.
      </p>

      <h2>2. Cara data digunakan</h2>
      <p>
        Data hanya dipakai untuk satu tujuan: menampilkan struk lagu kepada kamu. Kami tidak memakainya untuk iklan,
        profiling, pelatihan model AI, atau tujuan lain.
      </p>

      <h2>3. Penyimpanan dan keamanan</h2>
      <ul>
        <li>{SITE_NAME} tidak memiliki database dan tidak menyimpan daftar lagu, nama, atau file kamu.</li>
        <li>
          Setelah login, <em>access token</em> dari Google disimpan sementara di cookie <code>httpOnly</code> di
          browser kamu. Cookie ini tidak bisa dibaca oleh JavaScript, dan kedaluwarsa otomatis dalam waktu sekitar 1
          jam.
        </li>
        <li>
          Saat kamu menekan <strong>Logout</strong>, cookie dihapus dan izin akses dicabut langsung di sisi Google.
        </li>
        <li>Semua koneksi memakai HTTPS.</li>
        <li>
          Penyedia hosting kami (Vercel) dapat mencatat data teknis standar seperti alamat IP dan waktu akses untuk
          keperluan keamanan dan operasional, sesuai kebijakan privasi mereka.
        </li>
      </ul>

      <h2>4. Berbagi data</h2>
      <p>
        Kami tidak menjual, menyewakan, atau membagikan data kamu kepada pihak ketiga. Gambar struk dibuat dan
        diunduh di perangkatmu sendiri, dan kamu yang memutuskan mau membagikannya atau tidak.
      </p>

      <h2>5. YouTube API Services</h2>
      <p>
        {SITE_NAME} menggunakan YouTube API Services. Dengan memakai mode Login Google, kamu juga tunduk pada{" "}
        <a href="https://www.youtube.com/t/terms" target="_blank" rel="noreferrer">Persyaratan Layanan YouTube</a>.
        Data yang diambil dari Google juga diatur oleh{" "}
        <a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer">Kebijakan Privasi Google</a>.
      </p>
      <p>
        {SITE_NAME}&apos;s use and transfer of information received from Google APIs will adhere to the{" "}
        <a href="https://developers.google.com/terms/api-services-user-data-policy" target="_blank" rel="noreferrer">
          Google API Services User Data Policy
        </a>
        , including the Limited Use requirements.
      </p>

      <h2>6. Mencabut akses</h2>
      <p>Kamu bisa mencabut izin {SITE_NAME} kapan saja dengan salah satu cara berikut:</p>
      <ul>
        <li>Menekan tombol <strong>Logout</strong> di {SITE_NAME}.</li>
        <li>
          Membuka{" "}
          <a href="https://myaccount.google.com/permissions" target="_blank" rel="noreferrer">
            halaman izin akun Google
          </a>
          , lalu menghapus akses {SITE_NAME}.
        </li>
      </ul>
      <p>Karena kami tidak menyimpan data kamu, tidak ada data yang perlu dihapus dari server kami.</p>

      <h2>7. Cookie</h2>
      <p>
        Kami hanya memakai cookie yang diperlukan agar login berfungsi, yaitu cookie sesi login dan cookie pengaman
        proses login yang berlaku 10 menit. Tidak ada cookie analitik, pelacak, atau iklan.
      </p>

      <h2>8. Anak-anak</h2>
      <p>
        {SITE_NAME} tidak ditujukan untuk anak di bawah 13 tahun, atau di bawah usia minimum yang berlaku di
        negaramu untuk memakai akun Google tanpa izin orang tua.
      </p>

      <h2>9. Perubahan kebijakan</h2>
      <p>
        Kebijakan ini bisa diperbarui sewaktu-waktu. Tanggal &quot;Terakhir diperbarui&quot; di atas akan ikut
        berubah setiap kali ada perubahan.
      </p>

      <h2>10. Kontak</h2>
      <p>
        Ada pertanyaan soal privasi? Hubungi <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
      </p>
    </LegalShell>
  );
}
