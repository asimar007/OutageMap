"use client";

import { useMemo, useState, useEffect } from "react";
import { services, getServiceKey, type ServiceStatus } from "@/lib/services";

const STATUS_POLL_INTERVAL_MS = 5 * 60 * 1000;

export function useLandingPage() {
  const [search, setSearch] = useState("");
  const [statusByKey, setStatusByKey] = useState<Record<
    string,
    ServiceStatus
  > | null>(null);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch("/api/status");
        if (res.ok) {
          const data = await res.json();
          setStatusByKey(data.services);
        }
      } catch {
        setStatusByKey(
          Object.fromEntries(
            services.map((s) => [getServiceKey(s), "operational"]),
          ),
        );
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, STATUS_POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  const filtered = useMemo(() => {
    return services.filter((s) => {
      return (
        !search.trim() ||
        s.name.toLowerCase().includes(search.trim().toLowerCase())
      );
    });
  }, [search]);

  const summary = useMemo(() => {
    if (!statusByKey) return null;
    const values = Object.values(statusByKey);
    return {
      operational: values.filter((v) => v === "operational").length,
      degraded: values.filter((v) => v === "degraded").length,
      outage: values.filter((v) => v === "outage").length,
      maintenance: values.filter((v) => v === "maintenance").length,
    };
  }, [statusByKey]);

  return {
    search,
    setSearch,
    statusByKey,
    filtered,
    summary,
  };
}
