/* eslint-disable react-refresh/only-export-components */
"use client";

import * as React from "react";
import { X } from "lucide-react";

import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/Button";

export type ToastType = "success" | "error" | "info";

export interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
}

type ToastContextValue = {
  items: ToastItem[];
  push: (toast: Omit<ToastItem, "id">) => void;
  dismiss: (id: string) => void;
};

const ToastContext = React.createContext<ToastContextValue | null>(null);

function toastStyles(type: ToastType) {
  switch (type) {
    case "success":
      return "border-emerald-200 bg-emerald-50 text-emerald-900";
    case "error":
      return "border-red-200 bg-red-50 text-red-900";
    case "info":
    default:
      return "border-slate-200 bg-white text-slate-900";
  }
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<ToastItem[]>([]);

  const dismiss = React.useCallback((id: string) => {
    setItems((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const push = React.useCallback(
    (toast: Omit<ToastItem, "id">) => {
      const id =
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : String(Date.now() + Math.random());
      const item: ToastItem = { id, ...toast };
      setItems((prev) => [item, ...prev].slice(0, 4));
      window.setTimeout(() => dismiss(id), 4000);
    },
    [dismiss],
  );

  return (
    <ToastContext.Provider value={{ items, push, dismiss }}>
      {children}
      <div className="fixed right-4 top-4 z-[60] flex w-[360px] max-w-[calc(100vw-2rem)] flex-col gap-2">
        {items.map((t) => (
          <div
            key={t.id}
            className={cn(
              "animate-[toastIn_180ms_ease-out] rounded-[var(--radius)] border p-3 shadow-[var(--shadow-md)]",
              toastStyles(t.type),
            )}
            role="status"
            aria-live="polite"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="text-sm font-medium">{t.message}</div>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 px-0"
                onClick={() => dismiss(t.id)}
                aria-label="Dismiss toast"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = React.useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

/**
 * Presentational Toast component (single item).
 * Use `ToastProvider` + `useToast()` for the system behavior.
 */
export function Toast({
  type,
  message,
}: {
  type: ToastType;
  message: string;
}) {
  return (
    <div
      className={cn(
        "rounded-[var(--radius)] border p-3 shadow-[var(--shadow-md)]",
        toastStyles(type),
      )}
      role="status"
      aria-live="polite"
    >
      <div className="text-sm font-medium">{message}</div>
    </div>
  );
}

