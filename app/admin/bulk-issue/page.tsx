'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Upload, FileText, CheckCircle, XCircle, Loader2, ArrowLeft, Database, Search, ShieldCheck } from 'lucide-react';

export default function BulkIssuePage() {
    const router = useRouter();
    const [file, setFile] = React.useState<File | null>(null);
    const [loading, setLoading] = React.useState(false);
    const [results, setResults] = React.useState<any[]>([]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const processCSV = async () => {
        if (!file) return;
        setLoading(true);
        setResults([]);

        const reader = new FileReader();
        reader.onload = async (e) => {
            const text = e.target?.result as string;
            const lines = text.split('\n');
            // const headers = lines[0].split(','); // Unused but kept for logic

            const certificates = lines.slice(1).filter(line => line.trim()).map(line => {
                const values = line.split(',');
                return {
                    recipient_name: values[0]?.trim(),
                    recipient_email: values[1]?.trim(),
                    course_title: values[2]?.trim(),
                    expiry_date: values[3]?.trim() || null
                };
            });

            try {
                const res = await fetch('/api/issue/bulk', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ certificates })
                });
                const data = await res.json();
                if (data.results) {
                    setResults(data.results);
                }
            } catch (err) {
                console.error(err);
                alert('An error occurred during bulk processing.');
            } finally {
                setLoading(false);
            }
        };
        reader.readAsText(file);
    };

    return (
        <div className="min-h-screen bg-white selection:bg-brand-100">
            <div className="max-w-5xl mx-auto px-6 py-12 lg:py-20">
                <button
                    onClick={() => router.back()}
                    className="mb-12 flex items-center gap-2 text-slate-400 hover:text-slate-900 font-black text-xs uppercase tracking-widest transition-all group"
                >
                    <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                    Return to Console
                </button>

                <div className="grid lg:grid-cols-5 gap-16 items-start">
                    <div className="lg:col-span-2 space-y-10">
                        <div className="animate-fade-in-up">
                            <div className="inline-flex items-center px-3 py-1 bg-violet-50 text-violet-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 italic">Mass Operation</div>
                            <h2 className="text-4xl font-black text-slate-900 tracking-tighter leading-tight mb-6">Bulk Asset <br />Deployment.</h2>
                            <p className="text-slate-500 font-medium leading-relaxed">
                                Deploy multiple credentials in a single operation. Ensure your CSV follows the standardized protocol format.
                            </p>
                        </div>

                        <div className="glass-card p-8 bg-slate-50 border-slate-100 rounded-[2.5rem]">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 italic leading-none">Format Protocol (CSV)</h4>
                            <div className="space-y-4">
                                <div className="bg-white p-4 rounded-xl border border-slate-100 font-mono text-[10px] text-slate-600 space-y-1">
                                    <p className="text-slate-300"># recipient_name, email, title, expiry</p>
                                    <p>John Doe, john@node.edu, Web Dev, 2027-01-31</p>
                                    <p>Jane Smith, jane@node.edu, Python, 2026-12-31</p>
                                </div>
                                <div className="flex items-center gap-3 text-[10px] font-black text-violet-600 uppercase italic">
                                    <Database className="h-3 w-3" />
                                    <span>Supports up to 500 records</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-3">
                        <div className="glass-card p-1 pb-12 rounded-[3.5rem] bg-white border border-slate-100 shadow-3xl shadow-slate-100 text-center overflow-hidden">
                            <div className="p-12 md:p-16 border-b border-slate-50/50 mb-10 bg-slate-50/30">
                                <div className="relative group mx-auto w-full max-w-sm">
                                    <input
                                        type="file"
                                        accept=".csv"
                                        onChange={handleFileChange}
                                        className="absolute inset-0 opacity-0 cursor-pointer z-20"
                                    />
                                    <div className="border-2 border-dashed border-slate-200 rounded-[2.5rem] p-12 text-center group-hover:border-brand-400 group-hover:bg-white transition-all duration-500 relative bg-white/50 backdrop-blur-sm shadow-inner overflow-hidden">
                                        {file ? (
                                            <div className="flex flex-col items-center animate-fade-in">
                                                <div className="w-16 h-16 bg-brand-50 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-brand-100">
                                                    <FileText className="h-8 w-8 text-brand-600" />
                                                </div>
                                                <p className="font-black text-slate-900 tracking-tight mb-1 truncate w-full">{file.name}</p>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{(file.size / 1024).toFixed(2)} KB</p>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center">
                                                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                                    <Upload className="h-8 w-8 text-slate-300 group-hover:text-brand-400" />
                                                </div>
                                                <p className="font-black text-slate-900 tracking-tight mb-1">Select Protocol File</p>
                                                <p className="text-[11px] font-bold text-slate-400 italic">Drag and drop or click to ingest</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="mt-10">
                                    <button
                                        onClick={processCSV}
                                        disabled={!file || loading}
                                        className="w-full max-w-xs bg-slate-900 text-white px-12 py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] hover:bg-black transition-all disabled:bg-slate-100 disabled:text-slate-300 shadow-2xl shadow-slate-200 flex items-center justify-center gap-4 active:scale-[0.98] group mx-auto"
                                    >
                                        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : (
                                            <>
                                                Execute Issuance
                                                <ShieldCheck className="h-5 w-5 group-hover:scale-110 transition-transform" />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {results.length > 0 && (
                                <div className="px-12 text-left animate-fade-in-up">
                                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8 italic flex items-center gap-3">
                                        <Search className="h-3 w-3" />
                                        Deployment Intelligence Report
                                    </h3>
                                    <div className="space-y-3 max-h-[400px] overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-slate-100">
                                        {results.map((res, i) => (
                                            <div key={i} className={`flex items-center justify-between p-5 rounded-2xl border transition-all hover:translate-x-1 ${res.status === 'success' ? 'bg-emerald-50/50 border-emerald-100 hover:border-emerald-200' : 'bg-rose-50/50 border-rose-100 hover:border-rose-200'}`}>
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${res.status === 'success' ? 'bg-emerald-500 shadow-emerald-100' : 'bg-rose-500 shadow-rose-100'} shadow-lg`}>
                                                        {res.status === 'success' ? (
                                                            <CheckCircle className="h-4 w-4 text-white" />
                                                        ) : (
                                                            <XCircle className="h-4 w-4 text-white" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-black text-slate-900 leading-none mb-1 uppercase italic tracking-tight">{res.email}</p>
                                                        <p className={`text-[9px] font-bold ${res.status === 'success' ? 'text-emerald-600' : 'text-rose-600'} uppercase tracking-widest`}>{res.status === 'success' ? 'Ingested' : 'Rejected'}</p>
                                                    </div>
                                                </div>
                                                <span className="font-mono text-[10px] font-black text-slate-400 bg-white/50 px-3 py-1.5 rounded-lg border border-slate-100">{res.certificate_id || 'ERROR-001'}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="fixed bottom-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02] pointer-events-none -z-10"></div>
        </div>
    );
}
