'use client';

import React from 'react';
import { Award, Download } from 'lucide-react';

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-slate-900">My Certificates</h2>
                <p className="text-slate-500">View and download your earned credentials</p>
            </div>

            {loading ? (
                <div className="text-center py-12">Loading...</div>
            ) : certificates.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
                    <p className="text-slate-500">You haven't earned any certificates yet.</p>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {certificates.map((cert: any, i) => (
                        <div key={i} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden group hover:shadow-md transition-all">
                            <div className="h-40 bg-slate-100 flex items-center justify-center border-b border-slate-100 relative">
                                <Award className="h-16 w-16 text-slate-300" />
                                <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/5 transition-colors" />
                            </div>
                            <div className="p-6">
                                <h3 className="font-bold text-slate-900 text-lg mb-1">{cert.title}</h3>
                                <p className="text-xs text-slate-400 mb-4">ID: {cert.id}</p>
                                <div className="flex justify-between text-sm mb-6">
                                    <div>
                                        <p className="text-slate-400 text-xs uppercase font-semibold">Issued</p>
                                        <p className="text-slate-700 font-medium">{cert.date}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-slate-400 text-xs uppercase font-semibold">Expires</p>
                                        <p className="text-slate-700 font-medium">{cert.expiry}</p>
                                    </div>
                                </div>
                                <a href={`/preview/${cert.id}`} className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white py-2.5 rounded-xl font-medium hover:bg-slate-800 transition-colors">
                                    <Download className="h-4 w-4" /> View & Download
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
