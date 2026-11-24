"use client";

import { toPng } from "html-to-image";
import { useState, type RefObject } from "react";

export default function DownloadButton({
  targetRef,
  filename,
}: {
  targetRef: RefObject<HTMLDivElement | null>;
  filename: string;
}) {
  const [busy, setBusy] = useState(false);

  async function handleClick() {
    if (!targetRef.current) return;
    setBusy(true);
    try {
      const dataUrl = await toPng(targetRef.current, {
        pixelRatio: 3,
        cacheBust: true,
        backgroundColor: "#f2efe9", // warna latar biar tepi bergerigi kelihatan
      });
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `${filename}.png`;
      a.click();
    } catch (err) {
      console.error("Gagal membuat gambar:", err);
    } finally {
      setBusy(false);
    }
  }

  return (
    <button className="btn btn-primary" onClick={handleClick} disabled={busy}>
      {busy ? "Menyiapkan gambar…" : "Download Gambar"}
    </button>
  );
}
