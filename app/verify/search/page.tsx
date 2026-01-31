'use client';

import React from 'react';
import { Search, Award, CheckCircle, XCircle, Clock } from 'lucide-react';

export default function SearchPortal() {
    const [query, setQuery] = React.useState('');
    const [results, setResults] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(false);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;
        setLoading(true);

        try {
            // Reusing verify API for simple ID search, but could extend to a search API
            const res = await fetch('/api/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ certificateId: query })
            });
            const data = await res.json();

            if (data.valid || data.status === 'revoked') {
                setResults([data.data]);
            } else {
                setResults([]);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4">
            <div className="max-w-4xl mx-auto text-center mb-12">
                <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Verification Portal</h1>
                <p className="text-lg text-slate-600">Enter a Certificate ID to verify its authenticity and current status.</p>
            </div>

            <div className="max-w-2xl mx-auto mb-12">
                <form onSubmit={handleSearch} className="relative">
                    <Search className="h-6 w-6 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Enter Certificate ID (e.g., CS-2026-...)"
                        className="w-full pl-12 pr-32 py-4 bg-white border border-slate-200 rounded-2xl shadow-sm text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="absolute right-2 top-2 bottom-2 bg-blue-600 text-white px-6 rounded-xl font-bold hover:bg-blue-700 transition-colors disabled:bg-slate-300"
                    >
                        {loading ? 'Searching...' : 'Verify'}
                    </button>
                </form>
            </div>

            <div className="max-w-2xl mx-auto">
                {results.length > 0 ? (
                    results.map((cert, i) => (
                        <div key={i} className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className={`p-6 flex items-center justify-between ${cert.status === 'valid' ? 'bg-emerald-50' : 'bg-rose-50'}`}>
                                <div className="flex items-center gap-3">
                                    {cert.status === 'valid' ? (
                                        <CheckCircle className="h-6 w-6 text-emerald-600" />
                                    ) : (
                                        <XCircle className="h-6 w-6 text-rose-600" />
                                    )}
                                    <span className={`font-bold uppercase tracking-wider ${cert.status === 'valid' ? 'text-emerald-700' : 'text-rose-700'}`}>
                                        {cert.status === 'valid' ? 'Verified Authentic' : 'Certificate Revoked'}
                                    </span>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-slate-500 font-bold uppercase tracking-tighter">Issue Date</p>
                                    <p className="font-medium text-slate-900">{new Date(cert.issue_date).toLocaleDateString()}</p>
                                </div>
                            </div>

                            <div className="p-8">
                                <div className="grid grid-cols-2 gap-8 mb-8">
                                    <div>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Recipient Name</p>
                                        <p className="text-xl font-bold text-slate-900">{cert.profiles.full_name}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Course Title</p>
                                        <p className="text-xl font-bold text-slate-900">{cert.template_name}</p>
                                    </div>
                                </div>

                                <div className="border-t border-slate-100 pt-8 flex items-end justify-between">
                                    <div>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Digital Identity Hash (SHA-256)</p>
                                        <code className="text-[10px] bg-slate-50 p-2 rounded block break-all font-mono text-slate-600 border border-slate-100 uppercase">
                                            {cert.data_hash}
                                        </code>
                                    </div>
                                    <a
                                        href={`/preview/${cert.certificate_id}`}
                                        className="bg-slate-900 text-white px-6 py-2 rounded-xl font-bold hover:bg-slate-800 transition-colors whitespace-nowrap"
                                    >
                                        View Full Record
                                    </a>
                                </div>
                                {cert.status === 'revoked' && (
                                    <div className="mt-6 p-4 bg-rose-50 border border-rose-100 rounded-xl">
                                        <p className="text-xs font-bold text-rose-400 uppercase mb-1">Revocation Reason</p>
                                        <p className="text-rose-900 font-medium">{cert.revocation_reason}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                ) : query && !loading ? (
                    <div className="text-center py-12 bg-white rounded-3xl border border-slate-200">
                        <Award className="h-12 w-12 text-slate-200 mx-auto mb-4" />
                        <p className="text-slate-500 font-medium">No certificate found matching this ID.</p>
                    </div>
                ) : null}
            </div>
        </div>
    );
}
