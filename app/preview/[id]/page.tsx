'use client';

import React from 'react';
import Link from 'next/link';
import {
  Download,
  Minus,
  Plus,
  Share2,
  ShieldAlert,
  ShieldCheck,
  ArrowLeft,
  Calendar,
  User,
  Hash,
  Activity,
  Trash2,
} from 'lucide-react';

import CertificatePreview from '@/app/components/CertificatePreview';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useToast } from '@/components/ui/Toast';
import { cn } from '@/lib/cn';

export default function PreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { push } = useToast();
  const [id, setId] = React.useState<string>('');
  const [cert, setCert] = React.useState<any | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [zoom, setZoom] = React.useState(1);
  const [userRole, setUserRole] = React.useState<string | null>(null);

  React.useEffect(() => {
    let mounted = true;

    async function load() {
      const resolved = await params;
      if (!mounted) return;

      setId(resolved.id);
      setLoading(true);

      try {
        const [userResponse, verifyResponse] = await Promise.all([
          fetch('/api/auth/user').then((r) => r.json()),
          fetch('/api/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ certificateId: resolved.id }),
          }).then((r) => r.json()),
        ]);

        if (!mounted) return;
        setUserRole(userResponse.user?.role ?? null);
        setCert(verifyResponse?.data ?? null);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    void load();
    return () => {
      mounted = false;
    };
  }, [params]);

  async function copyShareLink() {
    const url = `${window.location.origin}/verify?id=${encodeURIComponent(id)}`;
    await navigator.clipboard.writeText(url);
    push({ type: 'success', message: 'Share link copied to clipboard.' });
  }

  async function revoke() {
    const reason = window.prompt('Security Protocol: Specify revocation reason (Auditable)');
    if (!reason) return;

    const res = await fetch('/api/revoke', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ certificateId: id, reason }),
    });

    if (res.ok) {
      push({ type: 'success', message: 'Credential revoked successfully.' });
      window.location.reload();
      return;
    }

    const data = await res.json().catch(() => null);
    push({ type: 'error', message: data?.error ?? 'Failed to revoke credential.' });
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-white">
        <div className="h-2 w-48 bg-slate-100 rounded-full overflow-hidden mb-4 shadow-inner">
          <div className="h-full bg-brand-600 animate-progress origin-left" />
        </div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] animate-pulse">Initializing Holographic Data...</p>
      </div>
    );
  }

  const metadata = [
    { label: 'Identity Hash', value: cert?.profiles?.full_name || '-', icon: User },
    { label: 'Framework', value: cert?.template_name || 'Standard', icon: Activity },
    { label: 'Issuance Node', value: cert?.issue_date ? new Date(cert.issue_date).toLocaleDateString() : '-', icon: Calendar },
    { label: 'Status', value: cert?.status || '-', icon: ShieldCheck, isStatus: true },
  ];

  return (
    <div className="bg-slate-50/30 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="animate-fade-in-up">
          <Link href="/verify" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-brand-600 transition-colors mb-6 group">
            <ArrowLeft className="h-3 w-3 group-hover:-translate-x-1 transition-transform" />
            Back to Terminal
          </Link>
          <h1 className="text-5xl font-black text-slate-900 tracking-tight leading-none mb-2 italic uppercase">Credential Preview</h1>
          <p className="text-slate-500 font-medium text-lg italic uppercase">Immutable Validation State Interface.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={copyShareLink} leftIcon={<Share2 className="h-4 w-4" />}>
            Share Terminal
          </Button>
          {userRole === 'admin' && cert?.status === 'valid' && (
            <Button variant="outline" className="text-rose-600 hover:bg-rose-50 border-rose-100" onClick={revoke} leftIcon={<Trash2 className="h-4 w-4" />}>
              Revoke Protocol
            </Button>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-20">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <Card className="overflow-visible border-slate-100 shadow-sm" padding="none">
              <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest italic">Live Content Rendering</span>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
                    className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-slate-900 transition-colors"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="text-[11px] font-black text-slate-400 w-10 text-center uppercase">{Math.round(zoom * 100)}%</span>
                  <button
                    onClick={() => setZoom(Math.min(1.2, zoom + 0.1))}
                    className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-slate-900 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="p-10 bg-slate-100/50 flex justify-center">
                {cert ? (
                  <div style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }} className="transition-transform duration-300">
                    <CertificatePreview
                      recipientName={cert.profiles?.full_name || 'N/A'}
                      courseTitle={cert.template_name || 'Credential'}
                      certificateId={cert.certificate_id}
                      issueDate={new Date(cert.issue_date).toLocaleDateString()}
                      expiryDate={cert.expiry_date ? new Date(cert.expiry_date).toLocaleDateString() : undefined}
                      qrCodeDataUrl={cert.qr_code}
                      dataHash={cert.data_hash}
                    />
                  </div>
                ) : (
                  <div className="py-40 flex flex-col items-center">
                    <ShieldAlert className="h-16 w-16 text-slate-200 mb-6" />
                    <p className="text-sm font-black text-slate-300 uppercase tracking-widest italic">Signal Lost: Data Registry Empty</p>
                  </div>
                )}
              </div>
            </Card>
          </div>

          <div className="lg:col-span-4 space-y-8">
            <Card className="border-slate-100 shadow-sm" padding="lg">
              <h3 className="text-lg font-black text-slate-900 mb-8 tracking-tight uppercase italic flex items-center gap-3">
                <Hash className="h-5 w-5 text-brand-600" />
                Registry Intelligence
              </h3>

              <div className="space-y-6">
                {metadata.map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center shrink-0 border border-slate-100">
                      <item.icon className="h-4 w-4 text-slate-400" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 italic">{item.label}</p>
                      <p
                        className={cn(
                          'text-sm font-black text-slate-900 uppercase tracking-tight',
                          item.isStatus && item.value === 'valid' ? 'text-emerald-600' : '',
                          item.isStatus && item.value === 'revoked' ? 'text-rose-600' : '',
                        )}
                      >
                        {item.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="bg-slate-900 text-white border-transparent shadow-2xl overflow-hidden relative" padding="lg">
              <div className="relative z-10">
                <h3 className="text-lg font-black mb-6 tracking-tight uppercase italic flex items-center gap-3 text-brand-400">
                  <Download className="h-5 w-5" />
                  Terminal Actions
                </h3>
                <div className="grid gap-3">
                  <Button variant="primary" className="w-full h-14 bg-white text-slate-900 hover:bg-white/90" onClick={() => push({ type: 'info', message: 'Use the Export button on the document for PDF.' })}>
                    Export Asset (PDF)
                  </Button>
                  <Button variant="outline" className="w-full h-14 border-white/10 text-white hover:bg-white/5" onClick={copyShareLink}>
                    Copy Public URL
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full text-slate-400 hover:text-white"
                    onClick={() => {
                      navigator.clipboard.writeText(id);
                      push({ type: 'success', message: 'ID copied to terminal buffer.' });
                    }}
                  >
                    Buffer ID to Clipboard
                  </Button>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-40 h-40 bg-brand-600/20 blur-[60px] rounded-full translate-x-1/2 -translate-y-1/2" />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
