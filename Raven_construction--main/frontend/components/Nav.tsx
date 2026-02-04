"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import clsx from "clsx";
import ThemeToggle from "@/components/ThemeToggle";

const items = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/projects", label: "Projects" },
  { href: "/jobs", label: "Jobs" },
  { href: "/calendar", label: "Calendar" },
  { href: "/messages", label: "Messages" },
  { href: "/users", label: "Users" },
];

function Icon({ name }: { name: "dashboard" | "projects" | "jobs" | "calendar" | "messages" | "users" }) {
  const common = "h-5 w-5";
  switch (name) {
    case "dashboard":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M4 13h7V4H4v9Zm9 7h7V11h-7v9ZM4 20h7v-5H4v5Zm9-11h7V4h-7v5Z" stroke="currentColor" strokeWidth="1.7" />
        </svg>
      );
    case "projects":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M4 7h16M4 17h16" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          <path d="M6 7v10M18 7v10" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        </svg>
      );
    case "jobs":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M9 6V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1" stroke="currentColor" strokeWidth="1.7" />
          <path d="M4 8h16v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8Z" stroke="currentColor" strokeWidth="1.7" />
          <path d="M4 12h16" stroke="currentColor" strokeWidth="1.7" />
        </svg>
      );
    case "calendar":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M7 3v3M17 3v3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          <path d="M4 7h16v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7Z" stroke="currentColor" strokeWidth="1.7" />
          <path d="M4 11h16" stroke="currentColor" strokeWidth="1.7" />
        </svg>
      );
    case "messages":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M21 14a6 6 0 0 1-6 6H8l-5 2 2-5V8a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v6Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
        </svg>
      );
    case "users":
    default:
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z" stroke="currentColor" strokeWidth="1.7" />
          <path d="M4 21a8 8 0 0 1 16 0" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        </svg>
      );
  }
}

function Brand() {
  return (
    <div className="flex items-center gap-3">
      <div className="h-10 w-10 rounded-2xl glass card grid place-items-center">
        <span className="font-black">R</span>
      </div>
      <div className="leading-tight">
        <div className="text-sm font-extrabold tracking-wide">RAVEN</div>
        <div className="text-xs text-dim tracking-widest">ROOFING</div>
      </div>
    </div>
  );
}

function NavLinks({ onClick }: { onClick?: () => void }) {
  const path = usePathname();
  const active = useMemo(() => items.find(i => path?.startsWith(i.href))?.href, [path]);
  return (
    <nav className="mt-6 space-y-1">
      {items.map(i => (
        <Link
          key={i.href}
          href={i.href}
          onClick={onClick}
          className={clsx(
            "block rounded-xl px-3 py-2.5 text-sm font-semibold transition",
            "hover:bg-white/5",
            active === i.href ? "bg-white/10 glass" : ""
          )}
        >
          {i.label}
        </Link>
      ))}
    </nav>
  );
}

function MobileBottomNav() {
  const path = usePathname();
  const active = useMemo(() => items.find(i => path?.startsWith(i.href))?.href, [path]);
  const tabs = [
    { href: "/dashboard", label: "Dashboard", icon: "dashboard" as const, badge: 0 },
    { href: "/projects", label: "Projects", icon: "projects" as const, badge: 0 },
    { href: "/jobs", label: "Jobs", icon: "jobs" as const, badge: 0 },
    { href: "/calendar", label: "Calendar", icon: "calendar" as const, badge: 2 },
    { href: "/messages", label: "Messages", icon: "messages" as const, badge: 2 },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40">
      <div className="mx-3 mb-3 glass card-strong card-rim px-2 py-2">
        <div className="grid grid-cols-5">
          {tabs.map(t => {
            const isActive = active === t.href;
            return (
              <Link
                key={t.href}
                href={t.href}
                className={clsx(
                  "relative flex flex-col items-center gap-1 rounded-xl py-2 text-[11px] font-extrabold",
                  isActive ? "bg-white/10" : "hover:bg-white/5"
                )}
              >
                <div className={clsx("relative", isActive ? "text-white" : "text-white/80")}>
                  <Icon name={t.icon} />
                  {t.badge > 0 ? (
                    <span className="absolute -right-2 -top-1 text-[10px] font-black px-1.5 py-0.5 rounded-full bg-[rgba(var(--accent-warm),1)] text-black">
                      {t.badge}
                    </span>
                  ) : null}
                </div>
                <span className={clsx(isActive ? "text-white" : "text-white/70")}>{t.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile top bar */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-40">
        <div className="mx-3 mt-3 glass card-strong px-4 py-3 flex items-center justify-between">
          <button
            className="btn-ghost text-sm"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
            Menu
          </button>
          <Brand />
          <ThemeToggle />
        </div>
      </header>

      <MobileBottomNav />

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-72 p-4">
            <div className="h-full glass card-strong p-4">
              <div className="flex items-center justify-between">
                <Brand />
                <button className="btn-ghost text-sm" onClick={() => setOpen(false)}>
                  Close
                </button>
              </div>
              <NavLinks onClick={() => setOpen(false)} />
              <div className="mt-6 flex items-center justify-between">
                <span className="text-xs text-dim">Theme</span>
                <ThemeToggle />
              </div>
              <div className="mt-8 text-xs text-dim">By: FanzofTheOne</div>
            </div>
          </aside>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-72 p-6">
        <div className="w-full glass card-strong p-5 flex flex-col">
          <Brand />
          <NavLinks />
          <div className="mt-auto pt-6 flex items-center justify-between">
            <span className="text-xs text-dim">Theme</span>
            <ThemeToggle />
          </div>
          <div className="mt-4 text-xs text-dim">By: FanzofTheOne</div>
        </div>
      </aside>
      {/* Spacer for mobile top bar */}
      <div className="md:hidden h-20" />
    </>
  );
}
