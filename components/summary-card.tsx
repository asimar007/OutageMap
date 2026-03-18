import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function SummaryCard({
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
