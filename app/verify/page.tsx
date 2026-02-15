'use client';

import React from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { QrCode, Camera, Search, CheckCircle, XCircle } from 'lucide-react';

export default function VerifyPage() {
    const [certificateId, setCertificateId] = React.useState('');
    const [result, setResult] = React.useState<any>(null);
    const [loading, setLoading] = React.useState(false);
    const [showScanner, setShowScanner] = React.useState(false);

    React.useEffect(() => {
        if (showScanner) {
            const scanner = new Html5QrcodeScanner(
                "reader",
                { fps: 10, qrbox: { width: 250, height: 250 } },
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
        <div className="max-w-2xl mx-auto px-4 py-24">
            <div className="glass-card rounded-[2.5rem] p-10 md:p-16 text-center animate-fade-in relative overflow-hidden">
                {/* Background accents */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/5 blur-3xl rounded-full"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-accent-violet/5 blur-3xl rounded-full"></div>

                <div className="w-24 h-24 bg-brand-50 rounded-3xl flex items-center justify-center mx-auto mb-10 shadow-inner group">
                    <QrCode className="h-10 w-10 text-brand-600 group-hover:scale-110 transition-transform duration-500" />
                </div>

                <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Verify Certificate</h2>
                <p className="text-slate-500 mb-12 font-medium">Scan a QR code or enter a Certificate ID below to ensure authenticity.</p>

                <div className="space-y-8 text-left relative z-10">
                    {!showScanner ? (
                        <>
                            <button
                                onClick={() => setShowScanner(true)}
                                className="btn-primary w-full flex items-center justify-center gap-3 text-lg py-5 rounded-2xl"
                            >
                                <Camera className="h-6 w-6" /> Scan with Camera
                            </button>

                            <div className="flex items-center gap-6">
                                <div className="h-px bg-slate-100 flex-1" />
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2 bg-white">OR</span>
                                <div className="h-px bg-slate-100 flex-1" />
                            </div>

                            <div className="relative group">
                                <input
                                    type="text"
                                    value={certificateId}
                                    onChange={(e) => setCertificateId(e.target.value)}
                                    placeholder="Enter Certificate ID"
                                    className="w-full px-8 py-5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white text-lg transition-all"
                                />
                                <button
                                    onClick={() => handleVerify()}
                                    disabled={loading}
                                    className="absolute right-3 top-3 bottom-3 bg-slate-900 text-white px-8 rounded-xl font-black text-sm uppercase tracking-widest transition-all hover:bg-black active:scale-[0.98] disabled:opacity-50"
                                >
                                    {loading ? '...' : 'Verify'}
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center">
                            <div id="reader" className="w-full rounded-2xl overflow-hidden border-2 border-brand-100 shadow-2xl"></div>
                            <button
                                onClick={() => setShowScanner(false)}
                                className="mt-8 text-slate-400 font-bold hover:text-brand-600 transition-colors uppercase text-xs tracking-widest flex items-center gap-2"
                            >
                                <XCircle className="h-4 w-4" /> Cancel Scanning
                            </button>
                        </div>
                    )}
                </div>

                {result && (
                    <div className={`mt-12 p-8 rounded-3xl border animate-fade-in ${result.valid ? 'bg-emerald-50/50 border-emerald-100' : 'bg-rose-50/50 border-rose-100'}`}>
                        {result.valid ? (
                            <div className="text-left">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-emerald-100 rounded-lg">
                                        <CheckCircle className="h-6 w-6 text-emerald-600" />
                                    </div>
                                    <h4 className="text-xl font-black text-emerald-900 tracking-tight">Authenticity Confirmed</h4>
                                </div>
                                <div className="bg-white/50 p-6 rounded-2xl border border-emerald-100 mb-6 font-medium">
                                    <p className="text-emerald-800 leading-relaxed">
                                        This certificate was issued to <strong className="text-emerald-950 underline decoration-emerald-200 underline-offset-4">{result.data.profiles.full_name}</strong> for successfully completing <strong className="text-emerald-950 ">{result.data.template_name}</strong>.
                                    </p>
                                </div>
                                <a href={`/preview/${result.data.certificate_id}`} className="inline-flex items-center bg-emerald-600 text-white px-8 py-3.5 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100">
                                    View Full Record
                                </a>
                            </div>
                        ) : (
                            <div className="text-left">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-rose-100 rounded-lg">
                                        <XCircle className="h-6 w-6 text-rose-600" />
                                    </div>
                                    <h4 className="text-xl font-black text-rose-900 tracking-tight">{result.status === 'revoked' ? 'Credential Revoked' : 'Validation Failed'}</h4>
                                </div>
                                <div className="bg-white/50 p-6 rounded-2xl border border-rose-100 font-medium">
                                    <p className="text-rose-800">{result.status === 'revoked' ? result.revocation_reason : 'No matching record was found for this ID. Please check the credential ID and try again.'}</p>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
