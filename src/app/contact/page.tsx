"use client";

import { useState } from "react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black px-6 text-white">
        <div className="max-w-lg text-center">
          <div className="mb-6 text-5xl">✉️</div>

          <h1 className="text-4xl font-bold">Message Sent</h1>

          <p className="mt-5 text-lg text-white/60">
            Thanks for contacting PhoneDeck. We will get back to you soon.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-3xl px-6 py-24">
        <p className="mb-4 text-sm font-semibold tracking-[0.3em] text-blue-400">
          CONTACT
        </p>

        <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
          Get in touch.
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-8 text-white/60">
          Have a question, partnership idea, feedback, or need help with
          PhoneDeck? Send us a message.
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSubmitted(true);
          }}
          className="mt-14 space-y-6"
        >
          <div>
            <label className="mb-2 block text-sm text-white/60">
              Your Name
            </label>

            <input
              type="text"
              required
              placeholder="Your name"
              className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 outline-none transition focus:border-blue-400"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-white/60">
              Your Email
            </label>

            <input
              type="email"
              required
              placeholder="you@example.com"
              className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 outline-none transition focus:border-blue-400"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-white/60">
              Message
            </label>

            <textarea
              required
              rows={8}
              placeholder="Write your message..."
              className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 outline-none transition focus:border-blue-400"
            />
          </div>

          <button
            type="submit"
            className="rounded-2xl bg-white px-8 py-4 font-medium text-black transition hover:opacity-90"
          >
            Send Message
          </button>
        </form>
      </div>
    </main>
  );
}