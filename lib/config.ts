// Ganti nama aplikasi di sini — dipakai di judul halaman dan di kepala struk.
export const APP_NAME = "STRUK MUSIK";
export const APP_TAGLINE = "Struk belanja dari lagu-lagu YouTube Music kamu";

// Nama situs: dipakai di judul tab, preview share link, dan alt logo.
export const SITE_NAME = "Youtubeify";
export const SITE_TITLE = "Youtubeify · Struk belanja dari lagu YouTube Music kamu";
export const SITE_DESCRIPTION =
  "Cetak lagu favorit & paling sering kamu putar di YouTube Music jadi struk belanja, lalu bagikan sebagai gambar.";

// Cookie names
export const TOKEN_COOKIE = "ytm_token";
export const STATE_COOKIE = "ytm_oauth_state";

// Scope OAuth: profil dasar (buat nama di struk) + baca data YouTube.
export const GOOGLE_SCOPES = [
  "openid",
  "profile",
  "https://www.googleapis.com/auth/youtube.readonly",
];
