import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { APP_NAME, TOKEN_COOKIE } from "@/lib/config";
import { getLikedMusic, getUserName, GoogleApiError } from "@/lib/google";
import LikedStudio from "./LikedStudio";

export const dynamic = "force-dynamic";

export default async function LikedPage() {
  const token = (await cookies()).get(TOKEN_COOKIE)?.value;
  if (!token) redirect("/api/auth/login");

  let errorMessage: string;

  try {
    const [name, tracks] = await Promise.all([getUserName(token), getLikedMusic(token)]);
    return (
      <Shell>
        <LikedStudio tracks={tracks} initialName={name} />
      </Shell>
    );
  } catch (err) {
    if (err instanceof GoogleApiError && err.status === 401) {
      // token kedaluwarsa -> login ulang
      redirect("/api/auth/login");
    }
    errorMessage = describeError(err);
  }

  return (
    <Shell>
      <div className="notice error" style={{ maxWidth: 640 }}>
        <strong>Gagal mengambil data dari YouTube.</strong>
        <br />
        {errorMessage}
      </div>
    </Shell>
  );
}

function describeError(err: unknown): string {
  if (err instanceof GoogleApiError) {
    if (err.reason === "accessNotConfigured" || /has not been used|is disabled/i.test(err.message)) {
      return "YouTube Data API v3 belum diaktifkan di project Google Cloud kamu. Aktifkan dulu di APIs & Services → Library.";
    }
    if (err.reason === "quotaExceeded") {
      return "Kuota harian YouTube Data API sudah habis. Coba lagi besok (reset tengah malam waktu Pasifik).";
    }
    if (err.status === 403) {
      return `Akses ditolak oleh Google (${err.reason ?? err.message}). Pastikan izin YouTube dicentang waktu login.`;
    }
    return `${err.status}: ${err.message}`;
  }
  return err instanceof Error ? err.message : String(err);
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="container">
      <header className="topbar">
        <Link href="/" className="brand">
          {APP_NAME}
          <span className="brand-dot">.</span>
        </Link>
        <form action="/api/auth/logout" method="post">
          <button className="btn btn-ghost" type="submit">Logout</button>
        </form>
      </header>
      {children}
    </main>
  );
}
