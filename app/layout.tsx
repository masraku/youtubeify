import type { Metadata } from "next";
import "@fontsource/inter/400.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/800.css";
import "@fontsource/space-mono/400.css";
import "@fontsource/space-mono/700.css";
import "./globals.css";
import { SITE_DESCRIPTION, SITE_NAME, SITE_TITLE } from "@/lib/config";

/**
 * URL absolut situs, dipakai untuk link gambar preview (og:image).
 * Urutan: APP_URL → domain produksi Vercel → localhost.
 * APP_URL berisi localhost diabaikan kalau berjalan di Vercel.
 */
function siteUrl(): URL {
  const fromEnv = process.env.APP_URL?.trim().replace(/\/$/, "");
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  const envIsLocal = !!fromEnv && /\/\/(localhost|127\.0\.0\.1)/.test(fromEnv);
  if (fromEnv && !(envIsLocal && vercel)) return new URL(fromEnv);
  if (vercel) return new URL(`https://${vercel}`);
  return new URL("http://localhost:3000");
}

// Favicon, apple-icon, dan gambar preview diambil otomatis oleh Next.js dari
// app/icon.png, app/apple-icon.png, app/opengraph-image.png, app/twitter-image.png.
export const metadata: Metadata = {
  metadataBase: siteUrl(),
  title: { default: SITE_TITLE, template: `%s · ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  openGraph: {
    type: "website",
    url: "/",
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    locale: "id_ID",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  // Verifikasi kepemilikan situs di Google Search Console (dibutuhkan untuk verifikasi branding OAuth).
  verification: {
    google: "Ye0OUqw8VM1W9k-GSRe2FGbBH2ZHISPbllfQz7H5M-Y",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
