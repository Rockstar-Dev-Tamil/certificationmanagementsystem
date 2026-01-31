'use client';

import React from 'react';
import { Database, Shield, CheckCircle, XCircle } from 'lucide-react';

export default function LedgerPage() {
    const [ledger, setLedger] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        fetch('/api/ledger')
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setLedger(data.ledger);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    return (
        <div className="min-h-screen bg-white py-12 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-1.5 rounded-full text-sm font-bold border border-indigo-100 mb-4">
                            <Database className="h-4 w-4" />
                            Transparency Protocol V2
                        </div>
                        <h1 className="text-4xl font-black text-slate-900 mb-4">Public Issuance Ledger</h1>
                        <p className="text-lg text-slate-500 max-w-2xl">
                            A transparent, tamper-proof record of all certificates issued through our system.
                            Verified by SHA-256 cryptographic hashing.
                        </p>
                    </div>
                </div>

                <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200">
                                    <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Certificate ID</th>
                                    <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Recipient</th>
                                    <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Course</th>
                                    <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Issue Date</th>
                                    <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-center">Security Hash</th>
                                    <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {loading ? (
                                    [1, 2, 3, 4, 5].map(i => (
                                        <tr key={i} className="animate-pulse">
                                            <td className="px-6 py-6"><div className="h-4 w-24 bg-slate-100 rounded" /></td>
                                            <td className="px-6 py-6"><div className="h-4 w-32 bg-slate-100 rounded" /></td>
                                            <td className="px-6 py-6"><div className="h-4 w-40 bg-slate-100 rounded" /></td>
                                            <td className="px-6 py-6"><div className="h-4 w-20 bg-slate-100 rounded" /></td>
                                            <td className="px-6 py-6"><div className="h-4 w-48 bg-slate-100 rounded mx-auto" /></td>
                                            <td className="px-6 py-6"><div className="h-4 w-16 bg-slate-100 rounded ml-auto" /></td>
                                        </tr>
                                    ))
                                ) : ledger.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-24 text-center text-slate-400 font-medium">
                                            No public records found in the ledger.
                                        </td>
                                    </tr>
                                ) : (
                                    ledger.map((row, i) => (
                                        <tr key={i} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-6 font-mono text-xs text-slate-500 font-bold">{row.certificate_id}</td>
                                            <td className="px-6 py-6">
                                                <p className="font-bold text-slate-900">{row.full_name}</p>
                                            </td>
                                            <td className="px-6 py-6 text-sm text-slate-600 font-medium">{row.template_name}</td>
                                            <td className="px-6 py-6 text-sm text-slate-500">
                                                {new Date(row.issue_date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                            </td>
                                            <td className="px-6 py-6">
                                                <div className="flex items-center justify-center gap-2">
                                                    <Shield className="h-3 w-3 text-emerald-500" />
                                                    <code className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-1 rounded font-mono uppercase tracking-tighter">
                                                        {row.data_hash?.substring(0, 16)}...
                                                    </code>
                                                </div>
                                            </td>
                                            <td className="px-6 py-6 text-right">
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${row.status === 'valid' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                                                    {row.status === 'valid' ? (
                                                        <>
                                                            <CheckCircle className="h-3 w-3" />
                                                            Valid
                                                        </>
                                                    ) : (
                                                        <>
                                                            <XCircle className="h-3 w-3" />
                                                            Revoked
                                                        </>
                                                    )}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
