/**
 * Parser untuk watch-history.json dari Google Takeout.
 *
 * Contoh satu entri (bahasa akun Inggris):
 * {
 *   "header": "YouTube Music",
 *   "title": "Watched Hati-Hati di Jalan",
 *   "titleUrl": "https://music.youtube.com/watch?v=xxxxxxxxxxx",
 *   "subtitles": [{ "name": "Tulus - Topic", "url": "https://www.youtube.com/channel/..." }],
 *   "time": "2026-11-20T08:15:30.123Z",
 *   "products": ["YouTube"],
 *   "activityControls": ["YouTube watch history"]
 * }
 *
 * Awalan judul ("Watched ", "Menonton ", dst.) mengikuti bahasa akun Google,
 * jadi awalan itu dideteksi otomatis, bukan di-hardcode.
 */

import type { ReceiptItem } from "./types";

export type Play = {
  key: string; // judul+artis yang dinormalisasi, untuk pengelompokan
  title: string;
  artist: string;
  time: number; // epoch ms
};

type RawEntry = {
  header?: string;
  title?: string;
  titleUrl?: string;
  subtitles?: { name?: string }[];
  time?: string;
  details?: { name?: string }[];
};

export class TakeoutError extends Error {}

const KNOWN_PREFIXES = /^(watched|menonton|ditonton|telah menonton|sudah menonton)\s+/i;

function isMusicEntry(e: RawEntry): boolean {
  if (!e.titleUrl || !e.time || !e.title) return false;
  if (e.details?.some((d) => /ads/i.test(d.name ?? ""))) return false; // iklan
  return e.header === "YouTube Music" || e.titleUrl.includes("music.youtube.com");
}

/** Cari awalan bersama (mis. "Watched ") dari semua judul, dipotong di spasi terakhir. */
function detectPrefix(allTitles: string[]): string {
  // Pakai judul unik dari SEMUA entri (termasuk video YouTube biasa) supaya variasinya banyak.
  // Kalau judul unik terlalu sedikit, awalan bisa salah tebak (mis. "Watched Lampu "), jadi fallback.
  const unique = [...new Set(allTitles)];
  if (unique.length < 5) return "";
  const sample = unique.length > 2000 ? unique.filter((_, i) => i % Math.ceil(unique.length / 2000) === 0) : unique;
  let prefix = sample[0];
  for (const t of sample) {
    let i = 0;
    while (i < prefix.length && i < t.length && prefix[i] === t[i]) i++;
    prefix = prefix.slice(0, i);
    if (!prefix) return "";
  }
  const lastSpace = prefix.lastIndexOf(" ");
  return lastSpace > 0 ? prefix.slice(0, lastSpace + 1) : "";
}

function normalize(s: string): string {
  return s.toLowerCase().replace(/\s+/g, " ").trim();
}

/** Ubah isi watch-history.json (sudah di-JSON.parse) jadi daftar pemutaran YouTube Music. */
export function parseWatchHistory(raw: unknown): Play[] {
  if (!Array.isArray(raw)) {
    throw new TakeoutError("Format file tidak dikenali. Pastikan kamu memilih format JSON (bukan HTML) waktu ekspor.");
  }

  const entries = (raw as RawEntry[]).filter(isMusicEntry);
  if (entries.length === 0) {
    throw new TakeoutError(
      "Tidak ada riwayat YouTube Music di file ini. Pastikan riwayat tontonan aktif dan kamu ekspor akun yang benar.",
    );
  }

  const prefix = detectPrefix(
    (raw as RawEntry[]).filter((e) => e.titleUrl && typeof e.title === "string").map((e) => e.title!),
  );

  return entries.map((e) => {
    let title = e.title!;
    if (prefix && title.startsWith(prefix)) title = title.slice(prefix.length);
    else title = title.replace(KNOWN_PREFIXES, "");

    const artist = (e.subtitles?.[0]?.name ?? "Unknown").replace(/ - Topic$/, "").trim();

    return {
      key: `${normalize(title)}|${normalize(artist)}`,
      title: title.trim(),
      artist,
      time: Date.parse(e.time!),
    };
  });
}

/**
 * Terima .json atau .zip hasil Takeout.
 * Untuk .zip, cari watch-history.json di dalamnya (nama folder bisa beda tergantung bahasa).
 */
