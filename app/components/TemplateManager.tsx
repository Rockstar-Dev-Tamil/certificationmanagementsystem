'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Layout, Edit, Trash2, Shield, Search } from 'lucide-react';

export default function TemplateManager() {
    const [templates, setTemplates] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchTemplates();
    }, []);

    const fetchTemplates = async () => {
        try {
            const res = await fetch('/api/templates');
            const data = await res.json();
            setTemplates(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const filteredTemplates = templates.filter(t =>
        t.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
                <div>
                    <h2 className="text-5xl font-black text-slate-900 tracking-tighter">Asset Templates</h2>
                    <p className="text-slate-500 mt-2 font-medium italic text-lg">Manage credential frameworks and visual protocols.</p>
                </div>
                <button className="bg-brand-600 text-white px-8 py-4 rounded-2xl font-black text-sm hover:bg-brand-700 shadow-2xl shadow-brand-100 transition-all flex items-center gap-3 active:scale-95 group">
                    <Plus className="h-5 w-5 group-hover:rotate-90 transition-transform" />
                    Forge New Template
                </button>
            </div>

            <div className="mb-10 relative group">
                <Search className="h-5 w-5 absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-600 transition-colors" />
                <input
                    type="text"
                    placeholder="Search Protocols..."
                    className="w-full pl-16 pr-8 py-5 bg-white border border-slate-100 rounded-[2rem] text-sm font-bold focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-100 transition-all shadow-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {loading ? (
                <div className="py-20 text-center animate-pulse font-black text-slate-300 tracking-[0.2em] uppercase italic">Synchronizing Protocols...</div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredTemplates.map((t, i) => (
                        <div key={i} className="glass-card p-8 rounded-[2.5rem] bg-white border border-slate-50 hover:border-brand-100 transition-all group overflow-hidden relative shadow-sm hover:shadow-2xl">
                            <div className="relative z-10">
                                <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-brand-50 transition-colors">
                                    <Layout className="h-6 w-6 text-slate-400 group-hover:text-brand-600" />
                                </div>
                                <h3 className="text-xl font-black text-slate-900 mb-2 uppercase tracking-tight italic group-hover:text-brand-600 transition-colors">{t.title}</h3>
                                <p className="text-slate-500 text-sm font-medium mb-8 line-clamp-2">{t.description || 'No description provided for this protocol framework.'}</p>

                                <div className="flex items-center gap-2 pt-6 border-t border-slate-50">
                                    <button className="flex-1 flex items-center justify-center gap-2 py-3 bg-slate-50 text-slate-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 hover:text-slate-900 transition-all">
                                        <Edit className="h-3 w-3" /> Edit
                                    </button>
                                    <button className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-rose-50 hover:text-rose-600 transition-all">
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                            <div className="absolute top-8 right-8">
                                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                                    <Shield className="h-4 w-4" />
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Placeholder Add Card */}
                    <div className="border-2 border-dashed border-slate-100 rounded-[2.5rem] flex flex-col items-center justify-center p-8 group cursor-pointer hover:border-brand-200 hover:bg-brand-50/10 transition-all">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <Plus className="h-8 w-8 text-slate-200" />
                        </div>
                        <p className="text-xs font-black text-slate-300 uppercase tracking-widest italic">Define New Protocol</p>
                    </div>
                </div>
            )}
        </div>
    );
}
