import Image from "next/image";
import Link from "next/link";
import { SITE_NAME } from "@/lib/config";

/** Logo di header, mengarah ke beranda. Gambar ada di public/logo.png. */
export default function BrandLink() {
  return (
    <Link href="/" className="brand" aria-label={`${SITE_NAME} — beranda`}>
      <Image src="/logo.png" alt={SITE_NAME} width={600} height={291} className="brand-logo" priority />
    </Link>
  );
}
