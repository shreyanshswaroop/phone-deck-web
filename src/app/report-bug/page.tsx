"use client";

import { useState, type ReactNode } from "react";
import { Bug, CheckCircle2, Send } from "lucide-react";
import Footer from "@/app/components/footer";
import SecondaryNav from "@/app/components/SecondaryNav";

export default function ReportBugPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f7f7f8] text-[#1f1f23]">
      <SecondaryNav />

      <section className="mx-auto grid max-w-5xl gap-10 px-5 pb-20 pt-14 sm:pt-20 lg:grid-cols-[0.8fr_1fr] lg:items-start">
        <div>
          <div className="flex h-14 w-14 items-center justify-center rounded-[18px] bg-[#fff0f0] text-[#d93025]">
            <Bug className="h-7 w-7" />
          </div>
          <p className="mt-8 text-[13px] font-semibold uppercase tracking-[0.36em] text-[#d93025]">
            Report A Bug
          </p>
          <h1 className="mt-5 max-w-2xl text-[44px] font-semibold leading-[1.04] tracking-normal sm:text-[64px]">
            Found something broken?
          </h1>
          <p className="mt-6 max-w-xl text-[19px] leading-[1.6] text-[#5d5d64]">
            Help us improve PocketDeck by reporting crashes, connection issues,
            unexpected behavior, or anything that does not feel right.
          </p>
        </div>

        <div className="rounded-[30px] bg-white p-6 shadow-[0_20px_60px_rgba(0,0,0,0.08)] ring-1 ring-black/5 sm:p-8">
          {submitted ? (
            <div className="py-14 text-center">
              <CheckCircle2 className="mx-auto h-12 w-12 text-[#0a7af5]" />
              <h2 className="mt-6 text-[32px] font-semibold tracking-normal">
                Bug report received.
              </h2>
              <p className="mx-auto mt-4 max-w-md text-[17px] leading-7 text-[#5d5d64]">
                Thanks for helping improve PocketDeck. We will investigate the
                issue and work on a fix as soon as possible.
              </p>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSubmitted(true);
              }}
              className="space-y-5"
            >
              <Field label="Your Email">
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  className="field-input"
                />
              </Field>

              <Field label="Device">
                <input
                  type="text"
                  placeholder="MacBook Pro, Mac mini, iPhone..."
                  className="field-input"
                />
              </Field>

              <Field label="What happened?">
                <textarea
                  required
                  rows={7}
                  placeholder="Describe the bug in detail..."
                  className="field-input resize-none"
                />
              </Field>

              <button
                type="submit"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#1d1d1f] px-7 text-[16px] font-medium text-white shadow-[0_10px_22px_rgba(0,0,0,0.16)] transition hover:-translate-y-0.5 hover:bg-black"
              >
                <Send className="h-4 w-4" />
                Submit Report
              </button>
            </form>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-[14px] font-medium text-[#5d5d64]">
        {label}
      </span>
      {children}
    </label>
  );
}
