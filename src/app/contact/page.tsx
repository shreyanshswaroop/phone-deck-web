"use client";

import { useState, type ReactNode } from "react";
import { CheckCircle2, Mail, Send } from "lucide-react";
import Footer from "@/app/components/footer";
import SecondaryNav from "@/app/components/SecondaryNav";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f7f7f8] text-[#1f1f23]">
      <SecondaryNav />

      <section className="mx-auto grid max-w-5xl gap-10 px-5 pb-20 pt-14 sm:pt-20 lg:grid-cols-[0.8fr_1fr] lg:items-start">
        <div>
          <div className="flex h-14 w-14 items-center justify-center rounded-[18px] bg-[#eaf4ff] text-[#0676f8]">
            <Mail className="h-7 w-7" />
          </div>
          <p className="mt-8 text-[13px] font-semibold uppercase tracking-[0.36em] text-[#0a7af5]">
            Contact
          </p>
          <h1 className="mt-5 max-w-2xl text-[44px] font-semibold leading-[1.04] tracking-normal sm:text-[64px]">
            Get in touch.
          </h1>
          <p className="mt-6 max-w-xl text-[19px] leading-[1.6] text-[#5d5d64]">
            Have a question, partnership idea, feedback, or need help with
            PocketDeck? Send us a message.
          </p>
        </div>

        <div className="rounded-[30px] bg-white p-6 shadow-[0_20px_60px_rgba(0,0,0,0.08)] ring-1 ring-black/5 sm:p-8">
          {submitted ? (
            <div className="py-14 text-center">
              <CheckCircle2 className="mx-auto h-12 w-12 text-[#0a7af5]" />
              <h2 className="mt-6 text-[32px] font-semibold tracking-normal">
                Message sent.
              </h2>
              <p className="mx-auto mt-4 max-w-md text-[17px] leading-7 text-[#5d5d64]">
                Thanks for contacting PocketDeck. We will get back to you soon.
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
              <Field label="Your Name">
                <input
                  type="text"
                  required
                  placeholder="Your name"
                  className="field-input"
                />
              </Field>

              <Field label="Your Email">
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  className="field-input"
                />
              </Field>

              <Field label="Message">
                <textarea
                  required
                  rows={7}
                  placeholder="Write your message..."
                  className="field-input resize-none"
                />
              </Field>

              <button
                type="submit"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#1d1d1f] px-7 text-[16px] font-medium text-white shadow-[0_10px_22px_rgba(0,0,0,0.16)] transition hover:-translate-y-0.5 hover:bg-black"
              >
                <Send className="h-4 w-4" />
                Send Message
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
