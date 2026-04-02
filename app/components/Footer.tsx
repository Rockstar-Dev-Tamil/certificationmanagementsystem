'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Mail, Globe, Github, Shield, Lock, Activity } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="py-24 bg-slate-950 text-white border-t border-white/5 relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid md:grid-cols-4 gap-20 mb-24">
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center shadow-2xl shadow-brand-500/20">
                                <ShieldCheck className="text-white h-6 w-6" />
                            </div>
                            <span className="text-2xl font-black tracking-tight italic">CertiSafe</span>
                        </div>
                        <p className="text-slate-400 max-w-sm mb-10 leading-relaxed font-medium italic text-sm">
                            The global standard for cryptographically secure achievement verification. Protecting the integrity of digital identities.
                        </p>
                        <div className="flex gap-4">
                            {[Mail, Globe, Github].map((Icon, i) => (
                                <button key={i} className="p-3 bg-white/5 border border-white/10 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-all">
                                    <Icon className="h-5 w-5" />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h5 className="font-black text-brand-500 mb-8 uppercase tracking-[0.2em] text-[10px]">Infrastructure</h5>
                        <ul className="space-y-4 text-slate-500 font-bold text-xs uppercase tracking-widest">
                            <li><Link href="/verify" className="hover:text-white transition-colors">Verify Node</Link></li>
                            <li><Link href="/register" className="hover:text-white transition-colors">Issue Terminal</Link></li>
                            <li><Link href="/login" className="hover:text-white transition-colors">Admin Gateway</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h5 className="font-black text-brand-500 mb-8 uppercase tracking-[0.2em] text-[10px]">Security</h5>
                        <ul className="space-y-4 text-slate-500 font-bold text-xs uppercase tracking-widest">
                            <li><div className="flex items-center gap-2">
                                <Shield className="h-3 w-3 text-emerald-500" />
                                <span className="opacity-50">SHA-256 Auth</span>
                            </div></li>
                            <li><div className="flex items-center gap-2">
                                <Lock className="h-3 w-3 text-brand-500" />
                                <span className="opacity-50">ACID Storage</span>
                            </div></li>
                            <li><div className="flex items-center gap-2">
                                <Activity className="h-3 w-3 text-violet-500" />
                                <span className="opacity-50">Live Sync</span>
                            </div></li>
                        </ul>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center gap-8 border-t border-white/5 pt-12">
                    <p className="text-slate-600 font-black uppercase text-[10px] tracking-[0.3em]">
                        © {new Date().getFullYear()} CertiSafe Enterprise.
                    </p>
                    <div className="flex gap-8 text-slate-500 font-black text-[10px] uppercase tracking-[0.4em]">
                        <a href="#" className="hover:text-brand-600 transition-colors">Privacy</a>
                        <a href="#" className="hover:text-brand-600 transition-colors">Legal</a>
                        <a href="#" className="hover:text-brand-600 transition-colors">SLA</a>
                    </div>
                </div>
            </div>

            {/* Visual gradient accent */}
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-brand-600/5 blur-[150px] rounded-full pointer-events-none"></div>
        </footer>
    );
}
