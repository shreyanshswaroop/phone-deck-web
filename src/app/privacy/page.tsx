import { LockKeyhole, ShieldCheck } from "lucide-react";
import Footer from "@/app/components/footer";
import SecondaryNav from "@/app/components/SecondaryNav";

const privacySections = [
  {
    title: "Information We Collect",
    body: "PocketDeck may collect basic account information, device identifiers, diagnostic logs, and connection metadata required to establish communication between your phone and Mac.",
  },
  {
    title: "How We Use Information",
    body: "Information is used solely to provide core functionality, troubleshoot issues, improve performance, and maintain security.",
  },
  {
    title: "Data Security",
    body: "Connections between your devices are encrypted whenever possible. We take reasonable measures to protect information against unauthorized access, disclosure, or misuse.",
  },
  {
    title: "Third-Party Services",
    body: "PocketDeck may rely on third-party infrastructure providers for hosting and connectivity. These providers only receive the data necessary to operate the service.",
  },
  {
    title: "Your Rights",
    body: "You may request deletion of your account and associated data at any time by contacting us.",
  },
  {
    title: "Contact",
    body: "For privacy-related questions, please contact the PocketDeck team.",
  },
] as const;

export default function PrivacyPage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f7f7f8] text-[#1f1f23]">
      <SecondaryNav />

      <section className="mx-auto max-w-5xl px-5 pb-16 pt-14 text-center sm:pt-20">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[22px] bg-[#eaf4ff] text-[#0676f8]">
          <LockKeyhole className="h-8 w-8" />
        </div>
        <p className="mt-8 text-[13px] font-semibold uppercase tracking-[0.36em] text-[#0a7af5]">
          Privacy Policy
        </p>
        <h1 className="mx-auto mt-5 max-w-4xl text-[48px] font-semibold leading-[1.02] tracking-normal sm:text-[72px]">
          Your data stays yours.
        </h1>
        <p className="mx-auto mt-7 max-w-2xl text-[19px] leading-[1.6] text-[#5d5d64] sm:text-[21px]">
          PocketDeck is designed with privacy first. We collect only the
          information necessary to provide the service and never sell your data.
        </p>
      </section>

      <section className="mx-auto max-w-5xl px-5 pb-20">
        <div className="grid gap-5 md:grid-cols-2">
          {privacySections.map((section) => (
            <article
              key={section.title}
              className="rounded-[26px] bg-white p-7 shadow-[0_18px_50px_rgba(0,0,0,0.07)] ring-1 ring-black/5"
            >
              <ShieldCheck className="h-6 w-6 text-[#0a7af5]" />
              <h2 className="mt-5 text-[24px] font-semibold tracking-normal">
                {section.title}
              </h2>
              <p className="mt-4 text-[16px] leading-7 text-[#5d5d64]">
                {section.body}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-10 rounded-[24px] bg-white px-6 py-5 text-[15px] text-[#77777f] shadow-[0_14px_38px_rgba(0,0,0,0.06)] ring-1 ring-black/5">
          Last updated: June 2026
        </div>
      </section>

      <Footer />
    </main>
  );
}
