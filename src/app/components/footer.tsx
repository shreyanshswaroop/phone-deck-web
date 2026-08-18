import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-black/10 bg-[#f7f7f8]">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-5 px-6 py-9 text-sm text-[#77777f] md:flex-row">
        <div className="flex items-center gap-4">
          <span className="font-semibold text-[#1d1d1f]">
            pocketdeck
          </span>

          <span>© 2026</span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6">

         <Link className="transition-colors hover:text-[#1d1d1f]" href="/contact">Contact</Link>

         <Link className="transition-colors hover:text-[#1d1d1f]" href="/request-feature">Request Feature</Link>

          <Link className="transition-colors hover:text-[#1d1d1f]" href="/report-bug">Report Bug</Link>

          <Link className="transition-colors hover:text-[#1d1d1f]" href="/privacy">Privacy</Link>
        </div>
      </div>
    </footer>
  );
}
