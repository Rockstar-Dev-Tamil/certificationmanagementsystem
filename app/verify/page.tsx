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
        <div className="max-w-2xl mx-auto px-4 py-20">
            <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 md:p-12 text-center">
                <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-8">
                    <QrCode className="h-10 w-10 text-blue-600" />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 mb-4">Verify Certificate</h2>
                <p className="text-slate-500 mb-10">Scan a QR code or enter a Certificate ID below.</p>

                <div className="space-y-6 text-left">
                    {!showScanner ? (
                        <>
                            <button
                                onClick={() => setShowScanner(true)}
                                className="w-full flex items-center justify-center gap-3 bg-blue-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all"
                            >
                                <Camera className="h-6 w-6" /> Scan with Camera
                            </button>

                            <div className="flex items-center gap-4">
                                <div className="h-px bg-slate-100 flex-1" />
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">OR</span>
                                <div className="h-px bg-slate-100 flex-1" />
                            </div>

                            <div className="relative">
                                <input
                                    type="text"
                                    value={certificateId}
                                    onChange={(e) => setCertificateId(e.target.value)}
                                    placeholder="Enter Certificate ID"
                                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                                />
                                <button
                                    onClick={() => handleVerify()}
                                    disabled={loading}
                                    className="absolute right-2 top-2 bottom-2 bg-slate-900 text-white px-6 rounded-xl font-bold transition-all disabled:opacity-50"
                                >
                                    {loading ? '...' : 'Verify'}
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center">
                            <div id="reader" className="w-full rounded-2xl overflow-hidden border-2 border-slate-200"></div>
                            <button
                                onClick={() => setShowScanner(false)}
                                className="mt-4 text-slate-500 font-bold hover:text-slate-900 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    )}
                </div>

                {result && (
                    <div className={`mt-8 p-6 rounded-2xl border ${result.valid ? 'bg-emerald-50 border-emerald-100' : 'bg-rose-50 border-rose-100'}`}>
                        {result.valid ? (
                            <div className="text-left">
                                <div className="flex items-center gap-2 mb-2">
                                    <CheckCircle className="h-5 w-5 text-emerald-600" />
                                    <h4 className="font-bold text-emerald-900">Valid Certificate</h4>
                                </div>
                                <p className="text-sm text-emerald-800 mb-4">Issued to <strong>{result.data.profiles.full_name}</strong> for {result.data.template_name}.</p>
                                <a href={`/preview/${result.data.certificate_id}`} className="inline-block bg-emerald-600 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-emerald-700">View Full Record</a>
                            </div>
                        ) : (
                            <div className="text-left">
                                <div className="flex items-center gap-2 mb-2">
                                    <XCircle className="h-5 w-5 text-rose-600" />
                                    <h4 className="font-bold text-rose-900">{result.status === 'revoked' ? 'Revoked' : 'Not Found'}</h4>
                                </div>
                                <p className="text-sm text-rose-800">{result.status === 'revoked' ? result.revocation_reason : 'No record found for this ID.'}</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