export async function readTakeoutFile(file: File): Promise<Play[]> {
  const name = file.name.toLowerCase();

  if (name.endsWith(".html")) {
    throw new TakeoutError("Ini file HTML. Ulangi ekspor dan ubah format riwayat ke JSON (lihat langkah 4 di tutorial).");
  }

  if (name.endsWith(".json")) {
    return parseWatchHistory(JSON.parse(await file.text()));
  }

  if (name.endsWith(".zip")) {
    const { default: JSZip } = await import("jszip");
    const zip = await JSZip.loadAsync(file);
    const jsonFiles = Object.values(zip.files).filter((f) => !f.dir && f.name.toLowerCase().endsWith(".json"));

    // Prioritaskan nama yang paling mungkin, lalu coba file JSON lain di folder YouTube.
    const score = (p: string) => {
      const s = p.toLowerCase();
      if (s.endsWith("watch-history.json")) return 0;
      if (/watch|tonton/.test(s)) return 1;
      if (s.includes("youtube")) return 2;
      return 3;
    };
    const candidates = jsonFiles.filter((f) => score(f.name) < 3).sort((a, b) => score(a.name) - score(b.name));

    for (const f of candidates) {
      try {
        return parseWatchHistory(JSON.parse(await f.async("string")));
      } catch {
        // bukan file riwayat, coba kandidat berikutnya
      }
    }

    const hasHtml = Object.keys(zip.files).some((p) => /watch-history\.html$/i.test(p));
    throw new TakeoutError(
      hasHtml
        ? "Zip ini berisi watch-history.html, bukan JSON. Ulangi ekspor dan ubah format riwayat ke JSON."
        : "Tidak menemukan watch-history.json di dalam zip. Pastikan bagian \"riwayat\" YouTube ikut diekspor.",
    );
  }

  throw new TakeoutError("Upload file .zip dari Takeout atau file watch-history.json.");
}

// ---------------------------------------------------------------------------

export type Period = "4w" | "6m" | "1y" | "all";
export type Metric = "tracks" | "artists";

export const PERIOD_LABEL: Record<Period, string> = {
  "4w": "4 MINGGU TERAKHIR",
  "6m": "6 BULAN TERAKHIR",
  "1y": "1 TAHUN TERAKHIR",
  all: "SEPANJANG WAKTU",
};

const DAY = 24 * 60 * 60 * 1000;
const PERIOD_MS: Record<Exclude<Period, "all">, number> = {
  "4w": 28 * DAY,
  "6m": 182 * DAY,
  "1y": 365 * DAY,
};

export type Summary = {
  items: ReceiptItem[];
  totalPlays: number; // total putar di periode itu (semua lagu)
  shownPlays: number; // total putar item yang tampil di struk
  from: Date;
  to: Date;
};

/**
 * Hitung top tracks / top artists.
 * Periode dihitung mundur dari pemutaran terakhir di file (bukan dari hari ini),
 * supaya hasilnya tetap masuk akal walau file Takeout-nya sudah agak lama.
 */
export function summarize(plays: Play[], period: Period, metric: Metric, limit: number): Summary {
  const latest = plays.reduce((m, p) => Math.max(m, p.time), 0);
  const cutoff = period === "all" ? -Infinity : latest - PERIOD_MS[period];
  const inRange = plays.filter((p) => p.time >= cutoff);

  const groups = new Map<string, { title: string; artist: string; count: number; last: number }>();
  for (const p of inRange) {
    const key = metric === "tracks" ? p.key : normalize(p.artist);
    const g = groups.get(key);
    if (g) {
      g.count++;
      if (p.time > g.last) {
        g.last = p.time;
        g.title = p.title;
        g.artist = p.artist;
      }
    } else {
      groups.set(key, { title: p.title, artist: p.artist, count: 1, last: p.time });
    }
  }

  const top = [...groups.values()]
    .sort((a, b) => b.count - a.count || b.last - a.last)
    .slice(0, limit);

  const earliest = inRange.reduce((m, p) => Math.min(m, p.time), Infinity);

  return {
    items: top.map((g) =>
      metric === "tracks"
        ? { title: g.title, artist: g.artist, amount: `${g.count}x` }
        : { title: g.artist, amount: `${g.count}x` },
    ),
    totalPlays: inRange.length,
    shownPlays: top.reduce((s, g) => s + g.count, 0),
    from: new Date(Number.isFinite(earliest) ? earliest : latest),
    to: new Date(latest),
  };
}
