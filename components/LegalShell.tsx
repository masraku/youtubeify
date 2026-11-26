import Link from "next/link";
import BrandLink from "@/components/BrandLink";

export default function LegalShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="container">
      <header className="topbar">
        <BrandLink />
        <Link href="/" className="back">← Kembali</Link>
      </header>
      <article className="legal">{children}</article>
      <footer className="site-footer">
        <Link href="/privacy">Kebijakan Privasi</Link>
        <Link href="/terms">Ketentuan Layanan</Link>
      </footer>
    </main>
  );
}
