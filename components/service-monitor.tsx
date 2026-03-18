"use client";

import { Search, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { getServiceKey } from "@/lib/services";
import { useLandingPage } from "@/hooks/use-service-monitor";

// Extracted Components
import { ServiceIcon } from "@/components/service-icon";
import { StatusBadge } from "@/components/status-badge";
import { SummaryCard } from "@/components/summary-card";
import { ThemeToggle } from "@/components/theme-toggle";

export function LandingPage() {
  const { search, setSearch, statusByKey, filtered, summary } =
    useLandingPage();

  return (
    <div className="min-h-screen text-foreground">
      {/* ── Hero ── */}
      <header className="sticky top-0 z-50 overflow-hidden border-b border-border/40 bg-background/80 backdrop-blur-md">
        {/* Gradient wash */}
        <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-primary/4 via-transparent to-transparent" />
        <div className="pointer-events-none absolute -top-24 left-1/2 h-48 w-[300px] sm:w-[600px] -translate-x-1/2 rounded-full bg-primary/6 blur-3xl" />

        <div className="relative mx-auto flex max-w-6xl flex-col gap-4 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-6">
          <div className="flex items-center gap-4">
            {/* Logo mark */}
            <Image
              src="/icon.png"
              alt="Outage Map"
              width={40}
              height={40}
              className="rounded-xl"
            />
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
            accent="bg-linear-to-r from-transparent via-emerald-500/60 to-transparent"
          />
          <SummaryCard
            label="Degraded"
            value={summary?.degraded}
            accent="bg-linear-to-r from-transparent via-amber-500/60 to-transparent"
          />
          <SummaryCard
            label="Outages"
            value={summary?.outage}
            accent="bg-linear-to-r from-transparent via-red-500/60 to-transparent"
          />
          <SummaryCard
            label="Maintenance"
            value={summary?.maintenance}
            accent="bg-linear-to-r from-transparent via-sky-500/60 to-transparent"
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
                  <Card className="relative overflow-hidden rounded-2xl border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:border-border hover:bg-card/80 hover:shadow-xl hover:shadow-primary/3">
                    {/* Hover accent */}
                    <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-primary/2 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

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
        <p className="text-center font-mono text-[10px] tracking-[0.25em] text-muted-foreground">
          Built with ❤️ by Asim
        </p>
      </footer>
    </div>
  );
}
