import type { Metadata } from "next";
import Link from "next/link";
import BrandLink from "@/components/BrandLink";
import TakeoutStudio from "./TakeoutStudio";

export const metadata: Metadata = {
  title: "Upload Takeout",
};

export default function TakeoutPage() {
  return (
    <main className="container">
      <header className="topbar">
        <BrandLink />
        <Link href="/" className="back">← Kembali</Link>
      </header>
      <TakeoutStudio />
    </main>
  );
}
