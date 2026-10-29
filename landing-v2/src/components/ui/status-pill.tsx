import {
  CheckCircle,
  CircleDashed,
  Clock,
  MagnifyingGlass,
  PaperPlaneTilt,
  Warning,
  XCircle,
} from "@phosphor-icons/react/dist/ssr";

import { cn } from "@/lib/utils";

export type Status =
  "pending" | "progress" | "submitted" | "review" | "success" | "failed" | "expired";

const config: Record<Status, { label: string; icon: typeof CheckCircle; className: string }> = {
  pending: {
    label: "Pending",
    icon: Warning,
    className: "text-st-pending bg-st-pending/10 ring-st-pending/20",
  },
  progress: {
    label: "Generating",
    icon: CircleDashed,
    className: "text-st-progress bg-st-progress/10 ring-st-progress/20",
  },
  submitted: {
    label: "Queued",
    icon: PaperPlaneTilt,
    className: "text-st-submitted bg-st-submitted/10 ring-st-submitted/20",
  },
  review: {
    label: "In review",
    icon: MagnifyingGlass,
    className: "text-st-review bg-st-review/10 ring-st-review/20",
  },
  success: {
    label: "Ready",
    icon: CheckCircle,
    className: "text-st-success bg-st-success/10 ring-st-success/20",
  },
  failed: {
    label: "Failed",
    icon: XCircle,
    className: "text-st-failed bg-st-failed/10 ring-st-failed/20",
  },
  expired: {
    label: "Stale",
    icon: Clock,
    className: "text-st-expired bg-st-expired/10 ring-st-expired/20",
  },
};

/** Status chip used across the product mockups. */
export function StatusPill({
  status,
  label,
  className,
}: {
  status: Status;
  label?: string;
  className?: string;
}) {
  const { label: fallback, icon: Icon, className: tone } = config[status];
  return (
    <span
      className={cn(
        "inline-flex h-6 shrink-0 items-center gap-1.5 rounded-lg px-2 text-xs font-medium ring-1 transition-colors duration-300",
        tone,
        className,
      )}
    >
      <Icon
        weight="bold"
        className={cn("size-3.5", status === "progress" && "animate-spin-slow")}
        aria-hidden="true"
      />
      {label ?? fallback}
    </span>
  );
}
