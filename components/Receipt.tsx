import type { Ref } from "react";
import { APP_NAME } from "@/lib/config";
import { formatDateTime, hashString } from "@/lib/format";
import type { ReceiptItem } from "@/lib/types";

type Props = {
  ref?: Ref<HTMLDivElement>;
  heading: string; // "TOP TRACKS", "LIKED SONGS", ...
  periodLabel: string; // "6 BULAN TERAKHIR"
  customer: string;
  items: ReceiptItem[];
  amountHeader: string; // "AMT" / "PLAYS"
  totalLabel: string; // "TOTAL DURASI" / "TOTAL PUTAR"
  totalValue: string;
  date: Date;
};

export default function Receipt({
  ref,
  heading,
  periodLabel,
  customer,
  items,
  amountHeader,
  totalLabel,
  totalValue,
  date,
}: Props) {
  const seed = hashString(`${customer}|${heading}|${periodLabel}|${items.map((i) => i.title).join()}`);
  const orderNo = String(seed % 10000).padStart(4, "0");
  const authCode = String(seed % 1000000).padStart(6, "0");
  const name = customer.trim() || "PENDENGAR";

  return (
    <div ref={ref} className="receipt">
      <div className="receipt-inner">
        <div className="r-center r-title">{APP_NAME}</div>
        <div className="r-center r-sub">{heading}</div>
        <div className="r-center r-sub">{periodLabel}</div>

        <div className="r-meta">
          <div>
            ORDER #{orderNo} UNTUK {name.toUpperCase()}
          </div>
          <div suppressHydrationWarning>{formatDateTime(date)}</div>
        </div>

        <div className="r-rule" />
        <div className="r-row r-head">
          <span className="r-qty">NO</span>
          <span className="r-item">ITEM</span>
          <span className="r-amt">{amountHeader}</span>
        </div>
        <div className="r-rule" />

        {items.length === 0 ? (
          <div className="r-center r-empty">TIDAK ADA ITEM</div>
        ) : (
          items.map((it, i) => (
            <div className="r-row" key={`${it.title}-${i}`}>
              <span className="r-qty">{String(i + 1).padStart(2, "0")}</span>
              <span className="r-item">
                {it.title}
                {it.artist ? ` - ${it.artist}` : ""}
              </span>
              <span className="r-amt">{it.amount}</span>
            </div>
          ))
        )}

        <div className="r-rule" />
        <div className="r-row">
          <span className="r-item">JUMLAH ITEM:</span>
          <span className="r-amt">{items.length}</span>
        </div>
        <div className="r-row r-total">
          <span className="r-item">{totalLabel}:</span>
          <span className="r-amt">{totalValue}</span>
        </div>
        <div className="r-rule" />

        <div className="r-meta">
          <div>CARD #: **** **** **** {date.getFullYear()}</div>
          <div>AUTH CODE: {authCode}</div>
          <div>CARDHOLDER: {name.toUpperCase()}</div>
        </div>

        <div className="r-center r-thanks">TERIMA KASIH SUDAH MENDENGARKAN!</div>
        <Barcode seed={seed} />
        <div className="r-center r-small">music.youtube.com</div>
      </div>
    </div>
  );
}

function Barcode({ seed }: { seed: number }) {
  // Pola garis deterministik dari seed (cuma hiasan, bukan barcode asli).
  const bars: number[] = [];
  let x = seed || 1;
  for (let i = 0; i < 48; i++) {
    x = (Math.imul(x, 1103515245) + 12345) >>> 0;
    bars.push(1 + (x % 3));
  }
  return (
    <div className="r-barcode" aria-hidden>
      {bars.map((w, i) => (
        <span key={i} style={{ width: w, background: i % 2 ? "transparent" : "#111" }} />
      ))}
    </div>
  );
}
