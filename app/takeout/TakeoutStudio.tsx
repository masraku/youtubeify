"use client";

import { useMemo, useRef, useState } from "react";
import DownloadButton from "@/components/DownloadButton";
import Receipt from "@/components/Receipt";
import Segmented from "@/components/Segmented";
import { formatDate } from "@/lib/format";
import {
  PERIOD_LABEL,
  parseWatchHistory,
  readTakeoutFile,
  summarize,
  TakeoutError,
  type Metric,
  type Period,
  type Play,
} from "@/lib/takeout";
import Tutorial from "./Tutorial";

const COUNTS = [10, 20, 30, 50] as const;

export default function TakeoutStudio() {
  const [plays, setPlays] = useState<Play[] | null>(null);
  const [source, setSource] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [over, setOver] = useState(false);

  const [period, setPeriod] = useState<Period>("6m");
  const [metric, setMetric] = useState<Metric>("tracks");
  const [count, setCount] = useState<number>(10);
  const [name, setName] = useState("");
  const [date] = useState(() => new Date());

  const inputRef = useRef<HTMLInputElement>(null);
  const receiptRef = useRef<HTMLDivElement>(null);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      const result = await readTakeoutFile(file);
      setPlays(result);
      setSource(file.name);
    } catch (err) {
      setError(err instanceof TakeoutError ? err.message : `Gagal membaca file: ${(err as Error).message}`);
    } finally {
      setLoading(false);
    }
  }

  async function loadSample() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/sample-watch-history.json");
      setPlays(parseWatchHistory(await res.json()));
      setSource("data contoh");
      setName((n) => n || "Contoh");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  const summary = useMemo(
    () => (plays ? summarize(plays, period, metric, count) : null),
    [plays, period, metric, count],
  );

  // ---------- Tahap 1: upload ----------
  if (!plays || !summary) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 720 }}>
        <div className="panel" style={{ position: "static" }}>
          <h1>Upload Google Takeout</h1>
          <p>
            File diproses langsung di browser kamu. Tidak ada yang dikirim ke server.
          </p>
        </div>

        <div
          className={over ? "dropzone over" : "dropzone"}
          role="button"
          tabIndex={0}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setOver(true);
          }}
          onDragLeave={() => setOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setOver(false);
            handleFile(e.dataTransfer.files?.[0]);
          }}
        >
          <strong>{loading ? "Membaca file…" : "Tarik file ke sini atau klik untuk memilih"}</strong>
          <span>File .zip dari Takeout atau watch-history.json</span>
          <input
            ref={inputRef}
            type="file"
            accept=".zip,.json,application/zip,application/json"
            hidden
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
        </div>

        {error && <div className="notice error">{error}</div>}

        <div className="actions">
          <button className="btn btn-ghost" onClick={loadSample} disabled={loading}>
            Coba pakai data contoh
          </button>
        </div>

        <Tutorial open />
      </div>
    );
  }

  // ---------- Tahap 2: atur & download ----------
  const heading = metric === "tracks" ? "TOP TRACKS" : "TOP ARTISTS";

  return (
    <div className="studio">
      <aside className="panel">
        <h1>Struk kamu siap</h1>
        <p>
          {plays.length.toLocaleString("id-ID")} pemutaran YouTube Music dari {source}.<br />
          Periode ini: {formatDate(summary.from)} – {formatDate(summary.to)} (
          {summary.totalPlays.toLocaleString("id-ID")} putar).
        </p>

        <Segmented
          label="Isi struk"
          value={metric}
          options={[
            { value: "tracks", label: "Top Tracks" },
            { value: "artists", label: "Top Artists" },
          ]}
          onChange={setMetric}
        />
        <Segmented
          label="Periode"
          value={period}
          options={[
            { value: "4w", label: "4 minggu" },
            { value: "6m", label: "6 bulan" },
            { value: "1y", label: "1 tahun" },
            { value: "all", label: "Semua" },
          ]}
          onChange={setPeriod}
        />
        <Segmented
          label="Jumlah item"
          value={count}
          options={COUNTS.map((c) => ({ value: c, label: String(c) }))}
          onChange={setCount}
        />
        <label className="control">
          <span className="control-label">Nama di struk</span>
          <input
            className="input"
            value={name}
            maxLength={24}
            placeholder="Nama kamu"
            onChange={(e) => setName(e.target.value)}
          />
        </label>

        <div className="actions">
          <DownloadButton targetRef={receiptRef} filename={`struk-${metric}-${period}`} />
          <button
            className="btn"
            onClick={() => {
              setPlays(null);
              setError(null);
            }}
          >
            Ganti file
          </button>
        </div>
      </aside>

      <div className="receipt-stage">
        <Receipt
          ref={receiptRef}
          heading={heading}
          periodLabel={PERIOD_LABEL[period]}
          customer={name}
          items={summary.items}
          amountHeader="PLAYS"
          totalLabel="TOTAL PUTAR"
          totalValue={`${summary.shownPlays}x`}
          date={date}
        />
      </div>
    </div>
  );
}
