'use client';

import React from 'react';
import CertificatePreview from '../../components/CertificatePreview';
import { ArrowLeft } from 'lucide-react';

export default function PreviewPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = React.use(params);
    const [cert, setCert] = React.useState<any>(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        fetch('/api/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ certificateId: id })
        })
            .then(res => res.json())
            .then(data => {
                if (data.valid) {
                    setCert(data.data);
                }
                setLoading(false);
            })
            .catch(err => console.error(err));
    }, [id]);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <a
                href="/user"
                className="flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-8 font-medium transition-colors"
            >
                <ArrowLeft className="h-4 w-4" /> Back to Certificates
            </a>

            <div className="flex flex-col items-center">
                {loading ? (
                    <div className="text-slate-500">Loading certificate...</div>
                ) : cert ? (
                    <CertificatePreview
                        recipientName={cert.profiles?.full_name || 'N/A'}
                        courseTitle={cert.template_name || 'Certificate of Achievement'}
                        certificateId={cert.certificate_id}
                        issueDate={new Date(cert.issue_date).toLocaleDateString()}
                        expiryDate={cert.expiry_date && cert.expiry_date !== 'N/A' ? new Date(cert.expiry_date).toLocaleDateString() : undefined}
                        qrCodeDataUrl={cert.qr_code}
                        dataHash={cert.data_hash}
                    />
                ) : (
                    <div className="text-red-500 bg-red-50 p-8 rounded-2xl border border-red-100">
                        Certificate not found or invalid.
                    </div>
                )}
            </div>
        </div>
    );
}
