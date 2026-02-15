'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, Mail, Loader2, ShieldCheck, ArrowRight, CheckCircle2, Award } from 'lucide-react';

export default function LoginPage() {
    const router = useRouter();
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState('');
    const [formData, setFormData] = React.useState({ email: '', password: '' });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (res.ok) {
                router.push('/dashboard');
                router.refresh();
            } else {
                setError(data.error || 'Invalid credentials. Please try again.');
            }
        } catch (err) {
            setError('System communication error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen grid lg:grid-cols-2 bg-white selection:bg-brand-100">
            {/* Left Column: Focus/Form */}
            <div className="flex flex-col items-center justify-center p-8 sm:p-12 lg:p-24 bg-white relative">
                <div className="absolute top-12 left-12">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center shadow-lg shadow-brand-200 group-hover:rotate-6 transition-transform">
                            <ShieldCheck className="text-white h-5 w-5" />
                        </div>
                        <span className="text-xl font-black text-slate-900 tracking-tight">CertiSafe</span>
                    </Link>
                </div>

                <div className="w-full max-w-sm animate-fade-in-up">
                    <div className="mb-10 text-center lg:text-left">
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-3">Welcome Back</h1>
                        <p className="text-slate-500 font-medium">Continue managing your institutional credentials.</p>
                    </div>

                    {error && (
                        <div className="mb-8 p-4 bg-rose-50 text-rose-600 rounded-2xl text-sm font-bold border border-rose-100 flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-rose-500" />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Email Protocol</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-brand-600 transition-colors" />
                                <input
                                    required
                                    type="email"
                                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:bg-white focus:border-brand-500 transition-all font-medium"
                                    placeholder="admin@institution.edu"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center px-1">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Secret Key</label>
                                <a href="#" className="text-xs font-bold text-brand-600 hover:text-brand-700 transition-colors">Recover?</a>
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-brand-600 transition-colors" />
                                <input
                                    required
                                    type="password"
                                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:bg-white focus:border-brand-500 transition-all font-medium"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-brand-600 text-white py-5 rounded-2xl font-black text-lg hover:bg-brand-700 shadow-2xl shadow-brand-100 transition-all flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-70 group"
                        >
                            {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : (
                                <>
                                    Access Dashboard
                                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <p className="text-center mt-10 text-slate-500 font-bold text-sm">
                        New Organization?{' '}
                        <Link href="/register" className="text-brand-600 hover:text-brand-700 transition-colors">
                            Provision New Core →
                        </Link>
                    </p>
                </div>

                <div className="mt-auto pt-12 text-center">
                    <p className="text-[10px] text-slate-300 font-black uppercase tracking-[0.3em]">SECURE ACCESS GATEWAY V2.1</p>
                </div>
            </div>

            {/* Right Column: Visual/Trust */}
            <div className="hidden lg:flex flex-col justify-center p-24 bg-slate-950 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-600/20 to-violet-600/20 z-0"></div>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 z-0"></div>

                <div className="relative z-10 max-w-lg space-y-12">
                    <div className="w-20 h-20 bg-brand-600 rounded-[2rem] flex items-center justify-center shadow-3xl shadow-brand-500/20">
                        <Award className="text-white h-10 w-10 animate-pulse-slow" />
                    </div>

                    <h2 className="text-5xl font-black text-white leading-tight tracking-tighter italic">
                        "Professionalizing the World's Digital Achievements."
                    </h2>

                    <div className="space-y-6">
                        {[
                            "SHA-256 Cryptographic Integrity",
                            "AES-256 Data Encapsulation",
                            "Real-time Identity Resolution",
                            "Seamless Institutional Handover"
                        ].map((text, i) => (
                            <div key={i} className="flex items-center gap-4 text-brand-400 font-bold tracking-tight">
                                <CheckCircle2 className="h-5 w-5 shrink-0" />
                                <span className="text-white/80">{text}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Decorative background circle */}
                <div className="absolute -bottom-20 -right-20 w-[500px] h-[500px] bg-brand-500/20 blur-[120px] rounded-full pointer-events-none"></div>
                <div className="absolute -top-20 -left-20 w-[300px] h-[300px] bg-violet-500/10 blur-[100px] rounded-full pointer-events-none"></div>
            </div>
        </div>
    );
}
