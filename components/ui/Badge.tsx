import * as React from "react";

import { cn, type ClassValue } from "@/lib/cn";

export type BadgeVariant = "success" | "danger" | "warning" | "info" | "neutral";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const base: ClassValue =
  "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium";

const variants: Record<BadgeVariant, ClassValue> = {
  success:
    "border-emerald-200 bg-emerald-50 text-emerald-700 [--dot:theme(colors.emerald.600)]",
  danger: "border-red-200 bg-red-50 text-red-700 [--dot:theme(colors.red.600)]",
  warning:
    "border-amber-200 bg-amber-50 text-amber-800 [--dot:theme(colors.amber.600)]",
  info:
    "border-blue-200 bg-[var(--accent-light)] text-blue-700 [--dot:theme(colors.blue.600)]",
  neutral:
    "border-slate-200 bg-slate-50 text-slate-700 [--dot:theme(colors.slate.500)]",
};

export function Badge({ className, variant = "neutral", ...props }: BadgeProps) {
  return <span className={cn(base, variants[variant], className)} {...props} />;
}

