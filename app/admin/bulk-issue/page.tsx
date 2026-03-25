"use client";

import * as React from "react";
import { CheckCircle2, FileText, Upload, XCircle } from "lucide-react";

import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { DataTable, type DataTableColumn } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/cn";
import { useToast } from "@/components/ui/Toast";

type Row = Record<string, string>;

type MappingKey = "recipient_name" | "recipient_email" | "course_title" | "expiry_date";
const mappingLabels: Record<MappingKey, string> = {
  recipient_name: "Recipient Name",
  recipient_email: "Email",
  course_title: "Certificate Title",
  expiry_date: "Expiry Date",
};

type BulkResult = { status: "success" | "failed"; email?: string; certificate_id?: string; error?: string };

function parseCSV(text: string): { headers: string[]; rows: Row[] } {
  const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length === 0) return { headers: [], rows: [] };
  const headers = lines[0].split(",").map((h) => h.trim());
  const rows = lines.slice(1).map((line) => {
    const values = line.split(",").map((v) => v.trim());
    const row: Row = {};
    headers.forEach((h, i) => {
      row[h] = values[i] ?? "";
    });
    return row;
  });
  return { headers, rows };
}

export default function BulkIssuePage() {
  const { push } = useToast();
  const [file, setFile] = React.useState<File | null>(null);
  const [headers, setHeaders] = React.useState<string[]>([]);
  const [rows, setRows] = React.useState<Row[]>([]);

  const [mapping, setMapping] = React.useState<Record<MappingKey, string>>({
    recipient_name: "",
    recipient_email: "",
    course_title: "",
    expiry_date: "",
  });

  const [processing, setProcessing] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [results, setResults] = React.useState<BulkResult[]>([]);

  async function onPickFile(f: File) {
    setFile(f);
    setResults([]);
    setProgress(0);
    const text = await f.text();
    const parsed = parseCSV(text);
    setHeaders(parsed.headers);
    setRows(parsed.rows);
    setMapping((prev) => ({
      ...prev,
      recipient_name: parsed.headers.find((h) => /name/i.test(h)) ?? parsed.headers[0] ?? "",
      recipient_email: parsed.headers.find((h) => /email/i.test(h)) ?? parsed.headers[1] ?? "",
      course_title: parsed.headers.find((h) => /title|course/i.test(h)) ?? parsed.headers[2] ?? "",
      expiry_date: parsed.headers.find((h) => /expiry|expire/i.test(h)) ?? parsed.headers[3] ?? "",
    }));
  }

  const canProcess =
    rows.length > 0 && mapping.recipient_name && mapping.recipient_email && mapping.course_title;

  async function process() {
    if (!canProcess) {
      push({ type: "error", message: "Map required fields before issuing." });
      return;
    }
    setProcessing(true);
    setResults([]);
    setProgress(10);

    const interval = window.setInterval(() => {
      setProgress((p) => (p < 90 ? p + 3 : p));
    }, 250);

    try {
      const certificates = rows.map((r) => ({
        recipient_name: r[mapping.recipient_name] ?? "",
        recipient_email: r[mapping.recipient_email] ?? "",
        course_title: r[mapping.course_title] ?? "",
        expiry_date: mapping.expiry_date ? (r[mapping.expiry_date] ?? null) : null,
      }));

      const res = await fetch("/api/issue/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ certificates }),
      });
      const data: any = await res.json();
      if (!res.ok) {
        push({ type: "error", message: data?.error ?? "Bulk issue failed." });
        return;
      }
      setResults(Array.isArray(data.results) ? (data.results as BulkResult[]) : []);
      push({ type: "success", message: "Bulk issuing completed." });
      setProgress(100);
    } catch {
      push({ type: "error", message: "Network error during bulk issue." });
    } finally {
      window.clearInterval(interval);
      setProcessing(false);
      setTimeout(() => setProgress(0), 1200);
    }
  }

  const previewColumns: Array<DataTableColumn<Row>> = [
    ...headers.slice(0, 4).map((h) => ({
      key: h,
      header: h,
      sortable: true,
      render: (r: Row) => <span className="text-sm text-[var(--text-secondary)]">{r[h]}</span>,
      searchText: (r: Row) => r[h],
    })),
  ];

  const resultColumns: Array<DataTableColumn<BulkResult>> = [
    {
      key: "status",
      header: "Status",
      sortable: true,
      render: (r) =>
        r.status === "success" ? (
          <Badge variant="success">
            <CheckCircle2 className="h-3.5 w-3.5" /> Success
          </Badge>
        ) : (
          <Badge variant="danger">
            <XCircle className="h-3.5 w-3.5" /> Failed
          </Badge>
        ),
      searchText: (r) => r.status,
    },
    {
      key: "email",
      header: "Email",
      sortable: true,
      render: (r) => <span className="text-sm">{r.email ?? "—"}</span>,
      searchText: (r) => r.email ?? "",
    },
    {
      key: "certificate_id",
      header: "Certificate ID",
      sortable: true,
      render: (r) => (
        <span className="font-mono text-xs text-[var(--text-primary)]">{r.certificate_id ?? "—"}</span>
      ),
      searchText: (r) => r.certificate_id ?? "",
    },
  ];

  return (
    <div>
      <PageHeader
        title="Bulk issue"
        subtitle="Upload a CSV, map columns, preview rows, then issue in one operation."
        action={
          <Button onClick={process} isLoading={processing} disabled={!canProcess}>
            Issue batch
          </Button>
        }
      />

      <div className="px-6 py-6 space-y-6">
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-7 space-y-6">
            <Card className="p-6">
              <div className="text-sm font-semibold text-[var(--text-primary)]">Upload CSV</div>
              <div className="mt-4">
                <div
                  className={cn(
                    "relative flex flex-col items-center justify-center rounded-[var(--radius)] border-2 border-dashed p-10 text-center transition",
                    "border-[var(--border)] bg-white hover:bg-slate-50 hover:border-slate-300",
                  )}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    const f = e.dataTransfer.files?.[0];
                    if (f) void onPickFile(f);
                  }}
                >
                  <input
                    type="file"
                    accept=".csv"
                    className="absolute inset-0 cursor-pointer opacity-0"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) void onPickFile(f);
                    }}
                  />
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--accent-light)] text-[var(--accent)]">
                    <Upload className="h-6 w-6" />
                  </div>
                  <div className="mt-4 text-sm font-semibold text-[var(--text-primary)]">
                    Drag & drop your CSV here
                  </div>
                  <div className="mt-1 text-sm text-[var(--text-secondary)]">
                    or click to browse.
                  </div>
                  {file ? (
                    <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-white px-3 py-1 text-xs text-[var(--text-secondary)]">
                      <FileText className="h-3.5 w-3.5 text-slate-400" />
                      {file.name}
                    </div>
                  ) : null}
                </div>
              </div>

              {progress > 0 ? (
                <div className="mt-6">
                  <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
                    <span>Processing</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="mt-2 h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full bg-[var(--accent)] transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              ) : null}
            </Card>

            <Card className="p-6">
              <div className="text-sm font-semibold text-[var(--text-primary)]">Preview</div>
              <div className="mt-4">
                <DataTable
                  columns={previewColumns}
                  data={rows.slice(0, 25)}
                  searchable
                  searchPlaceholder="Search preview rows…"
                  emptyTitle="No rows to preview"
                  emptyDescription="Upload a CSV to see parsed rows here."
                />
              </div>
            </Card>
          </div>

          <div className="lg:col-span-5 space-y-6">
            <Card className="p-6">
              <div className="text-sm font-semibold text-[var(--text-primary)]">Field mapping</div>
              <div className="mt-2 text-sm text-[var(--text-secondary)]">
                Map CSV columns to required fields.
              </div>
              <div className="mt-5 space-y-4">
                {(Object.keys(mappingLabels) as MappingKey[]).map((k) => (
                  <div key={k} className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium text-[var(--text-secondary)]">
                        {mappingLabels[k]}
                      </div>
                      {k !== "expiry_date" ? <Badge variant="neutral">Required</Badge> : <Badge variant="info">Optional</Badge>}
                    </div>
                    <select
                      className="focus-ring h-11 w-full rounded-[var(--radius)] border border-[var(--border)] bg-white px-3 text-sm"
                      value={mapping[k]}
                      onChange={(e) => setMapping((p) => ({ ...p, [k]: e.target.value }))}
                    >
                      <option value="">Select column…</option>
                      {headers.map((h) => (
                        <option key={h} value={h}>
                          {h}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <Button className="w-full" onClick={process} isLoading={processing} disabled={!canProcess}>
                  Issue batch
                </Button>
              </div>
            </Card>

            <Card className="p-6">
              <div className="text-sm font-semibold text-[var(--text-primary)]">Results</div>
              <div className="mt-4">
                <DataTable
                  columns={resultColumns}
                  data={results}
                  searchable
                  searchPlaceholder="Search results…"
                  emptyTitle="No results yet"
                  emptyDescription="Run the batch to see per-row outcomes."
                />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
