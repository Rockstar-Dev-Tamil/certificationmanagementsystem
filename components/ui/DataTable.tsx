"use client";

import * as React from "react";
import { ChevronDown, ChevronUp, Search, Command } from "lucide-react";
import { cn } from "@/lib/cn";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";

export type SortDir = "asc" | "desc";

export interface DataTableColumn<T> {
  key: string;
  header: React.ReactNode;
  sortable?: boolean;
  widthClassName?: string;
  render: (row: T) => React.ReactNode;
  searchText?: (row: T) => string;
}

export interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  searchable?: boolean;
  searchPlaceholder?: string;
  emptyTitle?: string;
  emptyDescription?: string;
  onRowClick?: (row: T) => void;
  initialSort?: { key: string; dir: SortDir };
  className?: string;
}

export function DataTable<T>({
  columns,
  data,
  searchable = true,
  searchPlaceholder = "Search and filter assets...",
  emptyTitle = "No records found",
  emptyDescription = "Adjust your search parameters or try a different filter.",
  onRowClick,
  initialSort,
  className,
}: DataTableProps<T>) {
  const [query, setQuery] = React.useState("");
  const [sort, setSort] = React.useState<{ key: string; dir: SortDir } | null>(
    initialSort ?? null,
  );

  const filtered = React.useMemo(() => {
    if (!searchable || !query.trim()) return data;
    const q = query.toLowerCase();
    return data.filter((row) =>
      columns.some((c) => {
        const text =
          c.searchText?.(row) ??
          (typeof c.render(row) === "string" ? (c.render(row) as string) : "");
        return String(text).toLowerCase().includes(q);
      }),
    );
  }, [columns, data, query, searchable]);

  const sorted = React.useMemo(() => {
    if (!sort) return filtered;
    const col = columns.find((c) => c.key === sort.key);
    if (!col) return filtered;
    const getText = (row: T) =>
      (col.searchText?.(row) ??
        (typeof col.render(row) === "string" ? (col.render(row) as string) : "")) as
        | string
        | number;
    const copy = [...filtered];
    copy.sort((a, b) => {
      const av = String(getText(a)).toLowerCase();
      const bv = String(getText(b)).toLowerCase();
      if (av < bv) return sort.dir === "asc" ? -1 : 1;
      if (av > bv) return sort.dir === "asc" ? 1 : -1;
      return 0;
    });
    return copy;
  }, [columns, filtered, sort]);

  function toggleSort(key: string) {
    setSort((prev) => {
      if (!prev || prev.key !== key) return { key, dir: "asc" };
      return { key, dir: prev.dir === "asc" ? "desc" : "asc" };
    });
  }

  return (
    <Card className={cn("p-0 overflow-hidden flex flex-col", className)} padding="none">
      {searchable && (
        <div className="flex items-center gap-3 border-b border-slate-100 bg-white px-4 py-3.5 focus-within:bg-slate-50 transition-colors">
          <Search className="h-4 w-4 text-slate-400" />
          <input
            className="flex-1 bg-transparent text-sm font-medium outline-none placeholder:text-slate-400"
            placeholder={searchPlaceholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-slate-100 border border-slate-200">
            <Command className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">K</span>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead className="sticky top-0 z-10 bg-slate-50 border-b border-slate-200">
            <tr>
              {columns.map((c) => {
                const isSorted = sort?.key === c.key;
                return (
                  <th
                    key={c.key}
                    className={cn(
                      "group px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500",
                      c.widthClassName
                    )}
                    scope="col"
                  >
                    {c.sortable ? (
                      <button
                        onClick={() => toggleSort(c.key)}
                        className="flex items-center gap-1.5 hover:text-slate-900 transition-colors"
                      >
                        {c.header}
                        <span className="flex flex-col opacity-0 group-hover:opacity-100 transition-opacity">
                          {(!isSorted || sort?.dir === "asc") && <ChevronUp className={cn("h-3 w-3", isSorted && "text-brand-600 opacity-100")} />}
                          {(!isSorted || sort?.dir === "desc") && <ChevronDown className={cn("h-3 w-3 -mt-1", isSorted && "text-brand-600 opacity-100")} />}
                        </span>
                      </button>
                    ) : (
                      c.header
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {sorted.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="p-12">
                  <EmptyState title={emptyTitle} description={emptyDescription} />
                </td>
              </tr>
            ) : (
              sorted.map((row, idx) => (
                <tr
                  key={idx}
                  className={cn(
                    "group transition-all duration-150 animate-fade-up",
                    onRowClick ? "cursor-pointer hover:bg-slate-50" : "hover:bg-slate-50/50"
                  )}
                  style={{ animationDelay: `${idx * 20}ms` }}
                  onClick={() => onRowClick?.(row)}
                >
                  {columns.map((c) => (
                    <td key={c.key} className="px-4 py-4 text-sm font-medium text-slate-700">
                      {c.render(row)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}


