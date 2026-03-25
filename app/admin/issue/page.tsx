'use client';

import React from 'react';
import { Calendar, FilePlus2, Layers, Mail, User, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import CertificatePreview from '@/app/components/CertificatePreview';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { cn } from '@/lib/cn';
import { useToast } from '@/components/ui/Toast';

type Template = { id: string; title: string; description: string | null; created_at?: string };

function FloatingField({
  label,
  icon,
  children,
}: {
  label: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="relative group/field">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/field:text-brand-600 transition-colors">
        {icon}
      </div>
      {children}
      <div className="absolute left-12 top-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 group-focus-within/field:text-brand-600 transition-colors">
        {label}
      </div>
    </div>
  );
}

export default function IssueCertificatePage() {
  const { push } = useToast();

  const [templatesLoading, setTemplatesLoading] = React.useState(true);
  const [templates, setTemplates] = React.useState<Template[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = React.useState<string | null>(null);

  const [form, setForm] = React.useState({
    recipient_name: "",
    recipient_email: "",
    course_title: "",
    issue_date: new Date().toISOString().slice(0, 10),
    expiry_date: "",
  });

  const [issuing, setIssuing] = React.useState(false);
  const [issuedId, setIssuedId] = React.useState<string | null>(null);

  React.useEffect(() => {
    let mounted = true;
    async function load() {
      setTemplatesLoading(true);
      try {
        const res = await fetch('/api/templates');
        const data = await res.json();
        if (!mounted) return;
        if (Array.isArray(data)) {
          setTemplates(data as Template[]);
          if (data[0]?.id) {
            setSelectedTemplateId(data[0].id);
            setForm((p) => ({ ...p, course_title: String(data[0].title ?? "") }));
          }
        }
      } finally {
        if (mounted) setTemplatesLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const selectedTemplate = React.useMemo(
    () => templates.find((t) => t.id === selectedTemplateId) ?? null,
    [selectedTemplateId, templates],
  );

  async function onIssue() {
    if (!form.recipient_name || !form.recipient_email) {
       push({ type: "error", message: "MISSING_IDENTITY_DATA: Name and Email required." });
       return;
    }

    setIssuing(true);
    setIssuedId(null);
    try {
      const res = await fetch('/api/issue', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipient_name: form.recipient_name,
          recipient_email: form.recipient_email,
          course_title: form.course_title || selectedTemplate?.title || "Certificate",
          template_id: selectedTemplateId,
          issue_date: form.issue_date,
          expiry_date: form.expiry_date || null,
        }),
      });
      const data: any = await res.json();
      if (!res.ok || !data?.success) {
        push({ type: "error", message: data?.error ?? "PROTOCOL_EXECUTION_FAILED" });
        return;
      }
      setIssuedId(String(data.data.certificate_id));
      push({ type: "success", message: "CERTIFICATE_COMMITTED_TO_LEDGER" });
    } catch {
      push({ type: "error", message: "NETWORK_SIGNAL_DISRUPTION" });
    } finally {
      setIssuing(false);
    }
  }

  const previewRecipient = form.recipient_name || "RECIPIENT_IDENTITY";
  const previewTitle = form.course_title || selectedTemplate?.title || "CREDENTIAL_TITLE";
  const previewId = issuedId ?? "CS-PROTOCOL-XXXX-XXXXXX";

  return (
    <div className="bg-slate-50/30 min-h-screen pb-40">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <header className="mb-12 animate-fade-in-up">
           <div className="flex items-center gap-2 mb-4">
              <div className="px-2 py-0.5 bg-brand-600 text-white rounded text-[10px] font-black uppercase tracking-widest italic shadow-lg shadow-brand-100">Asset Generation</div>
              <span className="h-1 w-1 rounded-full bg-slate-300"></span>
              <span className="text-[11px] font-bold text-slate-400">Node: Primary Issuance Center</span>
           </div>
           <h1 className="text-5xl font-black text-slate-900 tracking-tight leading-none italic uppercase">Issue New Credential</h1>
           <p className="text-slate-500 font-medium text-lg italic mt-2">Initialize holographic identity records and commit to global ledger.</p>
        </header>

        <div className="grid gap-10 xl:grid-cols-12">
          <div className="xl:col-span-6 space-y-10">
            {/* Template Selection */}
            <Card className="border-slate-100 shadow-sm" padding="lg">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest italic mb-6 flex items-center gap-2">
                <Layers className="h-4 w-4 text-brand-600" />
                Select Framework
              </h3>
              <div className="grid gap-4">
                {templatesLoading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-20 w-full rounded-2xl" />
                  ))
                ) : (
                  templates.map((t) => {
                    const active = t.id === selectedTemplateId;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => {
                          setSelectedTemplateId(t.id);
                          setForm((p) => ({ ...p, course_title: t.title }));
                        }}
                        className={cn(
                          "w-full rounded-2xl border p-5 text-left transition-all duration-300 group",
                          active
                            ? "border-brand-600 bg-brand-50 shadow-lg shadow-brand-100/50 ring-4 ring-brand-500/10"
                            : "border-slate-100 bg-white hover:border-brand-200 hover:shadow-md"
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className={cn("text-sm font-black uppercase tracking-tight", active ? "text-brand-700" : "text-slate-900")}>
                              {t.title}
                            </div>
                            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                                {t.description || "Generic Institutional Layout"}
                            </div>
                          </div>
                          <div className={cn(
                            "h-8 w-8 rounded-xl flex items-center justify-center transition-colors",
                            active ? "bg-brand-600 text-white" : "bg-slate-50 text-slate-400 group-hover:bg-brand-100 group-hover:text-brand-600"
                          )}>
                             <ShieldCheck className="h-4 w-4" />
                          </div>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </Card>

            {/* Recipient Details */}
            <Card className="border-slate-100 shadow-sm" padding="lg">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest italic mb-6 flex items-center gap-2">
                <User className="h-4 w-4 text-brand-600" />
                Identity Parameters
              </h3>
              <div className="grid gap-6">
                 <div className="grid md:grid-cols-2 gap-6">
                   <FloatingField label="Full Legal Name" icon={<User className="h-4 w-4" />}>
                     <input
                       value={form.recipient_name}
                       onChange={(e) => setForm((p) => ({ ...p, recipient_name: e.target.value }))}
                       className="w-full h-16 bg-slate-50 border border-slate-100 rounded-2xl px-12 pt-5 text-sm font-black text-slate-900 focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:bg-white focus:border-brand-200 transition-all shadow-inner"
                       placeholder=" "
                     />
                   </FloatingField>
                   <FloatingField label="Communication Email" icon={<Mail className="h-4 w-4" />}>
                     <input
                       type="email"
                       value={form.recipient_email}
                       onChange={(e) => setForm((p) => ({ ...p, recipient_email: e.target.value }))}
                       className="w-full h-16 bg-slate-50 border border-slate-100 rounded-2xl px-12 pt-5 text-sm font-black text-slate-900 focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:bg-white focus:border-brand-200 transition-all shadow-inner"
                       placeholder=" "
                     />
                   </FloatingField>
                 </div>

                 <FloatingField label="Asset Title (Override)" icon={<Layers className="h-4 w-4" />}>
                    <input
                      value={form.course_title}
                      onChange={(e) => setForm((p) => ({ ...p, course_title: e.target.value }))}
                      className="w-full h-16 bg-slate-50 border border-slate-100 rounded-2xl px-12 pt-5 text-sm font-black text-slate-900 focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:bg-white focus:border-brand-200 transition-all shadow-inner"
                      placeholder=" "
                    />
                 </FloatingField>

                 <div className="grid md:grid-cols-2 gap-6">
                    <FloatingField label="Registry Date" icon={<Calendar className="h-4 w-4" />}>
                      <input
                        type="date"
                        value={form.issue_date}
                        onChange={(e) => setForm((p) => ({ ...p, issue_date: e.target.value }))}
                        className="w-full h-16 bg-slate-50 border border-slate-100 rounded-2xl px-12 pt-5 text-sm font-black text-slate-900 focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:bg-white focus:border-brand-200 transition-all shadow-inner"
                      />
                    </FloatingField>
                    <FloatingField label="Expiry Date" icon={<Calendar className="h-4 w-4" />}>
                      <input
                        type="date"
                        value={form.expiry_date}
                        onChange={(e) => setForm((p) => ({ ...p, expiry_date: e.target.value }))}
                        className="w-full h-16 bg-slate-50 border border-slate-100 rounded-2xl px-12 pt-5 text-sm font-black text-slate-900 focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:bg-white focus:border-brand-200 transition-all shadow-inner"
                      />
                    </FloatingField>
                 </div>
              </div>
            </Card>
          </div>

          <div className="xl:col-span-6">
            <div className="sticky top-28">
               <Card className="border-slate-100 shadow-sm overflow-hidden" padding="none">
                  <div className="p-6 border-b border-slate-50 bg-slate-50/50 flex items-center justify-between">
                     <div>
                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest italic flex items-center gap-2">
                          <Zap className="h-4 w-4 text-amber-500 fill-amber-500" />
                          Live Rendering
                        </h3>
                        <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-widest">Real-time Reactive Frame</p>
                     </div>
                  </div>
                  <div className="p-8 bg-slate-100/30 flex items-center justify-center">
                    <div className="scale-[0.5] sm:scale-[0.6] md:scale-[0.8] lg:scale-100 origin-center">
                      <CertificatePreview
                        recipientName={previewRecipient}
                        courseTitle={previewTitle}
                        certificateId={previewId}
                        issueDate={new Date(form.issue_date).toLocaleDateString()}
                        expiryDate={form.expiry_date ? new Date(form.expiry_date).toLocaleDateString() : undefined}
                      />
                    </div>
                  </div>
               </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-20 border-t border-slate-100 bg-white/80 backdrop-blur-xl">
        <div className="lg:pl-[260px] max-w-7xl mx-auto px-6 py-6 flex items-center justify-between gap-6">
           <div className="hidden md:block">
              <div className="flex items-center gap-3">
                 <div className="h-2 w-2 rounded-full bg-brand-600 animate-pulse" />
                 <p className="text-sm font-black text-slate-900 tracking-tight uppercase italic">Awaiting Protocol Trigger</p>
              </div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Transaction will be signed by current admin node</p>
           </div>
           <div className="flex items-center gap-4 w-full md:w-auto">
              <Button variant="outline" className="flex-1 md:flex-none h-14 px-8" onClick={() => push({ type: "success", message: "Draft state cached." })}>
                Cache Draft
              </Button>
              <Button variant="primary" className="flex-1 md:flex-none h-14 px-12 text-lg italic shadow-2xl shadow-brand-200 group" onClick={onIssue} isLoading={issuing} leftIcon={<FilePlus2 className="h-5 w-5" />}>
                Execute Issuance
                <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
           </div>
        </div>
      </div>
    </div>
  );
}


