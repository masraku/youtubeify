import { NextResponse, type NextRequest } from "next/server";
import { TOKEN_COOKIE } from "@/lib/config";

// POST supaya logout tidak bisa dipicu lewat link/gambar dari situs lain.
export async function POST(req: NextRequest) {
  const token = req.cookies.get(TOKEN_COOKIE)?.value;

  // Cabut izin di sisi Google juga, biar akses benar-benar berhenti.
  if (token) {
    await fetch(`https://oauth2.googleapis.com/revoke?token=${encodeURIComponent(token)}`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    }).catch(() => {});
  }

  const res = NextResponse.redirect(new URL("/", req.url), 303);
  res.cookies.delete(TOKEN_COOKIE);
  return res;
}
