"use client";

import * as React from "react";
import { Download } from "lucide-react";

import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { DataTable, type DataTableColumn } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/cn";

type AuditRow = {
  id: number;
  action: string;
  performed_by: string | null;
  target_id: string | null;
  details: string | null;
  created_at: string;
};

function actionVariant(action: string) {
  const a = action.toUpperCase();
  if (a.includes("REVOKE")) return "danger" as const;
  if (a.includes("EXPIRE")) return "warning" as const;
  if (a.includes("ISSUE")) return "info" as const;
  if (a.includes("LOGIN")) return "neutral" as const;
  return "neutral" as const;
}

export default function AuditLogPage() {
  const [loading, setLoading] = React.useState(true);
  const [rows, setRows] = React.useState<AuditRow[]>([]);
  const [q, setQ] = React.useState("");
  const [action, setAction] = React.useState("");
  const [from, setFrom] = React.useState("");
  const [to, setTo] = React.useState("");

  async function load() {
    setLoading(true);
    try {
      const sp = new URLSearchParams();
      if (q.trim()) sp.set("q", q.trim());
      if (action) sp.set("action", action);
      if (from) sp.set("from", from);
      if (to) sp.set("to", to);
      const res = await fetch(`/api/audit?${sp.toString()}`);
      const data: any = await res.json();
      setRows(Array.isArray(data?.audits) ? (data.audits as AuditRow[]) : []);
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const columns: Array<DataTableColumn<AuditRow>> = [
    {
      key: "created_at",
      header: "Timestamp",
      sortable: true,
      render: (r) => (
        <span className="text-sm text-[var(--text-secondary)]">
          {new Date(r.created_at).toLocaleString()}
        </span>
      ),
      searchText: (r) => r.created_at,
    },
    {
      key: "action",
      header: "Action",
      sortable: true,
      render: (r) => <Badge variant={actionVariant(r.action)}>{r.action}</Badge>,
      searchText: (r) => r.action,
    },
    {
      key: "performed_by",
      header: "Actor",
      sortable: true,
      render: (r) => (
        <span className={cn("font-mono text-xs", r.performed_by ? "text-slate-800" : "text-slate-400")}>
          {r.performed_by ?? "System"}
        </span>
      ),
      searchText: (r) => r.performed_by ?? "System",
    },
    {
      key: "target_id",
      header: "Target",
      sortable: true,
      render: (r) => (
        <span className={cn("font-mono text-xs", r.target_id ? "text-slate-800" : "text-slate-400")}>
          {r.target_id ?? "—"}
        </span>
      ),
      searchText: (r) => r.target_id ?? "",
    },
    {
      key: "details",
      header: "Details",
      sortable: false,
      render: (r) => (
        <span className="text-sm text-[var(--text-secondary)] line-clamp-2">
          {r.details ?? "—"}
        </span>
      ),
      searchText: (r) => r.details ?? "",
    },
  ];

  return (
    <div>
      <PageHeader
        title="Audit log"
        subtitle="Filter and export a full record of certificate activity."
        action={
          <a href="/api/audit/export">
            <Button leftIcon={<Download className="h-4 w-4" />}>Export CSV</Button>
          </a>
        }
      />

      <div className="px-6 py-6 space-y-6">
        <Card className="p-6">
          <div className="grid gap-4 md:grid-cols-12">
            <div className="md:col-span-4">
              <label className="text-sm font-medium text-[var(--text-secondary)]">Search</label>
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                className="focus-ring mt-2 h-11 w-full rounded-[var(--radius)] border border-[var(--border)] bg-white px-3 text-sm"
                placeholder="Action, target id, details…"
              />
            </div>
            <div className="md:col-span-3">
              <label className="text-sm font-medium text-[var(--text-secondary)]">Action</label>
              <select
                value={action}
                onChange={(e) => setAction(e.target.value)}
                className="focus-ring mt-2 h-11 w-full rounded-[var(--radius)] border border-[var(--border)] bg-white px-3 text-sm"
              >
                <option value="">All</option>
                <option value="ISSUE">ISSUE</option>
                <option value="REVOKE">REVOKE</option>
                <option value="LOGIN">LOGIN</option>
                <option value="EXPIRE">EXPIRE</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-[var(--text-secondary)]">From</label>
              <input
                type="date"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="focus-ring mt-2 h-11 w-full rounded-[var(--radius)] border border-[var(--border)] bg-white px-3 text-sm"
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-[var(--text-secondary)]">To</label>
              <input
                type="date"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="focus-ring mt-2 h-11 w-full rounded-[var(--radius)] border border-[var(--border)] bg-white px-3 text-sm"
              />
            </div>
            <div className="md:col-span-1 flex items-end">
              <Button className="w-full" variant="outline" onClick={() => void load()}>
                Apply
              </Button>
            </div>
          </div>
        </Card>

        <div>
          {loading ? (
            <Card className="p-6">
              <div className="text-sm text-[var(--text-muted)]">Loading…</div>
            </Card>
          ) : (
            <DataTable
              columns={columns}
              data={rows}
              searchable
              searchPlaceholder="Search within loaded logs…"
              emptyTitle="No audit events"
              emptyDescription="Try widening your date range or clearing filters."
            />
          )}
        </div>
      </div>
    </div>
  );
}

