"use client";

import * as React from "react";
import { MoreHorizontal, Plus, Trash2, Copy as CopyIcon, Edit3, Layers } from "lucide-react";

import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";
import { Skeleton } from "@/components/ui/Skeleton";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/cn";

type Template = {
  id: string;
  title: string;
  description: string | null;
  created_at?: string;
};

export default function TemplatesPage() {
  const { push } = useToast();
  const [loading, setLoading] = React.useState(true);
  const [templates, setTemplates] = React.useState<Template[]>([]);
  const [menuOpen, setMenuOpen] = React.useState<string | null>(null);

  const [newOpen, setNewOpen] = React.useState(false);
  const [newTitle, setNewTitle] = React.useState("");
  const [newDescription, setNewDescription] = React.useState("");
  const [saving, setSaving] = React.useState(false);

  async function refresh() {
    setLoading(true);
    try {
      const res = await fetch("/api/templates");
      const data: unknown = await res.json();
      if (Array.isArray(data)) setTemplates(data as Template[]);
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    void refresh();
  }, []);

  async function create() {
    const title = newTitle.trim();
    if (!title) {
      push({ type: "error", message: "Template name is required." });
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description: newDescription.trim() || null }),
      });
      const data: any = await res.json();
      if (!res.ok) {
        push({ type: "error", message: data?.error ?? "Failed to create template." });
        return;
      }
      push({ type: "success", message: "Template created." });
      setNewOpen(false);
      setNewTitle("");
      setNewDescription("");
      await refresh();
    } finally {
      setSaving(false);
    }
  }

  async function update(id: string, patch: { title?: string; description?: string | null }) {
    const res = await fetch(`/api/templates/${encodeURIComponent(id)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    const data: any = await res.json();
    if (!res.ok) {
      push({ type: "error", message: data?.error ?? "Failed to update template." });
      return;
    }
    push({ type: "success", message: "Template updated." });
    await refresh();
  }

  async function remove(id: string) {
    if (!window.confirm("Delete this template?")) return;
    const res = await fetch(`/api/templates/${encodeURIComponent(id)}`, { method: "DELETE" });
    const data: any = await res.json();
    if (!res.ok) {
      push({ type: "error", message: data?.error ?? "Failed to delete template." });
      return;
    }
    push({ type: "success", message: "Template deleted." });
    await refresh();
  }

  async function duplicate(t: Template) {
    setSaving(true);
    try {
      const res = await fetch("/api/templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: `${t.title} (Copy)`,
          description: t.description,
        }),
      });
      if (!res.ok) {
        push({ type: "error", message: "Failed to duplicate template." });
        return;
      }
      push({ type: "success", message: "Template duplicated." });
      await refresh();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="Templates"
        subtitle="Create reusable certificate templates for fast issuing."
        action={
          <Button onClick={() => setNewOpen(true)} leftIcon={<Plus className="h-4 w-4" />}>
            New template
          </Button>
        }
      />

      <div className="px-6 py-6">
        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="p-0 overflow-hidden">
                <Skeleton className="h-36 w-full rounded-none" />
                <div className="p-5">
                  <Skeleton className="h-4 w-44" />
                  <Skeleton className="mt-3 h-3 w-56" />
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {templates.map((t) => (
              <Card
                key={t.id}
                className={cn(
                  "p-0 overflow-hidden transition",
                  "hover:shadow-[var(--shadow-md)] hover:scale-[1.02]",
                )}
              >
                <div className="h-36 bg-[var(--bg-secondary)] border-b border-[var(--border)] p-5">
                  <div className="h-full w-full rounded-[var(--radius)] border border-[var(--border)] bg-white flex items-center justify-center">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Layers className="h-4 w-4" />
                      <span className="text-xs font-medium">Preview</span>
                    </div>
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold text-[var(--text-primary)]">
                        {t.title}
                      </div>
                      <div className="mt-1 line-clamp-2 text-sm text-[var(--text-secondary)]">
                        {t.description ?? "—"}
                      </div>
                      <div className="mt-3 text-xs text-[var(--text-muted)]">
                        Last modified: {t.created_at ? new Date(t.created_at).toLocaleDateString() : "—"}
                      </div>
                    </div>

                    <div className="relative">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 px-0"
                        onClick={() => setMenuOpen((v) => (v === t.id ? null : t.id))}
                        aria-label="Open template menu"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>

                      {menuOpen === t.id ? (
                        <div className="absolute right-0 top-9 z-10 w-48 overflow-hidden rounded-[var(--radius)] border border-[var(--border)] bg-white shadow-[var(--shadow-md)]">
                          <button
                            className="w-full px-3 py-2 text-left text-sm hover:bg-slate-50 flex items-center gap-2"
                            onClick={async () => {
                              setMenuOpen(null);
                              const title = window.prompt("Template name", t.title);
                              if (!title) return;
                              const desc = window.prompt("Description (optional)", t.description ?? "") ?? "";
                              await update(t.id, { title, description: desc.trim() || null });
                            }}
                          >
                            <Edit3 className="h-4 w-4 text-slate-500" /> Edit
                          </button>
                          <button
                            className="w-full px-3 py-2 text-left text-sm hover:bg-slate-50 flex items-center gap-2"
                            onClick={async () => {
                              setMenuOpen(null);
                              await duplicate(t);
                            }}
                          >
                            <CopyIcon className="h-4 w-4 text-slate-500" /> Duplicate
                          </button>
                          <button
                            className="w-full px-3 py-2 text-left text-sm hover:bg-red-50 text-red-700 flex items-center gap-2"
                            onClick={async () => {
                              setMenuOpen(null);
                              await remove(t.id);
                            }}
                          >
                            <Trash2 className="h-4 w-4" /> Delete
                          </button>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Modal
        open={newOpen}
        onOpenChange={setNewOpen}
        title="New template"
        description="Create a reusable template for issuing certificates."
        footer={
          <div className="flex items-center justify-end gap-2">
            <Button variant="ghost" onClick={() => setNewOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => void create()} isLoading={saving}>
              Create
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[var(--text-secondary)]">Name</label>
            <input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="focus-ring h-11 w-full rounded-[var(--radius)] border border-[var(--border)] bg-white px-3 text-sm"
              placeholder="e.g. Professional Diploma"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[var(--text-secondary)]">Description</label>
            <textarea
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              className="focus-ring min-h-[96px] w-full rounded-[var(--radius)] border border-[var(--border)] bg-white px-3 py-2 text-sm"
              placeholder="Optional notes…"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}

