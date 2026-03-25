import * as React from "react";

import { cn } from "@/lib/cn";

export interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export function PageHeader({
  className,
  title,
  subtitle,
  action,
  ...props
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 border-b border-[var(--border)] bg-[var(--bg-secondary)] px-6 py-5",
        "sm:flex-row sm:items-end sm:justify-between",
        className,
      )}
      {...props}
    >
      <div>
        <div className="font-semibold text-[var(--text-primary)] text-xl">{title}</div>
        {subtitle ? (
          <div className="mt-1 text-sm text-[var(--text-secondary)]">{subtitle}</div>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

