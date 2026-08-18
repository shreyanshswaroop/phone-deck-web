import Link from "next/link";

export default function SecondaryNav() {
  return (
    <header className="relative z-30 bg-[#f7f7f8] px-5 py-4 sm:py-5">
      <nav className="relative mx-auto flex max-w-5xl items-center justify-between gap-6">
        <Link
          href="/"
          className="text-[18px] font-semibold tracking-normal text-[#1f1f23] transition hover:text-black"
        >
          pocketdeck
        </Link>

        <div className="hidden items-center justify-center gap-8 text-[16px] font-medium text-[#686879] md:flex">
          <Link href="/#features" className="transition hover:text-[#1f1f23]">
            Features
          </Link>
          <Link href="/#deck" className="transition hover:text-[#1f1f23]">
            Deck
          </Link>
          <Link href="/#pricing" className="transition hover:text-[#1f1f23]">
            Pricing
          </Link>
          <Link href="/apps" className="transition hover:text-[#1f1f23]">
            Apps
          </Link>
        </div>

        <Link
          href="/download"
          className="inline-flex min-h-10 items-center justify-center rounded-full bg-white px-6 text-[15px] font-semibold text-black shadow-[0_12px_30px_rgba(0,0,0,0.11)] ring-1 ring-black/5 transition hover:-translate-y-0.5 hover:bg-[#fbfbfc]"
        >
          Download
        </Link>
      </nav>
    </header>
  );
}
