import { Link } from "react-router-dom";
import { useAuth } from "@/components/auth/auth-context";
import { AuthGate } from "@/components/auth/auth-gate";
import { DashboardShell } from "@/components/ui/dashboard-shell";
import {
  UserCircle,
  Plus,
  MagnifyingGlass,
  ChatCircleDots,
  ArrowRight,
  Drop,
} from "@phosphor-icons/react";
import type { DonorProfile, RequesterProfile } from "@/types";

type Action = {
  href: string;
  icon: typeof UserCircle;
  title: string;
  body: string;
  cta: string;
};

function DonorHome({ donor }: { donor: DonorProfile }) {
  const actions: Action[] = [
    {
      href: "/dashboard/donor",
      icon: UserCircle,
      title: "Your profile",
      body: "Review your details, blood group, and donation status.",
      cta: "View profile",
    },
    {
      href: "/search",
      icon: MagnifyingGlass,
      title: "Find requests",
      body: "See nearby blood requests that match your blood group.",
      cta: "Browse requests",
    },
    {
      href: "/search",
      icon: ChatCircleDots,
      title: "Browse matches",
      body: "See matching blood requests and start a private conversation with the requester.",
      cta: "Find matches",
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
        <div className="rounded-3xl border border-ink-900/10 bg-bone-50 p-8">
          <div className="flex items-center gap-4">
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blood-100 font-display text-2xl font-bold text-blood-600">
              {donor.name.charAt(0)}
            </span>
            <div>
              <h2 className="font-display text-2xl font-semibold tracking-tight text-ink-950">
                {donor.name}
              </h2>
              <span className="mt-1 inline-flex items-center gap-1.5 text-sm font-medium text-ink-600">
                <Drop size={15} weight="fill" className="text-blood-600" />
                {donor.blood_group}
              </span>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 border-t border-ink-900/10 pt-5">
            <StatusPill label="Eligible to donate" active={donor.eligible_status} />
            <StatusPill label="Available to donate" active={donor.available_to_donate} />
          </div>
        </div>

        <div className="rounded-3xl border border-ink-900/10 bg-bone-50 p-8">
          <h3 className="font-display text-lg font-semibold text-ink-950">Your details</h3>
          <div className="mt-5 grid gap-x-8 gap-y-5 sm:grid-cols-2">
            <Detail label="Blood group" value={donor.blood_group} />
            <Detail label="Age" value={String(donor.age)} />
            <Detail label="Gender" value={donor.gender.charAt(0).toUpperCase() + donor.gender.slice(1)} />
            <Detail label="Address" value={donor.address} />
            {donor.weight ? <Detail label="Weight" value={`${donor.weight} kg`} /> : null}
            {donor.health_status ? <Detail label="Health" value={donor.health_status} /> : null}
            {donor.last_donation_date ? (
              <Detail label="Last donation" value={donor.last_donation_date} />
            ) : null}
          </div>
        </div>
      </div>

      <ActionGrid actions={actions} />
    </div>
  );
}

function RequesterHome({ requester }: { requester: RequesterProfile }) {
  const actions: Action[] = [
    {
      href: "/dashboard/requester",
      icon: Plus,
      title: "New blood request",
      body: "Create a request and get matched to eligible donors nearby.",
      cta: "Create request",
    },
    {
      href: "/dashboard/requester",
      icon: ChatCircleDots,
      title: "Active requests",
      body: "Track the status of each request until it's fulfilled.",
      cta: "View requests",
    },
    {
      href: "/search",
      icon: ChatCircleDots,
      title: "Browse matches",
      body: "Review matched donors for each request, then contact them privately.",
      cta: "See matches",
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      <div className="rounded-3xl border border-ink-900/10 bg-bone-50 p-8">
        <div className="flex items-center gap-4">
          <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blood-100 font-display text-2xl font-bold text-blood-600">
            {requester.name.charAt(0)}
          </span>
          <div>
            <h2 className="font-display text-2xl font-semibold tracking-tight text-ink-950">
              {requester.name}
            </h2>
            <p className="text-sm text-ink-500">Requester account</p>
          </div>
        </div>
        <div className="mt-6 grid gap-x-8 gap-y-5 border-t border-ink-900/10 pt-5 sm:grid-cols-2">
          <Detail label="Name" value={requester.name} />
          <Detail label="Address" value={requester.address} />
        </div>
      </div>

      <ActionGrid actions={actions} />
    </div>
  );
}

function ActionGrid({ actions }: { actions: Action[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {actions.map((a) => (
        <Link
          key={a.title}
          to={a.href}
          className="group flex flex-col justify-between gap-6 rounded-3xl border border-ink-900/10 bg-bone-50 p-7 transition-all hover:-translate-y-1 hover:border-blood-500/40 hover:shadow-[0_24px_40px_-28px_rgba(140,31,31,0.4)]"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-blood-100 text-blood-600">
            <a.icon size={24} weight="duotone" />
          </span>
          <div>
            <h3 className="font-display text-lg font-semibold tracking-tight text-ink-950">
              {a.title}
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-ink-600">{a.body}</p>
          </div>
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-blood-600">
            {a.cta}
            <ArrowRight size={15} weight="bold" className="transition-transform group-hover:translate-x-0.5" />
          </span>
        </Link>
      ))}
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-semibold uppercase tracking-wider text-ink-400">{label}</span>
      <span className="text-base font-medium text-ink-900">{value}</span>
    </div>
  );
}

function StatusPill({ label, active }: { label: string; active: boolean }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-ink-900/10 bg-bone-100 px-4 py-3">
      <span className="text-sm font-medium text-ink-700">{label}</span>
      <span
        className={
          "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold " +
          (active ? "bg-emerald-100 text-emerald-700" : "bg-ink-900/5 text-ink-500")
        }
      >
        <span className={"h-1.5 w-1.5 rounded-full " + (active ? "bg-emerald-500" : "bg-ink-400")} />
        {active ? "On" : "Off"}
      </span>
    </div>
  );
}

export default function DashboardHomePage() {
  const { user } = useAuth();

  const isDonor = user ? "blood_group" in user : false;
  const firstName = user ? (user as { name: string }).name.split(" ")[0] : "";
  const title = firstName ? `Hello, ${firstName}` : "Dashboard";

  return (
    <AuthGate>
      <DashboardShell title={title}>
        {user ? (
          isDonor ? (
            <DonorHome donor={user as DonorProfile} />
          ) : (
            <RequesterHome requester={user as RequesterProfile} />
          )
        ) : null}
      </DashboardShell>
    </AuthGate>
  );
}