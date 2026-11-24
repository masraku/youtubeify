// Membuat public/sample-watch-history.json berisi data fiktif dengan format Takeout.
// Jalankan: node scripts/make-sample.mjs
import { writeFileSync } from "node:fs";

const songs = [
  ["Lampu Kota", "Senja Rupa"],
  ["Pulang Lebih Awal", "Senja Rupa"],
  ["Hujan di Kelapa Gading", "Arunika"],
  ["Kopi Tanpa Gula", "Arunika"],
  ["Laju", "Nada Timur"],
  ["Sampai Jumpa di Stasiun", "Nada Timur"],
  ["Neon Tengah Malam", "Kilau"],
  ["Sinyal Lemah", "Kilau"],
  ["Rumah Kedua", "Pelita Band"],
  ["Jalan Pulang", "Pelita Band"],
  ["Bulan di Atap", "Sekar Malam"],
  ["Angin Utara", "Semesta Kecil"],
  ["Halte Terakhir", "Semesta Kecil"],
  ["Gerimis Pagi", "Teduh"],
  ["Cerita Lama", "Teduh"],
  ["Langit Jingga", "Biru Laut"],
];

let seed = 42;
const rand = () => ((seed = (seed * 1103515245 + 12345) % 2 ** 31) / 2 ** 31);

const now = Date.UTC(2026, 10, 20, 12);
const DAY = 86400000;
const out = [];

for (let i = 0; i < 1800; i++) {
  // lagu dengan indeks kecil lebih sering diputar; lagu belakang lebih baru populer
  const recent = rand() < 0.35;
  const idx = recent
    ? songs.length - 1 - Math.floor(rand() ** 2 * 6)
    : Math.floor(rand() ** 1.8 * songs.length);
  const [title, artist] = songs[idx];
  const daysAgo = recent ? rand() * 30 : rand() * 420;
  out.push({
    header: "YouTube Music",
    title: `Watched ${title}`,
    titleUrl: `https://music.youtube.com/watch?v=sample${String(idx).padStart(5, "0")}`,
    subtitles: [{ name: `${artist} - Topic`, url: "https://www.youtube.com/channel/sample" }],
    time: new Date(now - daysAgo * DAY).toISOString(),
    products: ["YouTube"],
    activityControls: ["YouTube watch history"],
  });
}

// entri non-musik & iklan, harus diabaikan parser
out.push(
  {
    header: "YouTube",
    title: "Watched Tutorial Next.js 16 dari Nol",
    titleUrl: "https://www.youtube.com/watch?v=notmusic001",
    subtitles: [{ name: "Kanal Ngoding" }],
    time: new Date(now - 2 * DAY).toISOString(),
    products: ["YouTube"],
  },
  {
    header: "YouTube Music",
    title: "Watched Iklan Minuman",
    titleUrl: "https://music.youtube.com/watch?v=ad000000001",
    time: new Date(now - 3 * DAY).toISOString(),
    details: [{ name: "From Google Ads" }],
    products: ["YouTube"],
  },
);

out.sort((a, b) => b.time.localeCompare(a.time));
writeFileSync(new URL("../public/sample-watch-history.json", import.meta.url), JSON.stringify(out));
console.log(`Wrote ${out.length} entries`);
