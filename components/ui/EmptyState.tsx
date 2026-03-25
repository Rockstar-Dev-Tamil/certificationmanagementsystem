import * as React from "react";

import { cn } from "@/lib/cn";
import { Button, type ButtonProps } from "@/components/ui/Button";

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: { label: string; onClick?: () => void; buttonProps?: ButtonProps };
}

export function EmptyState({
  className,
  icon,
  title,
  description,
  action,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-[var(--radius)] border border-[var(--border)] bg-white p-10 text-center",
        className,
      )}
      {...props}
    >
      {icon ? (
        <div className="mb-4 text-slate-400 [&_svg]:h-10 [&_svg]:w-10">{icon}</div>
      ) : (
        <div className="mb-4 h-10 w-10 rounded-2xl bg-slate-100" aria-hidden />
      )}
      <div className="text-base font-semibold text-[var(--text-primary)]">{title}</div>
      {description ? (
        <div className="mt-1 max-w-md text-sm text-[var(--text-secondary)]">
          {description}
        </div>
      ) : null}
      {action ? (
        <div className="mt-6">
          <Button
            variant="primary"
            {...action.buttonProps}
            onClick={action.onClick ?? action.buttonProps?.onClick}
          >
            {action.label}
          </Button>
        </div>
      ) : null}
    </div>
  );
}

