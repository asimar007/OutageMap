"use client";

import React from "react";
import { useTheme } from "next-themes";
import {
  Search,
  Cloud,
  Code,
  Package,
  Box,
  Globe,
  MessageCircle,
  Video,
  Phone,
  Workflow,
  Database,
  Mail,
  BarChart2,
  Sun,
  Moon,
  Activity,
  ArrowUpRight,
  type LucideIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { getServiceKey, type ServiceStatus } from "@/lib/services";
import { useLandingPage } from "../hooks/use-service-monitor";

const ICON_MAP: Record<string, LucideIcon> = {
  cloud: Cloud,
  code: Code,
  package: Package,
  box: Box,
  globe: Globe,
  "message-circle": MessageCircle,
  video: Video,
  phone: Phone,
  workflow: Workflow,
  database: Database,
  mail: Mail,
  "bar-chart-2": BarChart2,
};

/* ------------------------------------------------------------------ */
/*  Service Icon                                                       */
/* ------------------------------------------------------------------ */
function ServiceIcon({
  iconName,
}: {
  iconName: string | React.ComponentType<React.SVGProps<SVGSVGElement>>;
}) {
  const Icon =
    typeof iconName === "string" ? (ICON_MAP[iconName] ?? Box) : iconName;
  return (
    <div className="relative flex size-11 items-center justify-center text-primary/70 transition-all duration-300 group-hover:text-primary">
      <Icon className="size-10" strokeWidth={1.5} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Status Badge                                                       */
/* ------------------------------------------------------------------ */
type DisplayStatus = ServiceStatus | "loading";

function StatusBadge({ status }: { status: DisplayStatus }) {
  const getColor = () => {
    switch (status) {
      case "operational":
        return "bg-emerald-400";
      case "degraded":
        return "bg-amber-400";
      case "outage":
        return "bg-red-400";
      case "maintenance":
        return "bg-sky-400";
      default:
        return "bg-muted-foreground/40";
    }
  };

  const getBorderColor = () => {
    switch (status) {
      case "operational":
        return "border-emerald-400/30 text-emerald-700 dark:text-emerald-300";
      case "degraded":
        return "border-amber-400/30 text-amber-700 dark:text-amber-300";
      case "outage":
        return "border-red-400/30 text-red-700 dark:text-red-300";
      case "maintenance":
        return "border-sky-400/30 text-sky-700 dark:text-sky-300";
      default:
        return "border-border text-muted-foreground";
    }
  };

  const label =
    status === "loading"
      ? "Loading..."
      : status.charAt(0).toUpperCase() + status.slice(1);

  return (
    <Badge
      variant="outline"
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-widest",
        getBorderColor(),
      )}
    >
      <span className="relative flex h-1.5 w-1.5">
        {status === "operational" && (
          <span
            className={cn(
              "absolute inline-flex h-full w-full rounded-full opacity-60 animate-ping",
              getColor(),
            )}
          />
        )}
        <span
          className={cn(
            "relative inline-flex h-1.5 w-1.5 rounded-full",
            getColor(),
          )}
        />
      </span>
      {label}
    </Badge>
  );
}

/* ------------------------------------------------------------------ */
/*  Summary Stat Card                                                  */
/* ------------------------------------------------------------------ */
function SummaryCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: number | undefined;
  accent: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card/60 p-4 sm:p-5 backdrop-blur-sm transition-all duration-300 hover:border-border hover:bg-card/80">
      {/* Accent line */}
      <div className={cn("absolute inset-x-0 top-0 h-px", accent)} />
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
        {label}
      </p>
      {value === undefined ? (
        <Skeleton className="mt-3 h-8 w-12 rounded-md" />
      ) : (
        <p className="mt-2 font-mono text-2xl font-light tabular-nums tracking-tight text-foreground sm:text-3xl">
          {value}
        </p>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Theme Toggle                                                       */
/* ------------------------------------------------------------------ */
function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      className="rounded-xl border border-border/50 text-muted-foreground transition-all hover:border-border hover:text-foreground"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      <Sun className="size-4 dark:hidden" />
      <Moon className="size-4 hidden dark:block" />
    </Button>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Page                                                          */
/* ------------------------------------------------------------------ */
export function LandingPage() {
  const { search, setSearch, statusByKey, filtered, summary } =
    useLandingPage();

  return (
    <div className="min-h-screen text-foreground">
      {/* ── Hero ── */}
      <header className="sticky top-0 z-50 overflow-hidden border-b border-border/40 bg-background/80 backdrop-blur-md">
        {/* Gradient wash */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-primary/[0.04] via-transparent to-transparent" />
        <div className="pointer-events-none absolute -top-24 left-1/2 h-48 w-[300px] sm:w-[600px] -translate-x-1/2 rounded-full bg-primary/[0.06] blur-3xl" />

        <div className="relative mx-auto flex max-w-6xl flex-col gap-4 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-6">
          <div className="flex items-center gap-4">
            {/* Logo mark */}
            <div className="flex size-10 items-center justify-center rounded-xl bg-foreground text-background">
              <Activity className="size-5" strokeWidth={2} />
            </div>
            <div>
              <h1 className="font-mono text-lg font-semibold tracking-tight">
                Outage Map
              </h1>
              <p className="font-mono text-[11px] tracking-wide text-muted-foreground">
                Real-time monitoring across all services
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative flex-1 sm:flex-none">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground/50" />
              <Input
                type="search"
                placeholder="Search services..."
                className="h-9 w-full rounded-xl border-border/50 bg-card/80 pl-9 font-mono text-xs placeholder:text-muted-foreground/40 focus-visible:border-primary/30 focus-visible:ring-primary/20 transition-all duration-300 sm:w-48 sm:focus-visible:w-64"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-10">
        {/* ── Summary Row ── */}
        <div className="mb-6 grid grid-cols-2 gap-3 sm:mb-10 sm:gap-4 sm:grid-cols-4">
          <SummaryCard
            label="Operational"
            value={summary?.operational}
            accent="bg-gradient-to-r from-transparent via-emerald-500/60 to-transparent"
          />
          <SummaryCard
            label="Degraded"
            value={summary?.degraded}
            accent="bg-gradient-to-r from-transparent via-amber-500/60 to-transparent"
          />
          <SummaryCard
            label="Outages"
            value={summary?.outage}
            accent="bg-gradient-to-r from-transparent via-red-500/60 to-transparent"
          />
          <SummaryCard
            label="Maintenance"
            value={summary?.maintenance}
            accent="bg-gradient-to-r from-transparent via-sky-500/60 to-transparent"
          />
        </div>

        {/* ── Services Grid ── */}
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {(() => {
            const priority: Record<string, number> = {
              outage: 1,
              degraded: 2,
              maintenance: 3,
              operational: 4,
              loading: 5,
            };

            const sortedServices = [...filtered].sort((a, b) => {
              const statusA = statusByKey
                ? (statusByKey[getServiceKey(a)] ?? "operational")
                : "loading";
              const statusB = statusByKey
                ? (statusByKey[getServiceKey(b)] ?? "operational")
                : "loading";

              return priority[statusA] - priority[statusB];
            });

            return sortedServices.map((service) => (
              <li key={service.name}>
                <a
                  href={service.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block"
                >
                  <Card className="relative overflow-hidden rounded-2xl border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:border-border hover:bg-card/80 hover:shadow-xl hover:shadow-primary/[0.03]">
                    {/* Hover accent */}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/[0.02] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                    <CardContent className="relative flex flex-col gap-3 p-4 sm:gap-4 sm:p-5">
                      <div className="flex items-start justify-between">
                        <ServiceIcon iconName={service.icon} />
                        <ArrowUpRight className="size-3.5 text-muted-foreground/30 transition-all duration-300 group-hover:text-primary/60 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </div>

                      <div className="mt-1">
                        <h3 className="text-sm font-medium tracking-tight text-foreground transition-colors group-hover:text-primary">
                          {service.name}
                        </h3>
                        <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground/60">
                          {service.category}
                        </p>
                      </div>

                      <div className="pt-1">
                        {statusByKey ? (
                          <StatusBadge
                            status={
                              statusByKey[getServiceKey(service)] ??
                              "operational"
                            }
                          />
                        ) : (
                          <Skeleton className="h-5 w-24 rounded-md" />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </a>
              </li>
            ));
          })()}
        </ul>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-border/30 py-8">
        <p className="text-center font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground/40">
          Status Dashboard
        </p>
      </footer>
    </div>
  );
}
