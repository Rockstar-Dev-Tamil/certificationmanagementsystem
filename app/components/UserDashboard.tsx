'use client';

import React from 'react';
import { Award, ShieldCheck, Lock, Calendar, Eye, Download, Search } from 'lucide-react';
import Link from 'next/link';

interface UserDashboardProps {
    certificates: any[];
    loading: boolean;
}

export default function UserDashboard({ certificates, loading }: UserDashboardProps) {
    const [searchTerm, setSearchTerm] = React.useState('');

    const filteredCerts = React.useMemo(() => {
        return certificates.filter((cert: any) =>
            (cert.title || cert.course_title)?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (cert.id || cert.certificate_id)?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [certificates, searchTerm]);

    const downloadManifest = () => {
        const headers = ['Title', 'ID', 'Issue Date', 'Expiry'];
        const csvRows = certificates.map((cert: any) => [
            cert.title || cert.course_title,
            cert.id || cert.certificate_id,
            cert.date || new Date(cert.issue_date).toLocaleDateString(),
            cert.expiry || 'N/A'
        ]);

        const csvContent = [headers, ...csvRows].map(e => e.join(",")).join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `my-credentials-manifest.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
                <div>
                    <h1 className="text-5xl font-black text-slate-900 tracking-tighter">My Credentials</h1>
                    <p className="text-slate-500 mt-2 font-medium italic">Verified achievements and professional history.</p>
                </div>
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:flex-none group">
                        <Search className="h-4 w-4 absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-600 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search Vault..."
                            className="pl-14 pr-6 py-4 bg-white border border-slate-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-100 transition-all w-full md:w-64 shadow-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={downloadManifest}
                        className="p-4 bg-slate-900 text-white rounded-2xl hover:bg-black transition-all shadow-xl shadow-slate-200 active:scale-95 group"
                    >
                        <Download className="h-5 w-5 group-hover:-translate-y-1 transition-transform" />
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-32 gap-4">
                    <div className="w-12 h-12 border-4 border-brand-100 border-t-brand-600 rounded-full animate-spin"></div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic animate-pulse">Syncing Credential Ledger</p>
                </div>
            ) : filteredCerts.length === 0 ? (
                <div className="text-center py-32 bg-white rounded-[3rem] border border-slate-100 shadow-sm flex flex-col items-center max-w-2xl mx-auto">
                    <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mb-8">
                        <ShieldCheck className="h-10 w-10 text-slate-200" />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight italic uppercase mb-4">{searchTerm ? 'No results found' : 'No Assets found'}</h3>
                    <p className="text-slate-500 font-medium max-w-sm">
                        {searchTerm ? `No credentials match "${searchTerm}" in your encrypted vault.` : 'Your personal credential vault is currently empty. Achievements will appear here after institutional verification.'}
                    </p>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {filteredCerts.map((cert: any, i) => (
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
                                        <h3 className="font-black text-slate-900 text-xl tracking-tight group-hover:text-brand-600 transition-colors uppercase leading-tight italic">{cert.title || cert.course_title}</h3>
                                    </div>
                                    <div className="p-2 bg-slate-50 rounded-lg">
                                        <Lock className="h-4 w-4 text-slate-300" />
                                    </div>
                                </div>

                                <div className="space-y-4 mb-10">
                                    <div className="flex items-center gap-4 text-slate-400">
                                        <Calendar className="h-4 w-4" />
                                        <div className="text-[10px] font-black uppercase tracking-widest italic">{cert.date || new Date(cert.issue_date).toLocaleDateString()}</div>
                                    </div>
                                    <div className="px-4 py-3 bg-slate-50 rounded-xl border border-slate-100">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 italic leading-none">Protocol ID</p>
                                        <p className="font-mono text-[11px] font-bold text-slate-600 truncate">{cert.id || cert.certificate_id}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <Link href={`/preview/${cert.id || cert.certificate_id}`} className="flex items-center justify-center gap-2 bg-slate-900 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-slate-100 active:scale-95 group/btn">
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
