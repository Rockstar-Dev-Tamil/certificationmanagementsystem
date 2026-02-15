'use client';

import React from 'react';
import CertificatePreview from '../../components/CertificatePreview';
import { ArrowLeft, ShieldCheck, Globe, Lock } from 'lucide-react';
import Link from 'next/link';

export default function PreviewPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = React.use(params);
    const [cert, setCert] = React.useState<any>(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        fetch('/api/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ certificateId: id })
        })
            .then(res => res.json())
            .then(data => {
                if (data.valid) {
                    setCert(data.data);
                }
                setLoading(false);
            })
            .catch(err => console.error(err));
    }, [id]);

    return (
        <div className="min-h-screen bg-slate-50/50 selection:bg-brand-100">
            {/* Global Preview Header */}
            <div className="bg-white/70 backdrop-blur-xl border-b border-slate-100 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center shadow-lg shadow-brand-200 group-hover:rotate-6 transition-transform">
                            <ShieldCheck className="text-white h-5 w-5" />
                        </div>
                        <span className="text-xl font-black text-slate-900 tracking-tight italic">CertiSafe</span>
                    </Link>

                    <div className="flex items-center gap-6">
                        <div className="hidden md:flex items-center gap-2 px-4 py-1.5 bg-brand-50 rounded-full border border-brand-100">
                            <Lock className="h-3 w-3 text-brand-600" />
                            <span className="text-[10px] font-black text-brand-600 uppercase tracking-widest italic">Encrypted Preview</span>
                        </div>
                        <Link
                            href="/dashboard"
                            className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-black text-xs uppercase tracking-widest transition-colors group"
                        >
                            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                            Return to Console
                        </Link>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="flex flex-col items-center">
                    {loading ? (
                        <div className="flex flex-col items-center gap-4 py-32">
                            <div className="w-12 h-12 bg-white rounded-xl border border-slate-100 flex items-center justify-center animate-spin">
                                <ShieldCheck className="text-brand-600 h-6 w-6" />
                            </div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] italic animate-pulse">Decrypting Visual Data</p>
                        </div>
                    ) : cert ? (
                        <div className="w-full flex justify-center">
                            <CertificatePreview
                                recipientName={cert.profiles?.full_name || 'N/A'}
                                courseTitle={cert.template_name || 'Certificate of Achievement'}
                                certificateId={cert.certificate_id}
                                issueDate={new Date(cert.issue_date).toLocaleDateString()}
                                expiryDate={cert.expiry_date && cert.expiry_date !== 'N/A' ? new Date(cert.expiry_date).toLocaleDateString() : undefined}
                                qrCodeDataUrl={cert.qr_code}
                                dataHash={cert.data_hash}
                            />
                        </div>
                    ) : (
                        <div className="w-full max-w-xl bg-white p-12 rounded-[3rem] border border-rose-100 shadow-2xl text-center">
                            <div className="w-20 h-20 bg-rose-50 rounded-3xl flex items-center justify-center mx-auto mb-8">
                                <Lock className="h-10 w-10 text-rose-500" />
                            </div>
                            <h3 className="text-3xl font-black text-rose-900 tracking-tighter mb-4 italic uppercase">Identity Breach</h3>
                            <p className="text-slate-500 font-medium mb-10 leading-relaxed">
                                The requested Protocol ID does not exist or has been purged from the global ledger. Access is restricted.
                            </p>
                            <Link href="/verify" className="inline-flex items-center bg-slate-900 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all">
                                Back to Search Terminal
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            {/* Background elements */}
            <div className="fixed top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none -z-10"></div>
        </div>
    );
}
