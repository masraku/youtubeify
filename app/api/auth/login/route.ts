import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { GOOGLE_SCOPES, STATE_COOKIE } from "@/lib/config";
import { getOAuthConfig } from "@/lib/google";

export async function GET() {
  const cfg = getOAuthConfig();
  if (!cfg) {
    return NextResponse.redirect(new URL("/?error=config", process.env.APP_URL ?? "http://localhost:3000"));
  }

  // state acak untuk mencegah CSRF, dicek lagi di /api/auth/callback
  const state = randomBytes(24).toString("base64url");

  const params = new URLSearchParams({
    client_id: cfg.clientId,
    redirect_uri: cfg.redirectUri,
    response_type: "code",
    scope: GOOGLE_SCOPES.join(" "),
    access_type: "online", // tidak butuh refresh token; struk dibuat dalam satu sesi
    include_granted_scopes: "true",
    prompt: "select_account",
    state,
  });

  const res = NextResponse.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`);
  res.cookies.set(STATE_COOKIE, state, {
    httpOnly: true,
    secure: cfg.appUrl.startsWith("https://"),
    sameSite: "lax",
    path: "/",
    maxAge: 600,
  });
  return res;
}
