import * as React from "react";
import { cn } from "@/lib/cn";

export type StatusPillStatus = "valid" | "revoked" | "expired" | "pending" | "active";

export interface StatusPillProps extends React.HTMLAttributes<HTMLSpanElement> {
  status: StatusPillStatus;
}

const statusConfig: Record<
  StatusPillStatus,
  { label: string; className: string; dotClassName: string }
> = {
  valid: {
    label: "Valid",
    className: "bg-emerald-50 text-emerald-700 border-emerald-100",
    dotClassName: "bg-emerald-500",
  },
  active: {
    label: "Valid",
    className: "bg-emerald-50 text-emerald-700 border-emerald-100",
    dotClassName: "bg-emerald-500",
  },
  revoked: {
    label: "Revoked",
    className: "bg-red-50 text-red-700 border-red-100",
    dotClassName: "bg-red-500",
  },
  expired: {
    label: "Expired",
    className: "bg-amber-50 text-amber-700 border-amber-100",
    dotClassName: "bg-amber-500",
  },
  pending: {
    label: "Pending",
    className: "bg-blue-50 text-blue-700 border-blue-100",
    dotClassName: "bg-blue-500 animate-pulse",
  },
};

export function StatusPill({ status, className, ...props }: StatusPillProps) {
  const config = statusConfig[status] || statusConfig.pending;
  
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs font-bold transition-all duration-200",
        config.className,
        className,
      )}
      {...props}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", config.dotClassName)} />
      {config.label}
    </span>
  );
}


