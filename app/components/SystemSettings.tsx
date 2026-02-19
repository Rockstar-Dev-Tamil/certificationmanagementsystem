'use client';

import React, { useState, useEffect } from 'react';
import { Settings, Shield, Zap, Database, Globe, Lock, Server } from 'lucide-react';

export default function SystemSettings() {
    const [settings, setSettings] = useState<any>({
        blockchain_sync: true,
        ai_fraud_detection: true,
        institutional_2fa: false
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await fetch('/api/settings');
            const data = await res.json();
            if (Object.keys(data).length > 0) {
                setSettings(data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const toggleSetting = async (key: string) => {
        const newVal = !settings[key];
        const updated = { ...settings, [key]: newVal };
        setSettings(updated);

        setSaving(true);
        try {
            await fetch('/api/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ [key]: newVal })
            });
        } catch (err) {
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="animate-fade-in text-slate-900">
            <div className="flex justify-between items-end mb-16">
                <div>
                    <h2 className="text-5xl font-black tracking-tighter">Protocol Settings</h2>
                    <p className="text-slate-500 mt-2 font-medium italic text-lg">System-wide configuration and security protocols.</p>
                </div>
                {saving && <div className="text-[10px] font-black uppercase tracking-widest text-brand-600 animate-pulse">Syncing Specifications...</div>}
            </div>

            <div className="grid md:grid-cols-2 gap-10">
                <div className="glass-card p-10 rounded-[3rem] bg-white border border-slate-50 shadow-sm relative overflow-hidden">
                    <div className="flex items-center gap-4 mb-10">
                        <div className="p-4 bg-brand-50 rounded-2xl">
                            <Shield className="h-6 w-6 text-brand-600" />
                        </div>
                        <h3 className="text-2xl font-black tracking-tight uppercase italic">Security Protocol</h3>
                    </div>

                    <div className="space-y-8 relative z-10">
                        {[
                            { id: 'blockchain_sync', label: "Blockchain Sync", desc: "Enable real-time cryptographic commits" },
                            { id: 'ai_fraud_detection', label: "AI Fraud Detection", desc: "Monitor issuance for anomalous patterns" },
                            { id: 'institutional_2fa', label: "Institutional 2FA", desc: "Require multi-factor for bulk issuance" },
                        ].map((s, i) => (
                            <div key={i} className="flex justify-between items-center group">
                                <div>
                                    <p className="font-bold group-hover:text-brand-600 transition-colors uppercase italic tracking-tight">{s.label}</p>
                                    <p className="text-xs text-slate-400 font-medium">{s.desc}</p>
                                </div>
                                <div
                                    onClick={() => toggleSetting(s.id)}
                                    className={`w-14 h-8 rounded-full p-1 cursor-pointer transition-all ${settings[s.id] ? 'bg-brand-600' : 'bg-slate-200'}`}
                                >
                                    <div className={`w-6 h-6 bg-white rounded-full shadow-md transition-transform ${settings[s.id] ? 'translate-x-6' : 'translate-x-0'}`} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="glass-card p-10 rounded-[3rem] bg-white border border-slate-50 shadow-sm relative overflow-hidden">
                    <div className="flex items-center gap-4 mb-10">
                        <div className="p-4 bg-violet-50 rounded-2xl">
                            <Zap className="h-6 w-6 text-violet-600" />
                        </div>
                        <h3 className="text-2xl font-black tracking-tight uppercase italic">Infrastructure</h3>
                    </div>

                    <div className="space-y-6 relative z-10">
                        <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                            <div className="flex items-center gap-3 mb-4">
                                <Database className="h-4 w-4 text-slate-400" />
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Protocol Ledger Station</p>
                            </div>
                            <p className="font-mono text-xs font-bold text-slate-700">NODE: LIVE-PRIMARY-SUPA-01</p>
                            <div className="mt-4 flex items-center justify-between">
                                <span className="text-[10px] font-black text-emerald-500 uppercase flex items-center gap-1">
                                    <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" /> Operational
                                </span>
                                <span className="text-[10px] font-bold text-slate-400 italic">Latency: 12ms</span>
                            </div>
                        </div>

                        <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                            <div className="flex items-center gap-3 mb-4">
                                <Lock className="h-4 w-4 text-slate-400" />
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Master Key Storage</p>
                            </div>
                            <p className="font-mono text-xs font-bold text-slate-700 italic">********-AES-256-GCM</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-12 glass-card p-10 rounded-[3rem] bg-slate-900 text-white relative overflow-hidden">
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10">
                            <Server className="h-8 w-8 text-brand-400" />
                        </div>
                        <div>
                            <h4 className="text-xl font-black uppercase italic tracking-tight">Advanced System Audit</h4>
                            <p className="text-slate-400 text-sm font-medium">Download full system logs and protocol history.</p>
                        </div>
                    </div>
                    <button className="px-10 py-5 bg-white text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-slate-50 transition-all shadow-xl active:scale-95">
                        Download Audit Frame
                    </button>
                </div>
                <div className="absolute top-0 right-0 w-96 h-96 bg-brand-600/10 blur-[100px] rounded-full" />
            </div>
        </div>
    );
}
