import { NextResponse, type NextRequest } from "next/server";
import { STATE_COOKIE, TOKEN_COOKIE } from "@/lib/config";
import { getOAuthConfig } from "@/lib/google";

export async function GET(req: NextRequest) {
  const cfg = getOAuthConfig(req);
  const base = cfg.appUrl;
  const fail = (code: string) => {
    const res = NextResponse.redirect(new URL(`/?error=${encodeURIComponent(code)}`, base));
    res.cookies.delete(STATE_COOKIE);
    return res;
  };

  if (!cfg.ok) return fail("config");

  const url = req.nextUrl;
  const error = url.searchParams.get("error");
  if (error) return fail(error);

  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const savedState = req.cookies.get(STATE_COOKIE)?.value;
  if (!code || !state || !savedState || state !== savedState) return fail("state");

  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: cfg.clientId,
      client_secret: cfg.clientSecret,
      redirect_uri: cfg.redirectUri,
      grant_type: "authorization_code",
    }),
  });

  if (!tokenRes.ok) {
    console.error("Token exchange gagal:", await tokenRes.text());
    return fail("token");
  }

  const token = (await tokenRes.json()) as { access_token: string; expires_in: number };

  const res = NextResponse.redirect(new URL("/liked", base));
  res.cookies.delete(STATE_COOKIE);
  // Access token disimpan di cookie httpOnly (tidak bisa dibaca JavaScript di browser)
  // dan otomatis kedaluwarsa bersamaan dengan token-nya (biasanya 1 jam).
  res.cookies.set(TOKEN_COOKIE, token.access_token, {
    httpOnly: true,
    secure: cfg.appUrl.startsWith("https://"),
    sameSite: "lax",
    path: "/",
    maxAge: Math.max(60, (token.expires_in ?? 3600) - 60),
  });
  return res;
}
