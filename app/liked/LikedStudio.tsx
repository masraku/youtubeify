"use client";

import { useMemo, useRef, useState } from "react";
import DownloadButton from "@/components/DownloadButton";
import Receipt from "@/components/Receipt";
import Segmented from "@/components/Segmented";
import { formatSeconds } from "@/lib/format";
import type { LikedTrack } from "@/lib/types";

const COUNTS = [10, 20, 30, 50] as const;

export default function LikedStudio({
  tracks,
  initialName,
}: {
  tracks: LikedTrack[];
  initialName: string;
}) {
  const [count, setCount] = useState<number>(10);
  const [name, setName] = useState(initialName);
  const [date] = useState(() => new Date());
  const ref = useRef<HTMLDivElement>(null);

  const shown = useMemo(() => tracks.slice(0, count), [tracks, count]);
  const totalSeconds = shown.reduce((s, t) => s + t.seconds, 0);

  return (
    <div className="studio">
      <aside className="panel">
        <h1>Liked Songs</h1>
        <p>
          {tracks.length > 0
            ? `Ketemu ${tracks.length} lagu yang kamu like. Urutannya dari yang paling baru di-like.`
            : "Belum ada lagu yang di-like di akun ini."}
        </p>

        <Segmented
          label="Jumlah lagu"
          value={count}
          options={COUNTS.map((c) => ({ value: c, label: String(c) }))}
          onChange={setCount}
        />

        <label className="control">
          <span className="control-label">Nama di struk</span>
          <input className="input" value={name} maxLength={24} onChange={(e) => setName(e.target.value)} />
        </label>

        <div className="actions">
          <DownloadButton targetRef={ref} filename={`struk-liked-${count}`} />
        </div>

        <p>
          Mau tahu lagu yang <em>paling sering diputar</em>? Pakai mode{" "}
          <a href="/takeout">Upload Takeout</a>.
        </p>
      </aside>

      <div className="receipt-stage">
        <Receipt
          ref={ref}
          heading="LIKED SONGS"
          periodLabel={`${shown.length} LIKE TERBARU`}
          customer={name}
          items={shown.map((t) => ({ title: t.title, artist: t.artist, amount: formatSeconds(t.seconds) }))}
          amountHeader="AMT"
          totalLabel="TOTAL DURASI"
          totalValue={formatSeconds(totalSeconds)}
          date={date}
        />
      </div>
    </div>
  );
}
