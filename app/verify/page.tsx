'use client';

import React from 'react';
import { Camera, Search, ChevronRight, ShieldCheck, HelpCircle } from "lucide-react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { VerificationResult } from "@/components/ui/VerificationResult";

type VerifyResponse =
  | { valid: true; data: any }
  | { valid: false; status?: string; revocation_reason?: string; error?: string };

export default function VerifyPage() {
  const [certificateId, setCertificateId] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState<VerifyResponse | null>(null);
  const [showScanner, setShowScanner] = React.useState(false);

  const handleVerify = React.useCallback(async (idToVerify?: string) => {
    const id = (idToVerify ?? certificateId).trim();
    if (!id) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ certificateId: id }),
      });
      const data = (await res.json()) as VerifyResponse;
      setResult(data);
    } finally {
      setLoading(false);
    }
  }, [certificateId]);

  React.useEffect(() => {
    const id = new URLSearchParams(window.location.search).get('id');
    if (!id || id === certificateId) return;
    setCertificateId(id);
    void handleVerify(id);
  }, [certificateId, handleVerify]);

  React.useEffect(() => {
    if (!showScanner) return;
    const scanner = new Html5QrcodeScanner(
      "reader",
      { fps: 20, qrbox: { width: 280, height: 280 } },
      false,
    );
    scanner.render(
      (decodedText: string) => {
        try {
          const url = new URL(decodedText);
          const id = url.searchParams.get("id");
          if (id) {
            setCertificateId(id);
            setShowScanner(false);
            void handleVerify(id);
          } else {
            // Fallback: if text is just the ID
            setCertificateId(decodedText);
            setShowScanner(false);
            void handleVerify(decodedText);
          }
        } catch {
          setCertificateId(decodedText);
          setShowScanner(false);
          void handleVerify(decodedText);
        }
      },
      () => undefined,
    );
    return () => {
      void scanner.clear();
    };
  }, [handleVerify, showScanner]);

  return (
    <div className="min-h-screen bg-white">
      {/* Premium Header */}
      <header className="border-b border-slate-100 py-4 px-6 mb-12">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-brand-600 rounded-lg flex items-center justify-center text-white font-black text-xl">C</div>
            <span className="font-extrabold text-slate-900 tracking-tight text-lg">CertiSafe <span className="text-slate-400 font-medium">Protocol</span></span>
          </div>
          <div className="flex items-center gap-6">
            <button className="text-xs font-bold text-slate-500 hover:text-brand-600 transition-colors flex items-center gap-1">
                <HelpCircle className="h-4 w-4" />
                Help Center
            </button>
            <a href="/login">
                <Button variant="ghost" size="sm" className="font-bold">Institutional UI</Button>
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 pb-20">
        {!result ? (
            <div className="animate-fade-up">
                {/* Hero / Hero Search */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-50 text-brand-700 rounded-full text-[10px] font-black uppercase tracking-widest mb-6">
                        <ShieldCheck className="h-3 w-3" />
                        Public Trust Network
                    </div>
                    <h1 className="text-5xl font-black text-slate-900 tracking-tighter mb-4">Validate Credentials</h1>
                    <p className="text-lg text-slate-500 font-medium max-w-xl mx-auto">
                        Verify the authenticity of digital certificates issued through the CertiSafe protocol in real-time.
                    </p>
                </div>

                <div className="max-w-2xl mx-auto">
                    <Card padding="lg" className="shadow-2xl shadow-brand-100/50 border-brand-100 overflow-visible relative">
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-white border border-brand-100 rounded-full shadow-sm text-[10px] font-black uppercase text-brand-600 tracking-widest">
                            Search Gateway
                        </div>

                        <div className="space-y-6">
                            <div className="relative group">
                                <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-brand-600 transition-colors" />
                                <input
                                    type="text"
                                    value={certificateId}
                                    onChange={(e) => setCertificateId(e.target.value)}
                                    placeholder="Enter Institutional ID Key..."
                                    className="w-full pl-14 pr-32 py-5 bg-slate-50 border border-transparent rounded-2xl text-lg font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:bg-white focus:border-brand-200 transition-all shadow-inner"
                                    onKeyDown={(e) => e.key === 'Enter' && void handleVerify()}
                                />
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                    <kbd className="hidden sm:inline-flex h-7 items-center gap-1 rounded border border-slate-200 bg-white px-2 font-mono text-[10px] font-bold text-slate-400">
                                        <span className="text-xs">↵</span> Enter
                                    </kbd>
                                    <Button 
                                        variant="primary" 
                                        size="md" 
                                        className="rounded-xl shadow-lg shadow-brand-200"
                                        onClick={() => void handleVerify()}
                                        isLoading={loading}
                                    >
                                        Verify
                                    </Button>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 py-2">
                                <div className="h-px bg-slate-100 flex-1"></div>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">OR</span>
                                <div className="h-px bg-slate-100 flex-1"></div>
                            </div>

                            <Button 
                                variant="outline" 
                                size="lg" 
                                className="w-full rounded-2xl border-slate-200 hover:border-brand-200 hover:bg-brand-50 group py-6"
                                onClick={() => setShowScanner(!showScanner)}
                                leftIcon={<Camera className="h-5 w-5 text-slate-400 group-hover:text-brand-600 transition-colors" />}
                            >
                                {showScanner ? "Deactivate Visual Scanner" : "Scan Cryptographic QR"}
                            </Button>

                            {showScanner && (
                                <div className="mt-8 overflow-hidden rounded-2xl border-4 border-slate-100 bg-black">
                                    <div id="reader" className="w-full" />
                                </div>
                            )}
                        </div>
                    </Card>

                    <div className="mt-12 grid grid-cols-3 gap-6">
                        <div className="text-center">
                            <div className="text-2xl font-black text-slate-900 leading-none mb-1">200k+</div>
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Verified Assets</div>
                        </div>
                        <div className="text-center border-x border-slate-100">
                            <div className="text-2xl font-black text-slate-900 leading-none mb-1">99.9%</div>
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Uptime Record</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-black text-slate-900 leading-none mb-1">SHA-256</div>
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Security Std</div>
                        </div>
                    </div>
                </div>
            </div>
        ) : (
            <div className="max-w-4xl mx-auto">
                {"valid" in result && result.valid ? (
                    <VerificationResult 
                        isValid={true} 
                        data={{
                            certificate_id: result.data.certificate_id,
                            recipient_name: result.data.profiles?.full_name || "Unknown",
                            recipient_email: result.data.profiles?.email || "Unknown",
                            template_name: result.data.template_name || "Standard Certificate",
                            issue_date: result.data.issue_date,
                            expiry_date: result.data.expiry_date,
                            data_hash: result.data.data_hash || "HASHNOTFOUND8372"
                        }}
                    />
                ) : (
                    <VerificationResult 
                        isValid={false}
                        status={result.status}
                        revocationReason={result.revocation_reason}
                        error={result.error}
                    />
                )}
                
                <div className="mt-12 flex justify-center">
                    <button 
                        onClick={() => {
                            setResult(null);
                            setCertificateId("");
                        }}
                        className="flex items-center gap-2 text-slate-400 hover:text-slate-900 font-bold transition-all group"
                    >
                        <ChevronRight className="h-4 w-4 rotate-180 group-hover:-translate-x-1 transition-transform" />
                        Verification Gateway
                    </button>
                </div>
            </div>
        )}
      </main>

      {/* Footer Branding */}
      <footer className="fixed bottom-8 left-1/2 -translate-x-1/2 opacity-30 pointer-events-none">
        <div className="flex items-center gap-2 grayscale">
            <div className="h-6 w-6 bg-slate-900 rounded flex items-center justify-center text-white font-black text-sm">C</div>
            <span className="font-bold text-slate-900 tracking-tight text-sm uppercase tracking-widest">CertiSafe Protocol Internal v2.5.0-alpha</span>
        </div>
      </footer>
    </div>
  );
}
