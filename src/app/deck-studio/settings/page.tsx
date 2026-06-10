import Link from "next/link";
import {
  ChevronRight,
  Cloud,
  HelpCircle,
  Info,
  Lock,
  Mail,
  MonitorSmartphone,
  Settings,
  UserRound,
} from "lucide-react";
import type { ReactNode } from "react";

const settingsGroups = [
  {
    title: "Account",
    items: [
      {
        icon: <UserRound className="h-4 w-4" />,
        label: "Account Login",
        value: "Coming soon",
      },
      {
        icon: <Cloud className="h-4 w-4" />,
        label: "Cloud Sync",
        value: "Ready",
      },
      {
        icon: <MonitorSmartphone className="h-4 w-4" />,
        label: "Connected Device",
        value: "PhoneDeck",
      },
    ],
  },
  {
    title: "Studio",
    items: [
      {
        icon: <Settings className="h-4 w-4" />,
        label: "Deck Preferences",
        value: "Default",
      },
      {
        icon: <Info className="h-4 w-4" />,
        label: "About PhoneDeck",
        value: "v0.1.0",
      },
    ],
  },
  {
    title: "Support",
    items: [
      {
        icon: <HelpCircle className="h-4 w-4" />,
        label: "Help & Feedback",
        value: "Share feedback",
      },
      {
        icon: <Mail className="h-4 w-4" />,
        label: "Contact",
        value: "Support",
      },
      {
        icon: <Lock className="h-4 w-4" />,
        label: "Privacy",
        value: "Policy",
      },
    ],
  },
];

export default function DeckStudioSettingsPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between border-b border-white/15 px-6">
        <Link href="/" className="font-bold tracking-wide">
          PHONEDECK
        </Link>
      </nav>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="mb-8 flex items-center gap-3">
          <div className="h-2 w-2 rounded-full bg-green-400" />
          <span className="text-[11px] uppercase tracking-[0.3em] text-white/50">
            Deck Studio
          </span>
        </div>

        <h1 className="max-w-4xl text-[52px] font-bold uppercase leading-[0.92] tracking-[-0.04em] md:text-[76px]">
          Settings
        </h1>

        <p className="mt-8 max-w-2xl text-lg font-light leading-8 text-white/65">
          Manage account, sync, privacy, feedback, and support preferences.
          These controls are UI-only until the account logic is connected.
        </p>
      </section>

      <section className="border-y border-white/7 bg-black px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.3em] text-[#4DA3FF]">
            Preferences
          </p>

          <div className="space-y-10">
            {settingsGroups.map((group) => (
              <section key={group.title}>
                <h2 className="mb-4 text-2xl font-bold tracking-[-0.03em]">
                  {group.title}
                </h2>

                <div className="divide-y divide-white/10 border-y border-white/10">
                  {group.items.map((item) => (
                    <SettingsItem
                      key={item.label}
                      icon={item.icon}
                      label={item.label}
                      value={item.value}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function SettingsItem({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <button
      type="button"
      className="flex w-full items-center gap-5 py-6 text-left transition hover:bg-white/[0.035]"
    >
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-white/55">
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-lg font-bold text-white/85">{label}</span>
      </span>
      <span className="hidden text-sm text-white/40 sm:block">{value}</span>
      <ChevronRight className="h-4 w-4 text-white/25" />
    </button>
  );
}
