"use client";

import { useState } from "react";

export default function ReportBugPage() {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black px-6 text-white">
        <div className="max-w-lg text-center">
          <div className="mb-6 text-5xl">🐞</div>

          <h1 className="text-4xl font-bold">
            Bug Report Received
          </h1>

          <p className="mt-5 text-lg text-white/60">
            Thanks for helping improve PhoneDeck. We will investigate the issue
            and work on a fix as soon as possible.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-3xl px-6 py-24">
        <p className="mb-4 text-sm font-semibold tracking-[0.3em] text-red-400">
          REPORT A BUG
        </p>

        <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
          Found something broken?
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-8 text-white/60">
          Help us improve PhoneDeck by reporting bugs, crashes, connection
          issues, unexpected behavior, or anything that doesn't feel right.
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
              Your Email
            </label>

            <input
              type="email"
              required
              placeholder="you@example.com"
              className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 outline-none transition focus:border-red-400"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-white/60">
              Device
            </label>

            <input
              type="text"
              placeholder="MacBook Pro, Mac Mini, iPhone 17 Pro..."
              className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 outline-none transition focus:border-red-400"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-white/60">
              What happened?
            </label>

            <textarea
              required
              rows={8}
              placeholder="Describe the bug in detail..."
              className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 outline-none transition focus:border-red-400"
            />
          </div>

          <button
            type="submit"
            className="rounded-2xl bg-white px-8 py-4 font-medium text-black transition hover:opacity-90"
          >
            Submit Report
          </button>
        </form>
      </div>
    </main>
  );
}