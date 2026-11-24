import "server-only";
import { parseIsoDuration } from "./format";
import type { LikedTrack } from "./types";

export function getOAuthConfig() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const appUrl = (process.env.APP_URL ?? "http://localhost:3000").replace(/\/$/, "");
  if (!clientId || !clientSecret) return null;
  return { clientId, clientSecret, appUrl, redirectUri: `${appUrl}/api/auth/callback` };
}

export class GoogleApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public reason?: string,
  ) {
    super(message);
  }
}

async function googleFetch<T>(url: string, token: string): Promise<T> {
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (!res.ok) {
    let message = res.statusText;
    let reason: string | undefined;
    try {
      const body = await res.json();
      message = body?.error?.message ?? message;
      reason = body?.error?.errors?.[0]?.reason ?? body?.error?.status;
    } catch {}
    throw new GoogleApiError(res.status, message, reason);
  }
  return res.json() as Promise<T>;
}

/** Nama user dari Google (butuh scope openid + profile). */
export async function getUserName(token: string): Promise<string> {
  try {
    const info = await googleFetch<{ given_name?: string; name?: string }>(
      "https://openidconnect.googleapis.com/v1/userinfo",
      token,
    );
    return info.given_name ?? info.name ?? "";
  } catch {
    return "";
  }
}


type VideosResponse = {
  nextPageToken?: string;
  items: {
    id: string;
    snippet: { title: string; channelTitle: string; categoryId?: string };
    contentDetails?: { duration?: string };
  }[];
};

const MUSIC_CATEGORY = "10";

/**
 * Ambil video yang di-like (YouTube & YouTube Music share daftar like yang sama),
 * lalu saring yang berupa musik.
 *
 * Kuota: videos.list = 1 unit per request, 50 item per halaman.
 */
export async function getLikedMusic(token: string, maxPages = 4): Promise<LikedTrack[]> {
  const tracks: LikedTrack[] = [];
  let pageToken: string | undefined;

  for (let page = 0; page < maxPages; page++) {
    const params = new URLSearchParams({
      part: "snippet,contentDetails",
      myRating: "like",
      maxResults: "50",
    });
    if (pageToken) params.set("pageToken", pageToken);

    const data = await googleFetch<VideosResponse>(
      `https://www.googleapis.com/youtube/v3/videos?${params}`,
      token,
    );

    for (const v of data.items ?? []) {
      const channel = v.snippet.channelTitle ?? "";
      const isTopic = channel.endsWith(" - Topic");
      const isMusic = isTopic || v.snippet.categoryId === MUSIC_CATEGORY;
      if (!isMusic) continue;

      const { title, artist } = splitTitle(v.snippet.title, channel, isTopic);
      tracks.push({
        id: v.id,
        title,
        artist,
        seconds: parseIsoDuration(v.contentDetails?.duration),
      });
    }

    pageToken = data.nextPageToken;
    if (!pageToken) break;
  }

  return tracks;
}

/**
 * Lagu dari channel "Artist - Topic" judulnya sudah bersih.
 * Video musik biasa sering berformat "Artist - Judul (Official Video)".
 */
function splitTitle(rawTitle: string, channel: string, isTopic: boolean) {
  const cleanChannel = channel.replace(/ - Topic$/, "").replace(/VEVO$/i, "").trim();
  if (isTopic) return { title: rawTitle, artist: cleanChannel };

  const noise = /\s*[([](official|lyric|lyrics|music|audio|video|mv|visualizer|hd|4k)[^)\]]*[)\]]/gi;
  const title = rawTitle.replace(noise, "").trim();
  const dash = title.indexOf(" - ");
  if (dash > 0) {
    return { artist: title.slice(0, dash).trim(), title: title.slice(dash + 3).trim() };
  }
  return { title, artist: cleanChannel };
}
