import Image from "next/image";
import Link from "next/link";

export default function FinalCTASection() {
  return (
    <section className="relative overflow-hidden border-t border-white/10 bg-black py-36 text-white">
      {/* Background */}
      <div className="absolute inset-0">
        <Image
  src="/icons/phonedeck.png"
  alt=""
  fill
  priority
  className="object-cover opacity-65"
 />
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/80 to-black" />

      {/* Blue Glow */}
      <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/10 blur-[180px]" />

      <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
        <p className="mb-5 text-xs font-semibold tracking-[0.35em] text-blue-400">
          COMING SOON
        </p>

        <h2 className="text-5xl font-bold tracking-tight md:text-7xl">
          GET THE FULL
          <br />
          PHONEDECK EXPERIENCE
        </h2>

        <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-white/55">
          Control media, apps, volume, brightness, trackpad mode and monitor
          your Mac in real time — all from your phone.
        </p>

        <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
         
           <Link
          href="/download"
          className="border border-white bg-white px-8 py-4 text-xs font-bold uppercase tracking-[0.16em] text-black">
            Get PhoneDeck
          </Link>
        </div>
      </div>
    </section>
  );
}
