"use client";

import * as React from "react";
import { Save, ShieldCheck } from "lucide-react";

import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { useToast } from "@/components/ui/Toast";

type SettingsMap = Record<string, string | null>;

const keys = {
  orgName: "org.name",
  orgLogoUrl: "org.logo_url",
  orgContactEmail: "org.contact_email",
  defaultExpiryDays: "cert.default_expiry_days",
  defaultTemplateId: "cert.default_template_id",
  notifyOnIssue: "email.notify_on_issue",
  notifyOnExpiryWarning: "email.notify_on_expiry_warning",
  jwtExpiry: "security.jwt_expiry",
  allowedDomains: "security.allowed_domains",
} as const;

export default function SettingsPage() {
  const { push } = useToast();
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [settings, setSettings] = React.useState<SettingsMap>({});

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/settings");
      const data: any = await res.json();
      if (!res.ok) {
        push({ type: "error", message: data?.error ?? "Failed to load settings." });
        return;
      }
      setSettings((data?.settings ?? {}) as SettingsMap);
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function setKey(k: string, v: string | null) {
    setSettings((p) => ({ ...p, [k]: v }));
  }

  async function save() {
    setSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const data: any = await res.json();
      if (!res.ok) {
        push({ type: "error", message: data?.error ?? "Failed to save settings." });
        return;
      }
      push({ type: "success", message: "Settings saved." });
      await load();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="Settings"
        subtitle="Configure organization defaults, notifications, and security."
        action={
          <Button onClick={() => void save()} isLoading={saving} leftIcon={<Save className="h-4 w-4" />}>
            Save changes
          </Button>
        }
      />

      <div className="px-6 py-6 space-y-6">
        {loading ? (
          <Card className="p-6">
            <div className="text-sm text-[var(--text-muted)]">Loading…</div>
          </Card>
        ) : (
          <>
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-[var(--text-primary)]">Organization info</div>
                  <div className="mt-1 text-sm text-[var(--text-secondary)]">
                    Basic branding and contact details.
                  </div>
                </div>
                <Badge variant="info">Org</Badge>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-12">
                <div className="md:col-span-5 space-y-1.5">
                  <label className="text-sm font-medium text-[var(--text-secondary)]">Name</label>
                  <input
                    value={settings[keys.orgName] ?? ""}
                    onChange={(e) => setKey(keys.orgName, e.target.value)}
                    className="focus-ring h-11 w-full rounded-[var(--radius)] border border-[var(--border)] bg-white px-3 text-sm"
                    placeholder="Your organization"
                  />
                </div>
                <div className="md:col-span-4 space-y-1.5">
                  <label className="text-sm font-medium text-[var(--text-secondary)]">Contact email</label>
                  <input
                    value={settings[keys.orgContactEmail] ?? ""}
                    onChange={(e) => setKey(keys.orgContactEmail, e.target.value)}
                    className="focus-ring h-11 w-full rounded-[var(--radius)] border border-[var(--border)] bg-white px-3 text-sm"
                    placeholder="support@org.edu"
                  />
                </div>
                <div className="md:col-span-3 space-y-1.5">
                  <label className="text-sm font-medium text-[var(--text-secondary)]">Logo URL</label>
                  <input
                    value={settings[keys.orgLogoUrl] ?? ""}
                    onChange={(e) => setKey(keys.orgLogoUrl, e.target.value)}
                    className="focus-ring h-11 w-full rounded-[var(--radius)] border border-[var(--border)] bg-white px-3 text-sm"
                    placeholder="https://…"
                  />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-[var(--text-primary)]">Certificate defaults</div>
                  <div className="mt-1 text-sm text-[var(--text-secondary)]">
                    Default expiry and template settings.
                  </div>
                </div>
                <Badge variant="neutral">Defaults</Badge>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-12">
                <div className="md:col-span-4 space-y-1.5">
                  <label className="text-sm font-medium text-[var(--text-secondary)]">
                    Default expiry period (days)
                  </label>
                  <input
                    type="number"
                    value={settings[keys.defaultExpiryDays] ?? ""}
                    onChange={(e) => setKey(keys.defaultExpiryDays, e.target.value)}
                    className="focus-ring h-11 w-full rounded-[var(--radius)] border border-[var(--border)] bg-white px-3 text-sm"
                    placeholder="365"
                  />
                </div>
                <div className="md:col-span-8 space-y-1.5">
                  <label className="text-sm font-medium text-[var(--text-secondary)]">Default template ID</label>
                  <input
                    value={settings[keys.defaultTemplateId] ?? ""}
                    onChange={(e) => setKey(keys.defaultTemplateId, e.target.value)}
                    className="focus-ring h-11 w-full rounded-[var(--radius)] border border-[var(--border)] bg-white px-3 text-sm font-mono"
                    placeholder="uuid…"
                  />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-[var(--text-primary)]">Email notifications</div>
                  <div className="mt-1 text-sm text-[var(--text-secondary)]">
                    Toggle when the system sends notifications.
                  </div>
                </div>
                <Badge variant="info">Email</Badge>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {[
                  { k: keys.notifyOnIssue, label: "Notify on issue" },
                  { k: keys.notifyOnExpiryWarning, label: "Notify on expiry warning" },
                ].map((opt) => {
                  const enabled = (settings[opt.k] ?? "false") === "true";
                  return (
                    <button
                      key={opt.k}
                      type="button"
                      className="focus-ring flex items-center justify-between rounded-[var(--radius)] border border-[var(--border)] bg-white p-4 text-left hover:bg-slate-50"
                      onClick={() => setKey(opt.k, enabled ? "false" : "true")}
                    >
                      <div>
                        <div className="text-sm font-medium text-[var(--text-primary)]">{opt.label}</div>
                        <div className="mt-1 text-xs text-[var(--text-muted)]">
                          {enabled ? "Enabled" : "Disabled"}
                        </div>
                      </div>
                      <span
                        className={`h-6 w-11 rounded-full border transition ${enabled ? "bg-[var(--accent)] border-[var(--accent)]" : "bg-slate-100 border-[var(--border)]"}`}
                      >
                        <span
                          className={`block h-5 w-5 rounded-full bg-white shadow-sm transition translate-y-0.5 ${enabled ? "translate-x-[22px]" : "translate-x-0.5"}`}
                        />
                      </span>
                    </button>
                  );
                })}
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-start gap-3">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-[var(--accent-light)] text-[var(--accent)]">
                    <ShieldCheck className="h-5 w-5" />
                  </span>
                  <div>
                    <div className="text-sm font-semibold text-[var(--text-primary)]">Security</div>
                    <div className="mt-1 text-sm text-[var(--text-secondary)]">
                      JWT expiry and allowed domains.
                    </div>
                  </div>
                </div>
                <Badge variant="warning">Sensitive</Badge>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-12">
                <div className="md:col-span-4 space-y-1.5">
                  <label className="text-sm font-medium text-[var(--text-secondary)]">JWT expiry</label>
                  <input
                    value={settings[keys.jwtExpiry] ?? ""}
                    onChange={(e) => setKey(keys.jwtExpiry, e.target.value)}
                    className="focus-ring h-11 w-full rounded-[var(--radius)] border border-[var(--border)] bg-white px-3 text-sm"
                    placeholder="e.g. 7d"
                  />
                </div>
                <div className="md:col-span-8 space-y-1.5">
                  <label className="text-sm font-medium text-[var(--text-secondary)]">Allowed domains</label>
                  <input
                    value={settings[keys.allowedDomains] ?? ""}
                    onChange={(e) => setKey(keys.allowedDomains, e.target.value)}
                    className="focus-ring h-11 w-full rounded-[var(--radius)] border border-[var(--border)] bg-white px-3 text-sm"
                    placeholder="comma-separated (e.g. org.edu, partner.com)"
                  />
                </div>
              </div>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}

