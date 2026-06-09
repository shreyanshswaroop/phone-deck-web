import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 py-8 text-sm text-white/40 md:flex-row">
        <div className="flex items-center gap-4">
          <span className="font-semibold text-white/70">
            PhoneDeck
          </span>

          <span>© 2026</span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6">

         <Link href="/contact">Contact</Link>

         <Link href="/request-feature">Request Feature</Link>

          <Link href="/report-bug">Report Bug</Link>

          <Link href="/privacy">Privacy</Link>
        </div>
      </div>
    </footer>
  );
}