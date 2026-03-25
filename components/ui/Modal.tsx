import * as React from "react";

import { cn } from "@/lib/cn";
import { X } from "lucide-react";
import { Button } from "@/components/ui/Button";

export interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  description?: string;
}

export function Modal({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
}: ModalProps) {
  React.useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onOpenChange(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        className="absolute inset-0 bg-slate-900/30 backdrop-blur-[2px]"
        aria-label="Close modal"
        onClick={() => onOpenChange(false)}
      />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div
          role="dialog"
          aria-modal="true"
          aria-label={title}
          className={cn(
            "w-full max-w-lg overflow-hidden rounded-[var(--radius)] border border-[var(--border)] bg-white shadow-[var(--shadow-md)]",
          )}
        >
          <div className="flex items-start justify-between gap-4 border-b border-[var(--border)] p-5">
            <div>
              <div className="font-semibold text-[var(--text-primary)]">{title}</div>
              {description ? (
                <div className="mt-1 text-sm text-[var(--text-secondary)]">
                  {description}
                </div>
              ) : null}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
              aria-label="Close"
              className="h-8 w-8 px-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="p-5">{children}</div>
          {footer ? (
            <div className="border-t border-[var(--border)] p-5">{footer}</div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

