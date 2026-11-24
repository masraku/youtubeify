# Struk Musik

Bikin "struk belanja" dari lagu-lagu YouTube Music, mirip Receiptify untuk Spotify.

Ada dua mode:

| Mode | Cara kerja | Isi struk |
|---|---|---|
| **Login Google** (`/liked`) | OAuth Google, lalu YouTube Data API v3 | Lagu yang di-like, urut dari yang terbaru, plus durasinya |
| **Upload Takeout** (`/takeout`) | User upload `.zip` / `watch-history.json` dari Google Takeout, lalu diproses di browser | Top tracks / top artists + jumlah putar, per 4 minggu / 6 bulan / 1 tahun / semua |

> Kenapa mode login tidak bisa menampilkan "paling sering diputar"? YouTube Data API tidak menyediakan riwayat tontonan atau jumlah putar (aksesnya ditutup sejak 2016). Satu-satunya sumber resmi untuk itu adalah Google Takeout.

Stack: Next.js 16 (App Router) + TypeScript. Tanpa library auth dan tanpa database. Gambar dibuat dengan `html-to-image`, dan zip dibaca dengan `jszip`.

---

## Menjalankan di lokal

```bash
npm install
cp .env.example .env.local   # lalu isi nilainya (lihat langkah di bawah)
npm run dev
```

Buka http://localhost:3000.

Mode **Upload Takeout** bisa langsung dicoba tanpa setup Google. Klik "Coba pakai data contoh".

---

## Setup Google Cloud (untuk mode Login Google)

1. Buka https://console.cloud.google.com, lalu buat project baru (misalnya `struk-musik`).
2. **Aktifkan API:** APIs & Services → Library → cari **YouTube Data API v3** → Enable.
3. **OAuth consent screen** (menu *Google Auth Platform*):
   - Branding: isi nama aplikasi dan email support.
   - Audience: pilih **External**. Selama status *Testing*, tambahkan email Google kamu (dan teman yang mau mencoba) di **Test users**. Maksimal 100 user.
   - Data access: tambahkan scope `.../auth/youtube.readonly`, `openid`, dan `profile`.
4. **Buat OAuth client:** Clients → Create client → **Web application**
   - Authorized redirect URIs: `http://localhost:3000/api/auth/callback`
   - Kalau sudah deploy, tambahkan juga `https://domainkamu.com/api/auth/callback`.
5. Salin **Client ID** dan **Client secret** ke `.env.local`:

```env
GOOGLE_CLIENT_ID=xxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxx
APP_URL=http://localhost:3000
```

### Catatan sebelum dibuka ke publik

- `youtube.readonly` termasuk **scope sensitif**. Selama belum diverifikasi Google, user akan melihat layar "Google hasn't verified this app" dan jumlah user dibatasi. Untuk publik, ajukan verifikasi di Google Auth Platform → Verification Center. Kamu butuh halaman kebijakan privasi, domain yang terverifikasi, dan video demo.
- Kuota default YouTube Data API adalah 10.000 unit/hari. Satu kali buka `/liked` memakai sekitar 1–4 unit (maks 4 halaman × 50 video), jadi cukup untuk ribuan user per hari.

---

## Tutorial Google Takeout (untuk user)

Tutorial ini juga tampil di halaman `/takeout`.

1. Buka https://takeout.google.com dengan akun yang dipakai di YouTube Music.
2. Klik **Batalkan semua pilihan** (*Deselect all*).
3. Scroll ke **YouTube dan YouTube Music**, lalu centang.
4. Klik **Beberapa format** (*Multiple formats*). Di baris **riwayat** (*history*), ubah `HTML` ke **`JSON`**, lalu OK. **Wajib.**
5. Klik **Semua data YouTube disertakan** (*All YouTube data included*) → Batalkan semua pilihan → centang hanya **riwayat** (*history*) → OK.
6. **Langkah berikutnya** (*Next step*) → kirim link via email, ekspor sekali, `.zip` → **Buat ekspor** (*Create export*).
7. Tunggu email, biasanya beberapa menit sampai kurang dari 1 jam. Lalu download zip-nya.
8. Upload file `.zip` langsung ke aplikasi. Aplikasi akan mencari `watch-history.json` di dalamnya.

Kalau hasilnya kosong, cek apakah *Histori YouTube* aktif di https://myactivity.google.com/activitycontrols.

---

## Struktur proyek

```
app/
  page.tsx                  landing, pilih mode
  api/auth/login            redirect ke Google (dengan state anti-CSRF)
  api/auth/callback         tukar code jadi access token, simpan di cookie httpOnly
  api/auth/logout           cabut token di Google + hapus cookie (POST)
  liked/page.tsx            server: ambil liked songs dari YouTube Data API
  liked/LikedStudio.tsx     client: atur jumlah lagu, nama, download
  takeout/TakeoutStudio.tsx client: upload, parse, top tracks/artists, download
  takeout/Tutorial.tsx      tutorial Takeout
components/
  Receipt.tsx               tampilan struk (dipakai dua mode)
  DownloadButton.tsx        export ke PNG
lib/
  google.ts                 OAuth config + fetch YouTube Data API
  takeout.ts                parser watch-history.json + agregasi
  config.ts                 APP_NAME, scope, nama cookie
public/sample-watch-history.json   data contoh fiktif (dibuat oleh scripts/make-sample.mjs)
```

### Detail yang perlu diketahui

- **Privasi:** access token hanya disimpan di cookie httpOnly dan kedaluwarsa sekitar 1 jam. Tidak ada database. File Takeout tidak pernah dikirim ke server.
- **Bahasa akun:** judul di Takeout diawali kata yang ikut bahasa akun ("Watched ", "Menonton ", …). Awalan ini dideteksi otomatis dari pola semua judul.
- **Lagu dari video musik biasa** (bukan channel "Artis - Topic") dipecah dari format "Artis - Judul (Official Video)". Kadang hasilnya kurang rapi; atur di `splitTitle()` di `lib/google.ts`.
- **Ganti nama/branding:** ubah `APP_NAME` di `lib/config.ts`. Warna ada di `:root` pada `app/globals.css`.

Proyek ini tidak berafiliasi dengan YouTube atau Google.
