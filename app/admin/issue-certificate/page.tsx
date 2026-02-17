'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle, Loader2, Award, Mail, Calendar, Layout, ShieldCheck, Zap } from 'lucide-react';

export default function IssueCertificatePage() {
    const router = useRouter();
    const [loading, setLoading] = React.useState(false);
    const [success, setSuccess] = React.useState<string | null>(null);

    const [formData, setFormData] = React.useState({
        recipient_name: '',
        recipient_email: '',
        course_title: '',
        expiry_date: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setSuccess(null);

        try {
            const res = await fetch('/api/issue', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (res.ok) {
                setSuccess(data.data.certificate_id);
                setFormData({ recipient_name: '', recipient_email: '', course_title: '', expiry_date: '' });
            } else {
                alert(data.error || 'Failed to issue certificate');
            }
        } catch (err) {
            console.error(err);
            alert('An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white selection:bg-brand-100">
            <div className="max-w-4xl mx-auto px-6 py-12 lg:py-20">
                <button
                    onClick={() => router.back()}
                    className="mb-12 flex items-center gap-2 text-slate-400 hover:text-slate-900 font-black text-xs uppercase tracking-widest transition-all group"
                >
                    <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                    Return to Console
                </button>

                <div className="grid lg:grid-cols-5 gap-16">
                    <div className="lg:col-span-2 space-y-10">
                        <div className="animate-fade-in-up">
                            <div className="inline-flex items-center px-3 py-1 bg-brand-50 text-brand-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 italic">Issuance Terminal</div>
                            <h2 className="text-4xl font-black text-slate-900 tracking-tighter leading-tight mb-6">Provision New <br />Achievement.</h2>
                            <p className="text-slate-500 font-medium leading-relaxed">
                                Authorize and sign a cryptographically secure credential. This action will be permanently recorded in the institutional ledger.
                            </p>
                        </div>

                        <div className="p-8 bg-slate-900 rounded-[2.5rem] text-white overflow-hidden relative group hidden lg:block">
                            <div className="relative z-10">
                                <Zap className="text-brand-400 mb-6 h-8 w-8" />
                                <h3 className="text-xl font-black mb-4 tracking-tight">Security Protocol</h3>
                                <ul className="space-y-4">
                                    {[
                                        "SHA-256 Hashing Enabled",
                                        "Identity Verification Required",
                                        "Immutable Record Generation"
                                    ].map((text, i) => (
                                        <li key={i} className="flex items-center gap-3 text-sm text-slate-400 font-medium">
                                            <div className="w-1 h-1 bg-brand-500 rounded-full" />
                                            {text}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-brand-600/20 blur-3xl rounded-full"></div>
                        </div>
                    </div>

                    <div className="lg:col-span-3">
                        <div className="glass-card p-10 lg:p-12 rounded-[3rem] bg-white border border-slate-100 shadow-3xl shadow-slate-100 relative">
                            {success && (
                                <div className="mb-10 p-6 bg-emerald-50 text-emerald-700 rounded-2xl border border-emerald-100 flex items-start gap-4 animate-fade-in">
                                    <CheckCircle className="h-6 w-6 shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-black text-sm uppercase tracking-widest leading-none mb-2">Protocol Successful</p>
                                        <p className="text-xs font-bold opacity-80 mb-3 text-balance italic">Certificate has been signed and added to the ledger.</p>
                                        <div className="px-3 py-1.5 bg-white/50 rounded-lg font-mono text-[10px] font-black break-all">{success}</div>
                                    </div>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Legal Name</label>
                                            <div className="relative group">
                                                <Award className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-brand-600 transition-colors" />
                                                <input
                                                    required
                                                    type="text"
                                                    placeholder="Johnathan Doe"
                                                    className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:bg-white focus:border-brand-500 transition-all font-bold text-sm"
                                                    value={formData.recipient_name}
                                                    onChange={e => setFormData({ ...formData, recipient_name: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Email Terminal</label>
                                            <div className="relative group">
                                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-brand-600 transition-colors" />
                                                <input
                                                    required
                                                    type="email"
                                                    placeholder="recipient@node.edu"
                                                    className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:bg-white focus:border-brand-500 transition-all font-bold text-sm"
                                                    value={formData.recipient_email}
                                                    onChange={e => setFormData({ ...formData, recipient_email: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Achievement Framework</label>
                                        <div className="relative group">
                                            <Layout className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-brand-600 transition-colors" />
                                            <input
                                                required
                                                type="text"
                                                placeholder="e.g. Advanced Cryptography Certification"
                                                className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:bg-white focus:border-brand-500 transition-all font-bold text-sm"
                                                value={formData.course_title}
                                                onChange={e => setFormData({ ...formData, course_title: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Expiry Date (Optional)</label>
                                        <div className="relative group">
                                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-brand-600 transition-colors" />
                                            <input
                                                type="date"
                                                className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:bg-white focus:border-brand-500 transition-all font-bold text-sm"
                                                value={formData.expiry_date}
                                                onChange={e => setFormData({ ...formData, expiry_date: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-brand-600 text-white py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] hover:bg-brand-700 shadow-2xl shadow-brand-100 transition-all flex items-center justify-center gap-4 active:scale-[0.98] disabled:opacity-70 group"
                                >
                                    {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : (
                                        <>
                                            Authorize Issuance
                                            <ShieldCheck className="h-5 w-5 group-hover:scale-110 transition-transform" />
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <div className="fixed bottom-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02] pointer-events-none -z-10"></div>
        </div>
    );
}
