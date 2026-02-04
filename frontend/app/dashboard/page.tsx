"use client";

import { useMemo, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

function StatCard({
  title,
  value,
  subtitle,
  icon,
}: {
  title: string;
  value: string;
  subtitle: string;
  icon?: ReactNode;
}) {
  return (
    <div className="glass card-strong card-rim lift p-4 md:p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-xs text-dim font-semibold tracking-wide">{title}</div>
          <div className="mt-2 text-3xl font-extrabold tracking-tight">{value}</div>
          <div className="mt-1 text-xs text-dim">{subtitle}</div>
        </div>
        {icon ? (
          <div className="h-10 w-10 rounded-2xl glass card-rim grid place-items-center" style={{ boxShadow: "0 0 0 1px rgba(var(--accent-cool),0.10), 0 18px 50px rgba(var(--accent-cool),0.12)" }}>
            {icon}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function StatusPill({ status }: { status?: string }) {
  const s = (status ?? "in progress").toLowerCase();
  if (s.includes("complete")) return <span className="pill pill-success">COMPLETED</span>;
  if (s.includes("hold")) return <span className="pill pill-hold">ON HOLD</span>;
  return <span className="pill pill-warm">IN PROGRESS</span>;
}

function SectionHeader({ title, action }: { title: string; action?: string }) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-sm font-extrabold tracking-wide">{title}</h2>
      {action ? <button className="btn-ghost text-xs">{action}</button> : null}
    </div>
  );
}

export default function Dashboard() {
  const me = useQuery({ queryKey: ["me"], queryFn: api.me });
  const jobs = useQuery({ queryKey: ["jobs"], queryFn: api.jobs.list });
  const projects = useQuery({ queryKey: ["projects"], queryFn: api.projects.list });

  const stats = useMemo(() => {
    const p = projects.data?.length ?? 0;
    const j = jobs.data?.length ?? 0;
    const pendingInvoices = Math.max(0, Math.round((j * 12750) / 8)); // placeholder math; wire real invoices later
    const upcomingTasks = Math.max(0, Math.round(j * 1.5));
    return { p, j, pendingInvoices, upcomingTasks };
  }, [projects.data, jobs.data]);

  const recentProjects = (projects.data ?? []).slice(0, 5);
  const upcoming = (jobs.data ?? []).slice(0, 4);

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Top bar */}
      <div className="glass card-strong p-4 md:p-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="text-dim text-xs font-semibold">Dashboard</div>
          <div className="text-2xl md:text-3xl font-extrabold tracking-tight">Raven Roofing</div>
          <div className="mt-1 text-xs text-dim">
            {me.data ? `Logged in as ${me.data.name} (${me.data.role})` : "Not authenticated"}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="glass card px-3 py-2 w-full md:w-80">
            <input
              className="w-full bg-transparent outline-none text-sm placeholder:text-dim"
              placeholder="Search..."
            />
          </div>
          <button className="btn-primary text-sm whitespace-nowrap">+ New Project</button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Projects"
          value={`${stats.p}`}
          subtitle="Completed / in progress"
          icon={
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M4 13h7V4H4v9Zm9 7h7V11h-7v9ZM4 20h7v-5H4v5Zm9-11h7V4h-7v5Z" stroke="currentColor" strokeWidth="1.7" />
            </svg>
          }
        />
        <StatCard
          title="Ongoing Jobs"
          value={`${stats.j}`}
          subtitle="Active jobs this week"
          icon={
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M9 6V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1" stroke="currentColor" strokeWidth="1.7" />
              <path d="M4 8h16v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8Z" stroke="currentColor" strokeWidth="1.7" />
              <path d="M4 12h16" stroke="currentColor" strokeWidth="1.7" />
            </svg>
          }
        />
        <StatCard
          title="Pending Invoices"
          value={`$${stats.pendingInvoices.toLocaleString()}`}
          subtitle="Pending invoices"
          icon={
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M7 3h10v18l-2-1-3 1-3-1-2 1V3Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
              <path d="M9 8h6M9 12h6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
            </svg>
          }
        />
        <StatCard
          title="Upcoming Tasks"
          value={`${stats.upcomingTasks}`}
          subtitle="Tasks due soon"
          icon={
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M7 3v3M17 3v3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
              <path d="M4 7h16v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7Z" stroke="currentColor" strokeWidth="1.7" />
              <path d="M4 11h16" stroke="currentColor" strokeWidth="1.7" />
            </svg>
          }
        />
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent Projects */}
        <div className="lg:col-span-2 glass card-strong card-rim p-4 md:p-5">
          <SectionHeader title="Recent Projects" action="View All" />
          <div className="mt-4 space-y-3">
            {recentProjects.length === 0 ? (
              <div className="text-sm text-dim">No projects yet.</div>
            ) : (
              recentProjects.map((p: any) => (
                <div key={p.id} className="glass card card-rim card-inset lift p-4 flex items-center justify-between">
                  <div>
                    <div className="font-extrabold tracking-tight">{p.name ?? `Project ${p.id}`}</div>
                    <div className="text-xs text-dim mt-1">
                      {p.address ?? "Address not set"}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusPill status={p.status} />
                    <span className="text-xs text-dim">{p.task_progress ?? "—"}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Map placeholder */}
        <div className="glass card-strong card-rim p-4 md:p-5">
          <SectionHeader title="Active Jobs Map" action="View All" />
          <div className="mt-4 glass card card-rim overflow-hidden">
            <div className="h-48 relative grid place-items-center text-xs text-dim">
              <div className="absolute inset-0" style={{
                background:
                  "radial-gradient(700px 260px at 30% 10%, rgba(var(--accent-cool),0.20), transparent 60%)," +
                  "radial-gradient(600px 280px at 70% 90%, rgba(var(--accent-warm),0.16), transparent 65%)," +
                  "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(0,0,0,0.10))"
              }} />
              <div className="relative">Map placeholder (wire Mapbox/Google later)</div>
            </div>
          </div>
          <div className="mt-4 space-y-3">
            {(jobs.data ?? []).slice(0, 3).map((j: any) => (
              <div key={j.id} className="glass card card-rim p-3">
                <div className="font-semibold text-sm">{j.title ?? `Job ${j.id}`}</div>
                <div className="text-xs text-dim">{j.city ?? "—"}</div>
              </div>
            ))}
            {(jobs.data ?? []).length === 0 ? <div className="text-sm text-dim">No jobs yet.</div> : null}
          </div>
        </div>
      </div>

      {/* Bottom grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 glass card-strong card-rim p-4 md:p-5">
          <SectionHeader title="Active Jobs" action="View All" />
          <div className="mt-4 space-y-3">
            {(jobs.data ?? []).slice(0, 3).map((j: any) => (
              <div key={j.id} className="glass card card-rim lift p-4 flex items-center justify-between">
                <div>
                  <div className="font-extrabold tracking-tight">{j.title ?? `Job ${j.id}`}</div>
                  <div className="text-xs text-dim mt-1">{j.location ?? j.city ?? "—"}</div>
                </div>
                <StatusPill status={j.status} />
              </div>
            ))}
            {(jobs.data ?? []).length === 0 ? <div className="text-sm text-dim">No jobs yet.</div> : null}
          </div>
        </div>

        <div className="glass card-strong card-rim p-4 md:p-5">
          <SectionHeader title="Upcoming Tasks" action="View All" />
          <div className="mt-4 space-y-3">
            {upcoming.length === 0 ? (
              <div className="text-sm text-dim">No tasks yet.</div>
            ) : (
              upcoming.map((j: any) => (
                <div key={j.id} className="glass card card-rim lift p-4">
                  <div className="font-semibold text-sm">{j.title ?? `Task for Job ${j.id}`}</div>
                  <div className="text-xs text-dim">{j.project_name ?? "—"}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
