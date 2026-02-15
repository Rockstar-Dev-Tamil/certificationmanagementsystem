'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User, Mail, Lock, Loader2, ShieldCheck, ArrowRight, CheckCircle2, Award, Briefcase, Building } from 'lucide-react';

export default function RegisterPage() {
    const router = useRouter();
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState('');
    const [formData, setFormData] = React.useState({
        fullName: '',
        email: '',
        password: '',
        role: 'user'
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (res.ok) {
                router.push('/login');
            } else {
                setError(data.error || 'Provisioning failed. Please check inputs.');
            }
        } catch (err) {
            setError('Global gateway error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen grid lg:grid-cols-2 bg-white selection:bg-brand-100">
            {/* Left Column: Form */}
            <div className="flex flex-col items-center justify-center p-8 sm:p-12 lg:p-24 bg-white relative overflow-y-auto">
                <div className="absolute top-12 left-12">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center shadow-lg shadow-brand-200 group-hover:rotate-6 transition-transform">
                            <ShieldCheck className="text-white h-5 w-5" />
                        </div>
                        <span className="text-xl font-black text-slate-900 tracking-tight">CertiSafe</span>
                    </Link>
                </div>

                <div className="w-full max-w-sm animate-fade-in-up py-20 lg:py-0">
                    <div className="mb-10 text-center lg:text-left">
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-3">Provision Account</h1>
                        <p className="text-slate-500 font-medium">Join the professional certification ecosystem.</p>
                    </div>

                    {error && (
                        <div className="mb-8 p-4 bg-rose-50 text-rose-600 rounded-2xl text-sm font-bold border border-rose-100 flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-rose-500" />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Legal Full Name</label>
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-brand-600 transition-colors" />
                                <input
                                    required
                                    type="text"
                                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:bg-white focus:border-brand-500 transition-all font-medium"
                                    placeholder="Executive Name"
                                    value={formData.fullName}
                                    onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Institutional Email</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-brand-600 transition-colors" />
                                <input
                                    required
                                    type="email"
                                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:bg-white focus:border-brand-500 transition-all font-medium"
                                    placeholder="admin@institution.com"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Security Secret</label>
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

                        <div className="space-y-3">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Entity Profile</label>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, role: 'user' })}
                                    className={`p-4 rounded-2xl flex flex-col items-center gap-2 border-2 transition-all ${formData.role === 'user' ? 'border-brand-600 bg-brand-50/50 text-brand-600 shadow-xl shadow-brand-100' : 'border-slate-50 bg-slate-50 text-slate-400 hover:border-slate-200'}`}
                                >
                                    <Briefcase className="h-6 w-6" />
                                    <span className="text-xs font-black uppercase italic">Individual</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, role: 'admin' })}
                                    className={`p-4 rounded-2xl flex flex-col items-center gap-2 border-2 transition-all ${formData.role === 'admin' ? 'border-brand-600 bg-brand-50/50 text-brand-600 shadow-xl shadow-brand-100' : 'border-slate-50 bg-slate-50 text-slate-400 hover:border-slate-200'}`}
                                >
                                    <Building className="h-6 w-6" />
                                    <span className="text-xs font-black uppercase italic">Organization</span>
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-brand-600 text-white py-5 rounded-2xl font-black text-lg hover:bg-brand-700 shadow-2xl shadow-brand-100 transition-all flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-70 group"
                        >
                            {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : (
                                <>
                                    Initialize Account
                                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <p className="text-center mt-10 text-slate-500 font-bold text-sm">
                        Already Provisioned?{' '}
                        <Link href="/login" className="text-brand-600 hover:text-brand-700 transition-colors">
                            Gate Access →
                        </Link>
                    </p>
                </div>
            </div>

            {/* Right Column: Visual */}
            <div className="hidden lg:flex flex-col justify-center p-24 bg-brand-600 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-transparent z-0"></div>

                <div className="relative z-10 max-w-lg space-y-12">
                    <div className="w-20 h-20 bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2rem] flex items-center justify-center shadow-3xl">
                        <Award className="text-white h-10 w-10 animate-float" />
                    </div>

                    <h2 className="text-5xl font-black text-white leading-tight tracking-tighter italic">
                        "Building a Unified Standard for Digital Verification."
                    </h2>

                    <div className="grid grid-cols-2 gap-8 text-white">
                        {[
                            { val: "100%", label: "Tamper Proof" },
                            { val: "Zero-Knowledge", label: "Verification" },
                            { val: "< 1s", label: "Latency" },
                            { val: "24/7", label: "Availability" }
                        ].map((item, i) => (
                            <div key={i} className="space-y-1">
                                <div className="text-3xl font-black">{item.val}</div>
                                <div className="text-[10px] font-black uppercase tracking-widest opacity-60 italic">{item.label}</div>
                            </div>
                        ))}
                    </div>

                    <div className="pt-8 flex items-center gap-4 text-white/60 font-medium">
                        <CheckCircle2 className="h-5 w-5 text-white" />
                        <span>Compliant with Institutional Standards 2024</span>
                    </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute -bottom-20 -left-20 w-[600px] h-[600px] bg-black/10 blur-[150px] rounded-full pointer-events-none"></div>
                <div className="absolute top-1/2 -right-20 w-80 h-80 bg-white/10 blur-[100px] rounded-full pointer-events-none animate-pulse-slow"></div>
            </div>
        </div>
    );
}
