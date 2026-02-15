'use client';

import React from 'react';
import { Award, Download, ShieldCheck, Eye, Calendar, Lock } from 'lucide-react';
import Link from 'next/link';

export default function UserPage() {
    const [certificates, setCertificates] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        fetch('/api/certificates')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setCertificates(data);
                } else {
                    console.error('Expected array, got:', data);
                    setCertificates([]);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    return (
        <div className="animate-fade-in pb-12">
            {loading ? (
                <div className="flex flex-col items-center justify-center py-32 gap-4">
                    <div className="w-12 h-12 border-4 border-brand-100 border-t-brand-600 rounded-full animate-spin"></div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic animate-pulse">Syncing Credential Ledger</p>
                </div>
            ) : certificates.length === 0 ? (
                <div className="text-center py-32 bg-white rounded-[3rem] border border-slate-100 shadow-sm flex flex-col items-center max-w-2xl mx-auto">
                    <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mb-8">
                        <ShieldCheck className="h-10 w-10 text-slate-200" />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight italic uppercase mb-4">No Assets found</h3>
                    <p className="text-slate-500 font-medium max-w-sm">Your personal credential vault is currently empty. Achievements will appear here after institutional verification.</p>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {certificates.map((cert: any, i) => (
                        <div key={i} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden group hover:shadow-3xl hover:-translate-y-2 transition-all duration-500">
                            <div className="h-48 bg-slate-50 flex items-center justify-center border-b border-slate-50 relative overflow-hidden">
                                <Award className="h-20 w-20 text-slate-200 group-hover:scale-110 group-hover:text-brand-100 transition-all duration-700" />
                                <div className="absolute top-6 right-6">
                                    <div className="px-3 py-1 bg-white/80 backdrop-blur-md rounded-full border border-slate-100 text-[10px] font-black text-brand-600 uppercase tracking-widest italic shadow-sm">Verified</div>
                                </div>
                                <div className="absolute inset-0 bg-brand-600/0 group-hover:bg-brand-600/5 transition-colors" />
                            </div>
                            <div className="p-8">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex-1 mr-4">
                                        <h3 className="font-black text-slate-900 text-xl tracking-tight group-hover:text-brand-600 transition-colors uppercase leading-tight italic">{cert.title}</h3>
                                    </div>
                                    <div className="p-2 bg-slate-50 rounded-lg">
                                        <Lock className="h-4 w-4 text-slate-300" />
                                    </div>
                                </div>

                                <div className="space-y-4 mb-10">
                                    <div className="flex items-center gap-4 text-slate-400">
                                        <Calendar className="h-4 w-4" />
                                        <div className="text-[10px] font-black uppercase tracking-widest italic">{cert.date}</div>
                                    </div>
                                    <div className="px-4 py-3 bg-slate-50 rounded-xl border border-slate-100">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 italic leading-none">Protocol ID</p>
                                        <p className="font-mono text-[11px] font-bold text-slate-600 truncate">{cert.id}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <Link href={`/preview/${cert.id}`} className="flex items-center justify-center gap-2 bg-slate-900 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-slate-100 active:scale-95 group/btn">
                                        Visual Preview
                                        <Eye className="h-4 w-4 opacity-50 group-hover/btn:opacity-100" />
                                    </Link>
                                    <button className="flex items-center justify-center gap-2 bg-white border border-slate-100 text-slate-400 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:text-brand-600 hover:border-brand-100 transition-all active:scale-95">
                                        <Download className="h-4 w-4" /> Export
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
