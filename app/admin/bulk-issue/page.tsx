'use client';

import React from 'react';
import { Upload, FileText, CheckCircle, XCircle, Loader2 } from 'lucide-react';

export default function BulkIssuePage() {
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
            const headers = lines[0].split(',');

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
            } finally {
                setLoading(false);
            }
        };
        reader.readAsText(file);
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-8 md:p-12">
                <div className="text-center mb-12">
                    <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <Upload className="h-8 w-8 text-blue-600" />
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 mb-4">Bulk Issuance</h1>
                    <p className="text-slate-500">Upload a CSV file to issue certificates in high volume.</p>
                </div>

                <div className="border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center hover:border-blue-400 transition-colors cursor-pointer relative bg-slate-50">
                    <input
                        type="file"
                        accept=".csv"
                        onChange={handleFileChange}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    {file ? (
                        <div className="flex flex-col items-center">
                            <FileText className="h-12 w-12 text-blue-600 mb-4" />
                            <p className="font-bold text-slate-900">{file.name}</p>
                            <p className="text-sm text-slate-500">{(file.size / 1024).toFixed(2)} KB</p>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center">
                            <Upload className="h-12 w-12 text-slate-300 mb-4" />
                            <p className="font-bold text-slate-900">Drop your CSV file here</p>
                            <p className="text-sm text-slate-500">or click to browse from device</p>
                        </div>
                    )}
                </div>

                <div className="mt-8 flex justify-center">
                    <button
                        onClick={processCSV}
                        disabled={!file || loading}
                        className="bg-blue-600 text-white px-12 py-4 rounded-2xl font-black text-lg hover:bg-blue-700 transition-all disabled:bg-slate-200 shadow-xl shadow-blue-100 flex items-center gap-3"
                    >
                        {loading && <Loader2 className="h-5 w-5 animate-spin" />}
                        {loading ? 'Processing...' : 'Start Issuance'}
                    </button>
                </div>

                {results.length > 0 && (
                    <div className="mt-12 pt-12 border-t border-slate-100">
                        <h3 className="font-bold text-slate-900 mb-6">Issuance Report</h3>
                        <div className="space-y-3">
                            {results.map((res, i) => (
                                <div key={i} className={`flex items-center justify-between p-4 rounded-xl border ${res.status === 'success' ? 'bg-emerald-50 border-emerald-100' : 'bg-rose-50 border-rose-100'}`}>
                                    <div className="flex items-center gap-3">
                                        {res.status === 'success' ? (
                                            <CheckCircle className="h-5 w-5 text-emerald-600" />
                                        ) : (
                                            <XCircle className="h-5 w-5 text-rose-600" />
                                        )}
                                        <span className="font-medium text-slate-900">{res.email}</span>
                                    </div>
                                    <span className="text-xs font-mono font-bold text-slate-500">{res.certificate_id || 'ERROR'}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div className="mt-8 p-6 bg-slate-900 rounded-2xl text-white">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">CSV Format Guide</p>
                <div className="font-mono text-[10px] space-y-1 text-slate-300">
                    <p>recipient_name, recipient_email, course_title, expiry_date</p>
                    <p>John Doe, john@example.com, Web Development, 2027-01-31</p>
                    <p>Jane Smith, jane@example.com, Python Basics, 2026-12-31</p>
                </div>
            </div>
        </div>
    );
}
