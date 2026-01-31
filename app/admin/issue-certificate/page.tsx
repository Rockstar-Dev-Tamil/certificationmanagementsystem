'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle, Loader2 } from 'lucide-react';

export default function IssueCertificatePage() {
    const router = useRouter();
    const [loading, setLoading] = React.useState(false);
    const [success, setSuccess] = React.useState<string | null>(null);

    const [formData, setFormData] = React.useState({
        recipient_name: '',
        recipient_email: '',
        course_title: '',
        expiry_date: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setSuccess(null);

        try {
            const res = await fetch('/api/issue', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (res.ok) {
                setSuccess(data.data.certificate_id);
                setFormData({ recipient_name: '', recipient_email: '', course_title: '', expiry_date: '' });
            } else {
                alert(data.error || 'Failed to issue certificate');
            }
        } catch (err) {
            console.error(err);
            alert('An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto px-4 py-8">
            <button onClick={() => router.back()} className="mb-6 flex items-center text-slate-500 hover:text-slate-900 transition-colors">
                <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
            </button>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Issue New Certificate</h2>

                {success && (
                    <div className="mb-6 p-4 bg-emerald-50 text-emerald-700 rounded-lg flex items-center">
                        <CheckCircle className="h-5 w-5 mr-3" />
                        <div>
                            <p className="font-medium">Certificate Issued Successfully!</p>
                            <p className="text-sm mt-1">ID: {success}</p>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Recipient Name</label>
                            <input
                                required
                                type="text"
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                value={formData.recipient_name}
                                onChange={e => setFormData({ ...formData, recipient_name: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Recipient Email</label>
                            <input
                                required
                                type="email"
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                value={formData.recipient_email}
                                onChange={e => setFormData({ ...formData, recipient_email: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Course / Event Title</label>
                        <input
                            required
                            type="text"
                            placeholder="e.g. Advanced Web Development"
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            value={formData.course_title}
                            onChange={e => setFormData({ ...formData, course_title: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Expiry Date (Optional)</label>
                        <input
                            type="date"
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            value={formData.expiry_date}
                            onChange={e => setFormData({ ...formData, expiry_date: e.target.value })}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors flex justify-center items-center disabled:opacity-70"
                    >
                        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Issue Certificate'}
                    </button>
                </form>
            </div>
        </div>
    );
}
