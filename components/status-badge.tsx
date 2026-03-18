import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { type ServiceStatus } from "@/lib/services";

export type DisplayStatus = ServiceStatus | "loading";

export function StatusBadge({ status }: { status: DisplayStatus }) {
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
