'use client';

import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Download, Award, ShieldCheck } from 'lucide-react';

interface CertificatePreviewProps {
  recipientName: string;
  courseTitle: string;
  certificateId: string;
  issueDate: string;
  expiryDate?: string;
  qrCodeDataUrl?: string;
  dataHash?: string;
}

export default function CertificatePreview({
  recipientName,
  courseTitle,
  certificateId,
  issueDate,
  expiryDate,
  qrCodeDataUrl: initialQrCode,
  dataHash
}: CertificatePreviewProps) {
  const certificateRef = useRef<HTMLDivElement>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>(initialQrCode || '');

  useEffect(() => {
    if (initialQrCode) {
      setQrCodeUrl(initialQrCode);
      return;
    }
    const generateQR = async () => {
      try {
        const verificationUrl = `${window.location.origin}/verify?id=${certificateId}`;
        const url = await QRCode.toDataURL(verificationUrl, {
          width: 120,
          margin: 1,
          color: {
            dark: '#0f172a',
            light: '#ffffff',
          },
        });
        setQrCodeUrl(url);
      } catch (err) {
        console.error(err);
      }
    };
    generateQR();
  }, [certificateId, initialQrCode]);

  const downloadPDF = async () => {
    if (!certificateRef.current) return;

    const canvas = await html2canvas(certificateRef.current, {
      scale: 3,
      useCORS: true,
      logging: false,
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'px',
      format: [canvas.width, canvas.height]
    });

    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
    pdf.save(`certificate-${certificateId}.pdf`);
  };

  return (
    <div className="flex flex-col items-center gap-8">
      {/* Certificate Page */}
      <div
        ref={certificateRef}
        className="w-[900px] h-[640px] bg-white border-[20px] border-slate-900 p-16 relative flex flex-col items-center text-center shadow-2xl overflow-hidden"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        {/* Design Accents */}
        <div className="absolute top-0 left-0 w-40 h-40 border-t-8 border-l-8 border-brand-600 -translate-x-4 -translate-y-4" />
        <div className="absolute bottom-0 right-0 w-40 h-40 border-b-8 border-r-8 border-brand-600 translate-x-4 translate-y-4" />

        <div className="mb-12">
          <Award className="h-16 w-16 text-brand-600 mx-auto mb-4" />
          <h1 className="text-6xl font-black text-slate-900 tracking-tighter uppercase mb-2">Certificate</h1>
          <p className="text-xl font-bold text-slate-400 tracking-[0.3em] uppercase">Digital Excellence</p>
        </div>

        <div className="flex-1 flex flex-col justify-center items-center w-full">
          <p className="text-lg text-slate-500 italic mb-4">This high-integrity credential is proudly presented to</p>
          <h2 className="text-5xl font-black text-slate-900 mb-8 border-b-4 border-slate-100 pb-4 w-full text-balance">
            {recipientName}
          </h2>
          <p className="text-lg text-slate-500 italic mb-4">for the successful completion of the specialized program</p>
          <h3 className="text-3xl font-black text-brand-600 uppercase tracking-tight mb-8 text-balance">
            {courseTitle}
          </h3>
        </div>

        <div className="w-full flex justify-between items-end mt-12">
          <div className="text-left">
            <div className="mb-6">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Certificate Identifier</p>
              <p className="font-mono text-sm font-bold text-slate-900">{certificateId}</p>
            </div>
            <div className="flex gap-10">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Issue Date</p>
                <p className="text-sm font-bold text-slate-900">{issueDate}</p>
              </div>
              {expiryDate && (
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Expiry Date</p>
                  <p className="text-sm font-bold text-slate-900">{expiryDate}</p>
                </div>
              )}
            </div>
          </div>

          {qrCodeUrl && (
            <div className="flex flex-col items-center">
              <img src={qrCodeUrl} alt="Verify" className="w-24 h-24 border-2 border-slate-900 rounded-lg p-1" />
              <p className="text-[8px] font-black text-slate-400 uppercase mt-2">Scan to Authenticate</p>
            </div>
          )}

          <div className="text-right">
            <div className="w-48 border-b-2 border-slate-900 mb-2" />
            <p className="text-sm font-black text-slate-900 uppercase">Director of Certification</p>
            <p className="text-xs text-slate-500">CertiSafe Identity Protocol</p>
          </div>
        </div>

        {/* Anti-Tamper Badge */}
        <div className="absolute top-12 right-12 opacity-10">
          <ShieldCheck className="h-24 w-24 text-brand-600" />
        </div>
      </div>

      {/* Verification Footer (Non-Printed) */}
      <div className="w-full max-w-[900px] bg-slate-900 rounded-3xl p-8 flex items-center justify-between text-white">
        <div className="flex-1 mr-8">
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Cryptographic Fingerprint (SHA-256)</p>
          <code className="text-[10px] font-mono bg-slate-800 p-2 rounded block break-all text-blue-400">
            {dataHash || "Not Available"}
          </code>
        </div>
        <button
          onClick={downloadPDF}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-black flex items-center gap-3 transition-all active:scale-95 whitespace-nowrap"
        >
          <Download className="h-5 w-5" /> Download PDF
        </button>
      </div>
    </div>
  );
}
