export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-4xl px-6 py-24">
        <p className="mb-4 text-sm font-semibold tracking-[0.3em] text-blue-400">
          PRIVACY POLICY
        </p>

        <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
          Your data stays yours.
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-8 text-white/60">
          PhoneDeck is designed with privacy first. We collect only the
          information necessary to provide the service and never sell your data.
        </p>

        <div className="mt-16 space-y-12">
          <section>
            <h2 className="mb-4 text-2xl font-semibold">
              Information We Collect
            </h2>

            <p className="leading-8 text-white/60">
              PhoneDeck may collect basic account information, device
              identifiers, diagnostic logs and connection metadata required to
              establish communication between your phone and Mac.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">
              How We Use Information
            </h2>

            <p className="leading-8 text-white/60">
              Information is used solely to provide core functionality,
              troubleshoot issues, improve performance and maintain security.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">
              Data Security
            </h2>

            <p className="leading-8 text-white/60">
              Connections between your devices are encrypted whenever possible.
              We take reasonable measures to protect information against
              unauthorized access, disclosure or misuse.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">
              Third-Party Services
            </h2>

            <p className="leading-8 text-white/60">
              PhoneDeck may rely on third-party infrastructure providers for
              hosting and connectivity. These providers only receive the data
              necessary to operate the service.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">
              Your Rights
            </h2>

            <p className="leading-8 text-white/60">
              You may request deletion of your account and associated data at
              any time by contacting us.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">
              Contact
            </h2>

            <p className="leading-8 text-white/60">
              For privacy-related questions, please contact the PhoneDeck team.
            </p>
          </section>
        </div>

        <div className="mt-20 border-t border-white/10 pt-8 text-sm text-white/40">
          Last updated: June 2026
        </div>
      </div>
    </main>
  );
}