"use client";

import { useMemo, useState, useEffect } from "react";
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
  type LucideIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { services, getServiceKey, type ServiceStatus } from "@/lib/services";
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

function ServiceIcon({ iconName }: { iconName: string }) {
  const Icon = ICON_MAP[iconName] ?? Box;
  return (
    <div className="flex size-12 items-center justify-center rounded-2xl bg-muted/50 p-3 text-muted-foreground ring-1 ring-border/50 transition-all group-hover:bg-primary/5 group-hover:text-primary">
      <Icon className="size-full" strokeWidth={1.5} />
    </div>
  );
}

type DisplayStatus = ServiceStatus | "loading";

function StatusBadge({ status }: { status: DisplayStatus }) {
  const getColor = () => {
    switch (status) {
      case "operational":
        return "bg-emerald-500";
      case "degraded":
        return "bg-amber-500";
      case "outage":
        return "bg-red-500";
      case "maintenance":
        return "bg-blue-500";
      default:
        return "bg-muted";
    }
  };

  const label =
    status === "loading"
      ? "Loading..."
      : status.charAt(0).toUpperCase() + status.slice(1);

  return (
    <Badge
      variant="outline"
      className="flex items-center gap-2 rounded-full px-3 py-1 text-xs"
    >
      <span className="relative flex h-2.5 w-2.5">
        <span
          className={cn(
            "absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping",
            getColor(),
          )}
        />
        <span
          className={cn(
            "relative inline-flex h-2.5 w-2.5 rounded-full",
            getColor(),
          )}
        />
      </span>
      {label}
    </Badge>
  );
}

function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      <Sun className="size-4 dark:hidden" />
      <Moon className="size-4 hidden dark:block" />
    </Button>
  );
}

export function LandingPage() {
  const { search, setSearch, statusByKey, filtered, summary } =
    useLandingPage();

  return (
    <div className="min-h-screen text-foreground">
      {/* Hero Section */}
      <section className="border-b bg-gradient-to-b from-primary/5 to-transparent">
        <div className="mx-auto max-w-7xl px-4 py-12">
          <div className="flex flex-col gap-6 md:flex-row md:justify-between">
            <div>
              <h1 className="text-4xl font-bold tracking-tight">
                Service Health Dashboard
              </h1>
              <p className="mt-2 text-muted-foreground max-w-xl">
                Real-time monitoring across all services.
              </p>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-8">
        {/* Summary */}
        {summary && (
          <div className="mb-8 grid grid-cols-3 gap-4">
            <Card className="p-4">
              <p className="text-sm text-muted-foreground">Operational</p>
              <p className="text-2xl font-bold">{summary.operational}</p>
            </Card>
            <Card className="p-4">
              <p className="text-sm text-muted-foreground">Degraded</p>
              <p className="text-2xl font-bold">{summary.degraded}</p>
            </Card>
            <Card className="p-4">
              <p className="text-sm text-muted-foreground">Outages</p>
              <p className="text-2xl font-bold">{summary.outage}</p>
            </Card>
          </div>
        )}

        {/* Search */}
        <div className="mb-6 flex gap-4">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search services..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Services Grid */}
        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((service) => (
            <li key={service.name}>
              <a
                href={service.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group block"
              >
                <Card className="relative overflow-hidden border bg-gradient-to-br from-card to-card/70 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/10">
                  <CardContent className="p-6 flex flex-col gap-4">
                    <ServiceIcon iconName={service.icon} />
                    <div>
                      <h3 className="font-semibold group-hover:text-primary transition-colors">
                        {service.name}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {service.category}
                      </p>
                    </div>
                    {statusByKey ? (
                      <StatusBadge
                        status={
                          statusByKey[getServiceKey(service)] ?? "operational"
                        }
                      />
                    ) : (
                      <Skeleton className="h-6 w-24 rounded-full" />
                    )}
                  </CardContent>
                </Card>
              </a>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
