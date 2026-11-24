// Ganti nama aplikasi di sini — dipakai di judul halaman dan di kepala struk.
export const APP_NAME = "STRUK MUSIK";
export const APP_TAGLINE = "Struk belanja dari lagu-lagu YouTube Music kamu";

// Cookie names
export const TOKEN_COOKIE = "ytm_token";
export const STATE_COOKIE = "ytm_oauth_state";

// Scope OAuth: profil dasar (buat nama di struk) + baca data YouTube.
export const GOOGLE_SCOPES = [
  "openid",
  "profile",
  "https://www.googleapis.com/auth/youtube.readonly",
];
