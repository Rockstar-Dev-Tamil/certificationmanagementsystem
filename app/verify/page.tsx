'use client';

import React from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { QrCode, Camera, Search, CheckCircle, XCircle, ShieldCheck, Activity, Database, Lock, Eye, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export default function VerifyPage() {
    const [certificateId, setCertificateId] = React.useState('');
    const [result, setResult] = React.useState<any>(null);
    const [loading, setLoading] = React.useState(false);
    const [showScanner, setShowScanner] = React.useState(false);

    React.useEffect(() => {
        if (showScanner) {
            const scanner = new Html5QrcodeScanner(
                "reader",
                { fps: 20, qrbox: { width: 280, height: 280 } },
                /* verbose= */ false
            );
            scanner.render(onScanSuccess, onScanFailure);

            return () => {
                scanner.clear();
            };
        }
    }, [showScanner]);

    function onScanSuccess(decodedText: string) {
        try {
            const url = new URL(decodedText);
            const id = url.searchParams.get("id");
            if (id) {
                setCertificateId(id);
                setShowScanner(false);
                handleVerify(id);
            }
        } catch (e) {
            console.error("Invalid QR code format");
        }
    }

    function onScanFailure(error: any) { }

    const handleVerify = async (idToVerify?: string) => {
        const id = idToVerify || certificateId;
        if (!id) return;
        setLoading(true);
        setResult(null);

        try {
            const res = await fetch('/api/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ certificateId: id })
            });
            const data = await res.json();
            setResult(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white selection:bg-brand-100 selection:text-brand-900">
            {/* Minimalist Nav */}
            <div className="max-w-7xl mx-auto px-6 py-12 flex justify-between items-center">
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center shadow-lg shadow-brand-200 group-hover:rotate-6 transition-transform">
                        <ShieldCheck className="text-white h-5 w-5" />
                    </div>
                    <span className="text-xl font-black text-slate-900 tracking-tight italic">CertiSafe</span>
                </Link>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest italic">
                        <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse"></div>
                        Live Nodes: Active
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-6 py-12">
                <div className="grid lg:grid-cols-5 gap-12">
                    {/* Left side: Instructions/Context */}
                    <div className="lg:col-span-2 space-y-10 order-2 lg:order-1">
                        <div>
                            <h2 className="text-3xl font-black text-slate-900 tracking-tighter mb-4 italic uppercase">Verification Engine</h2>
                            <p className="text-slate-500 font-medium leading-relaxed">Connect to our global validator nodes to confirm the authenticity of any CertiSafe issuance.</p>
                        </div>

                        <div className="space-y-6">
                            {[
                                { icon: Database, label: "Vault Check", text: "Cross-references with ACID-compliant storage." },
                                { icon: Lock, label: "SHA-256 Auth", text: "Verifies cryptographic hash integrity." },
                                { icon: Activity, label: "Revocation Check", text: "Scans real-time revocation registers." }
                            ].map((item, i) => (
                                <div key={i} className="flex gap-4 group">
                                    <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100 group-hover:bg-brand-50 group-hover:border-brand-100 transition-all">
                                        <item.icon className="h-5 w-5 text-slate-400 group-hover:text-brand-600" />
                                    </div>
                                    <div>
                                        <div className="text-xs font-black text-slate-900 uppercase tracking-widest">{item.label}</div>
                                        <div className="text-[11px] text-slate-400 font-bold italic">{item.text}</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="p-6 bg-slate-900 rounded-[2rem] text-white overflow-hidden relative group">
                            <div className="relative z-10 text-[10px] font-black uppercase tracking-[0.3em] mb-4 text-brand-400 italic">Security Status</div>
                            <div className="relative z-10 text-2xl font-black tracking-tighter mb-2 italic">Standard Passed.</div>
                            <div className="relative z-10 text-slate-400 text-[11px] font-bold">Protocol v2.4.1 Active</div>
                            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-brand-600/20 blur-3xl rounded-full group-hover:bg-brand-600/40 transition-all duration-700"></div>
                        </div>
                    </div>

                    {/* Right side: Functional Component */}
                    <div className="lg:col-span-3 order-1 lg:order-2">
                        <div className="bg-white rounded-[3rem] p-10 lg:p-14 border border-slate-100 shadow-3xl shadow-slate-100 relative overflow-hidden">
                            {/* Background visual element */}
                            <div className="absolute top-0 right-0 p-8">
                                <QrCode className="text-slate-50 h-32 w-32" />
                            </div>

                            <div className="relative z-10">
                                {!showScanner ? (
                                    <>
                                        <div className="mb-12">
                                            <div className="inline-flex items-center px-3 py-1 bg-brand-50 text-brand-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 italic">Validation Hub</div>
                                            <h3 className="text-4xl font-black text-slate-900 tracking-tight leading-tight">Identity <br />Validation.</h3>
                                        </div>

                                        <div className="space-y-6">
                                            <button
                                                onClick={() => setShowScanner(true)}
                                                className="w-full bg-brand-600 text-white p-6 rounded-[1.5rem] font-black text-sm uppercase tracking-widest shadow-2xl shadow-brand-100 hover:bg-brand-700 transition-all flex items-center justify-center gap-4 active:scale-[0.98] group"
                                            >
                                                <Camera className="h-5 w-5 group-hover:scale-110 transition-transform" />
                                                Engage Optical Scanner
                                            </button>

                                            <div className="flex items-center gap-6">
                                                <div className="h-px bg-slate-100 flex-1" />
                                                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Protocol Override</span>
                                                <div className="h-px bg-slate-100 flex-1" />
                                            </div>

                                            <div className="relative group">
                                                <input
                                                    type="text"
                                                    value={certificateId}
                                                    onChange={(e) => setCertificateId(e.target.value)}
                                                    placeholder="Manually Enter Protocol ID"
                                                    className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:bg-white focus:border-brand-500 text-sm font-bold tracking-tight transition-all shadow-inner"
                                                />
                                                <button
                                                    onClick={() => handleVerify()}
                                                    disabled={loading}
                                                    className="absolute right-3 top-3 bottom-3 bg-slate-900 text-white p-3 rounded-xl font-black transition-all hover:bg-black active:scale-[0.95] disabled:opacity-50"
                                                >
                                                    <ArrowRight className={`h-5 w-5 ${loading ? 'animate-pulse' : ''}`} />
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="animate-fade-in">
                                        <div className="flex justify-between items-center mb-8">
                                            <h3 className="font-black text-slate-900 text-xl tracking-tight uppercase italic">Active Scan...</h3>
                                            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse border-2 border-red-200"></div>
                                        </div>
                                        <div id="reader" className="w-full rounded-[2rem] overflow-hidden border-4 border-slate-950 shadow-2xl bg-black aspect-square max-h-[400px]"></div>
                                        <button
                                            onClick={() => setShowScanner(false)}
                                            className="w-full mt-8 py-4 bg-slate-50 text-slate-400 font-black uppercase text-[10px] tracking-[0.2em] rounded-2xl hover:bg-slate-100 transition-all border border-slate-100"
                                        >
                                            Terminate Optical Link
                                        </button>
                                    </div>
                                )}

                                {result && (
                                    <div className={`mt-12 p-8 rounded-[2rem] border-2 animate-fade-in-up ${result.valid ? 'bg-emerald-50/50 border-emerald-100' : 'bg-rose-50/50 border-rose-100 shadow-2xl shadow-rose-100'}`}>
                                        {result.valid ? (
                                            <div className="text-left">
                                                <div className="flex items-center gap-3 mb-6">
                                                    <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200">
                                                        <CheckCircle className="h-6 w-6 text-white" />
                                                    </div>
                                                    <div>
                                                        <h4 className="text-sm font-black text-emerald-900 uppercase tracking-widest italic leading-none">Identity Confirmed</h4>
                                                        <span className="text-[10px] font-bold text-emerald-600 opacity-60">Status: AUTHENTIC-V2</span>
                                                    </div>
                                                </div>
                                                <div className="bg-white/80 p-6 rounded-2xl border border-emerald-100/50 mb-8">
                                                    <p className="text-emerald-950 font-bold leading-relaxed text-sm">
                                                        Verified ownership of <span className="text-emerald-700 italic">"{result.data.template_name}"</span> by <span className="text-emerald-700 italic">{result.data.profiles.full_name}</span> has been confirmed against terminal records.
                                                    </p>
                                                </div>
                                                <Link href={`/preview/${result.data.certificate_id}`} className="flex items-center justify-center gap-3 w-full bg-emerald-500 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-200 active:scale-95 group">
                                                    Full Visual Preview
                                                    <Eye className="h-4 w-4 group-hover:scale-110 transition-transform" />
                                                </Link>
                                            </div>
                                        ) : (
                                            <div className="text-left">
                                                <div className="flex items-center gap-3 mb-6 text-rose-600">
                                                    <div className="w-10 h-10 bg-rose-500 rounded-xl flex items-center justify-center shadow-lg shadow-rose-200">
                                                        <AlertTriangle className="h-6 w-6 text-white" />
                                                    </div>
                                                    <div>
                                                        <h4 className="text-sm font-black text-rose-900 uppercase tracking-widest italic leading-none">{result.status === 'revoked' ? 'Protocol REVOKED' : 'Validation Error'}</h4>
                                                        <span className="text-[10px] font-bold text-rose-600 opacity-60">Status: ACCESS-DENIED</span>
                                                    </div>
                                                </div>
                                                <div className="bg-white/80 p-6 rounded-2xl border border-rose-100/50 font-bold text-sm">
                                                    <p className="text-rose-900 leading-relaxed italic">{result.status === 'revoked' ? result.revocation_reason : 'The provided ID key does not match any current or archived institutional records. Verification aborted.'}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Global system status footer */}
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex gap-8 whitespace-nowrap lg:block hidden">
                <div className="bg-slate-900/5 backdrop-blur-xl border border-slate-100 px-8 py-3 rounded-full flex items-center gap-10">
                    <div className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 bg-brand-500 rounded-full"></div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Hash: SHA-256</span>
                    </div>
                    <div className="h-3 w-px bg-slate-200"></div>
                    <div className="flex items-center gap-3">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Status: Secure Layer L3</span>
                    </div>
                    <div className="h-3 w-px bg-slate-200"></div>
                    <div className="flex items-center gap-3">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Sync: Live</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Reuse icon for consistency
const ArrowRight = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
    </svg>
);
