import type { Metadata } from "next";
import Link from "next/link";
import { APP_NAME } from "@/lib/config";
import TakeoutStudio from "./TakeoutStudio";

export const metadata: Metadata = {
  title: `Upload Takeout · ${APP_NAME}`,
};

export default function TakeoutPage() {
  return (
    <main className="container">
      <header className="topbar">
        <Link href="/" className="brand">
          {APP_NAME}
          <span className="brand-dot">.</span>
        </Link>
        <Link href="/" className="back">← Kembali</Link>
      </header>
      <TakeoutStudio />
    </main>
  );
}
