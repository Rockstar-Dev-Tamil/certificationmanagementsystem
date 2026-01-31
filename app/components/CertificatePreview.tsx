'use client';

import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Download, Award } from 'lucide-react';

interface CertificatePreviewProps {
  recipientName: string;
  courseTitle: string;
  certificateId: string;
  issueDate: string;
  expiryDate?: string;
}

export default function CertificatePreview({
  recipientName,
  courseTitle,
  certificateId,
  issueDate,
  expiryDate
}: CertificatePreviewProps) {
  const certificateRef = useRef<HTMLDivElement>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');

  useEffect(() => {
    const generateQR = async () => {
      try {
        // In a real app, this would be a link to the verification page
        const verificationUrl = `${window.location.origin}/verify?id=${certificateId}`;
        const url = await QRCode.toDataURL(verificationUrl, {
          width: 100,
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
  }, [certificateId]);

  const downloadPDF = async () => {
    if (!certificateRef.current) return;

    const canvas = await html2canvas(certificateRef.current, {
      scale: 2,
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
    <div className="flex flex-col items-center gap-6">
      {/* Certificate Container */}
      <div 
        ref={certificateRef}
        className="w-[800px] h-[560px] bg-white border-[16px] border-slate-900 p-12 relative flex flex-col items-center text-center shadow-2xl overflow-hidden"
        style={{ fontFamily: 'serif' }}
      >
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-32 h-32 border-t-8 border-l-8 border-blue-600 -translate-x-4 -translate-y-4" />
        <div className="absolute bottom-0 right-0 w-32 h-32 border-b-8 border-r-8 border-blue-600 translate-x-4 translate-y-4" />
        
        <div className="mb-8">
          <Award className="h-16 w-16 text-blue-600 mx-auto mb-4" />
          <h1 className="text-5xl font-bold text-slate-900 tracking-widest uppercase">Certificate</h1>
          <p className="text-xl text-slate-500 mt-2 tracking-[0.2em] uppercase">of Achievement</p>
        </div>

        <div className="flex-1 flex flex-col justify-center">
          <p className="text-lg text-slate-600 italic mb-2">This is to certify that</p>
          <h2 className="text-4xl font-bold text-slate-900 mb-6 border-b-2 border-slate-200 pb-2 px-8 inline-block mx-auto">
            {recipientName}
          </h2>
          <p className="text-lg text-slate-600 italic mb-2">has successfully completed the course</p>
          <h3 className="text-2xl font-bold text-blue-600 uppercase tracking-wide">
            {courseTitle}
          </h3>
        </div>

        <div className="w-full flex justify-between items-end mt-8">
          <div className="text-left">
            <div className="mb-4">
              <p className="text-xs text-slate-400 uppercase font-bold">Certificate ID</p>
              <p className="text-sm font-mono text-slate-700">{certificateId}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase font-bold">Issued On</p>
              <p className="text-sm text-slate-700">{issueDate}</p>
              {expiryDate && (
                <>
                  <p className="text-xs text-slate-400 uppercase font-bold mt-2">Expires On</p>
                  <p className="text-sm text-slate-700">{expiryDate}</p>
                </>
              )}
            </div>
          </div>

          <div className="flex flex-col items-center">
            {qrCodeUrl && (
              <img src={qrCodeUrl} alt="Verification QR Code" className="w-24 h-24 border border-slate-100 p-1 bg-white" />
            )}
            <p className="text-[10px] text-slate-400 mt-2 uppercase font-bold">Scan to Verify</p>
          </div>

          <div className="text-right">
            <div className="w-40 border-b border-slate-900 mb-2" />
            <p className="text-sm font-bold text-slate-900">Authorized Signatory</p>
            <p className="text-xs text-slate-500">CertiSafe Platform</p>
          </div>
        </div>
      </div>

      <button 
        onClick={downloadPDF}
        className="flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
      >
        <Download className="h-5 w-5" /> Download Certificate PDF
      </button>
    </div>
  );
}
