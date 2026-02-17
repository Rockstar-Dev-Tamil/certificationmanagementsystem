'use client';

import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Download, Award, ShieldCheck, CheckCircle2, Globe, Lock } from 'lucide-react';

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
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    if (initialQrCode) {
      setQrCodeUrl(initialQrCode);
      return;
    }
    const generateQR = async () => {
      try {
        const liveBase = 'https://certificationmanagementsystem-nine.vercel.app';
        const verificationUrl = `${liveBase}/verify?id=${certificateId}`;
        const url = await QRCode.toDataURL(verificationUrl, {
          width: 140,
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
  }, [certificateId, initialQrCode, isMounted]);

  const downloadPDF = async () => {
    if (!certificateRef.current) return;

    // Temporarily remove transform for high-quality capture
    const originalStyle = certificateRef.current.style.transform;
    certificateRef.current.style.transform = 'none';

    const canvas = await html2canvas(certificateRef.current, {
      scale: 3,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff'
    });

    certificateRef.current.style.transform = originalStyle;

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'px',
      format: [canvas.width, canvas.height]
    });

    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
    pdf.save(`certisafe-credential-${certificateId}.pdf`);
  };

  if (!isMounted) {
    return (
      <div className="w-full max-w-[1000px] aspect-[1000/700] bg-slate-50 animate-pulse rounded-[2.5rem] flex items-center justify-center">
        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest italic">Loading Visual Component...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-12 group animate-fade-in-up w-full">
      {/* Premium Certificate Shell with Responsive Scaling */}
      <div className="w-full max-w-[1000px] overflow-hidden lg:overflow-visible flex justify-center">
        <div className="relative p-1 bg-gradient-to-br from-slate-200 via-white to-slate-300 rounded-[2rem] shadow-3xl origin-top scale-[0.35] sm:scale-[0.5] md:scale-[0.7] lg:scale-100 transition-transform duration-500 ease-in-out">
          <div
            ref={certificateRef}
            className="w-[1000px] h-[700px] bg-white p-20 relative flex flex-col items-center text-center overflow-hidden rounded-[1.8rem]"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            {/* Complex Security Background (Guilloche Pattern) */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
              style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #0e8ee9 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>

            <div className="absolute inset-10 border-[1px] border-slate-100 rounded-[1.2rem] pointer-events-none"></div>
            <div className="absolute inset-[11px] border-[4px] border-double border-slate-200 rounded-[1.1rem] pointer-events-none"></div>

            {/* Institutional Header */}
            <div className="mb-14 relative z-10 w-full flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center shadow-lg shadow-slate-200">
                  <ShieldCheck className="text-white h-7 w-7" />
                </div>
                <div className="text-left font-black tracking-tighter leading-none">
                  <div className="text-xl">CertiSafe</div>
                  <div className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">Institutional v2.4</div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1">Authenticated Ledger</div>
                <div className="font-mono text-xs font-bold text-slate-900 uppercase italic">NODE: LIVE-PRIMARY-01</div>
              </div>
            </div>

            {/* Certificate Main Label */}
            <div className="mb-14 relative z-10">
              <h1 className="text-7xl font-black text-slate-900 tracking-tighter uppercase mb-2 italic">Certificate</h1>
              <div className="flex items-center justify-center gap-4">
                <div className="h-px w-10 bg-brand-500 opacity-30"></div>
                <p className="text-xs font-black text-brand-600 tracking-[0.5em] uppercase">Professional Validation</p>
                <div className="h-px w-10 bg-brand-500 opacity-30"></div>
              </div>
            </div>

            {/* Content Body */}
            <div className="flex-1 flex flex-col justify-center items-center w-full relative z-10">
              <p className="text-xl text-slate-400 font-medium italic mb-6">This cryptographically secure credential is awarded to</p>
              <h2 className="text-6xl font-black text-slate-900 mb-10 pb-4 w-full text-balance tracking-tight">
                {recipientName}
              </h2>
              <p className="text-xl text-slate-400 font-medium italic mb-6">for successfully meeting the rigorous standards established by the</p>
              <h3 className="text-4xl font-black text-slate-900 uppercase tracking-tight mb-4 text-balance">
                {courseTitle}
              </h3>
              <div className="w-20 h-1 bg-brand-500 rounded-full mb-10"></div>
            </div>

            {/* Institutional Footer */}
            <div className="w-full flex justify-between items-end mt-12 relative z-10">
              <div className="text-left">
                <div className="mb-8 p-4 bg-slate-50 rounded-2xl border border-slate-100 max-w-[280px] shadow-inner">
                  <div className="flex items-center gap-3 text-slate-400 mb-2">
                    <Lock className="h-3 w-3" />
                    <p className="text-[10px] font-black uppercase tracking-widest">Protocol Identifier</p>
                  </div>
                  <p className="font-mono text-[11px] font-bold text-slate-600 break-all leading-tight italic">{certificateId}</p>
                </div>
                <div className="flex gap-12 pl-4">
                  <div>
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1 italic">Issued</p>
                    <p className="text-sm font-bold text-slate-900 tracking-tighter font-mono uppercase">{issueDate}</p>
                  </div>
                  {expiryDate && (
                    <div>
                      <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1 italic">Expiry</p>
                      <p className="text-sm font-bold text-slate-900 tracking-tighter font-mono uppercase">{expiryDate}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Central Seal (Aesthetic Only) */}
              <div className="absolute left-1/2 -translate-x-1/2 bottom-[0px] opacity-10 blur-sm pointer-events-none">
                <Award className="h-40 w-40 text-brand-600" />
              </div>

              <div className="flex items-center gap-16">
                {qrCodeUrl && (
                  <div className="flex flex-col items-center group/qr cursor-pointer">
                    <div className="p-3 bg-white border-2 border-slate-900 rounded-2xl shadow-xl transition-all group-hover/qr:scale-105 duration-500">
                      <img src={qrCodeUrl} alt="Verify" className="w-28 h-28" />
                    </div>
                    <p className="text-[9px] font-black text-slate-400 uppercase mt-4 tracking-widest italic flex items-center gap-2">
                      <Globe className="h-3 w-3" />
                      Global Verification
                    </p>
                  </div>
                )}

                <div className="text-right pb-4">
                  <div className="mb-6">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/3/3a/Jon_Kirsch_Signature.png" className="h-16 ml-auto opacity-70 grayscale contrast-125 brightness-110 border-b border-slate-200" alt="Signature" />
                  </div>
                  <p className="text-xs font-black text-slate-900 uppercase tracking-[0.2em]">Authority Signature</p>
                  <p className="text-[10px] text-brand-600 font-bold uppercase tracking-widest mt-1">CertiSafe Framework Director</p>
                </div>
              </div>
            </div>

            {/* Decorative Corner Seals */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/5 blur-[80px] rounded-full pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-violet-500/5 blur-[80px] rounded-full pointer-events-none"></div>
          </div>
        </div>
      </div>

      {/* Verification & Action Bar (Non-Printed) */}
      <div className="w-full max-w-[1000px] mt-[-400px] sm:mt-[-300px] md:mt-[-200px] lg:mt-0 bg-slate-900 rounded-[2.5rem] p-10 flex flex-col md:flex-row items-center justify-between text-white gap-10 shadow-3xl border border-white/5 relative overflow-hidden group">
        <div className="flex-1 min-w-0 relative z-10 w-full md:w-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-1.5 w-1.5 rounded-full bg-brand-500 animate-pulse"></div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">Cryptographic Signature (SHA-256)</p>
          </div>
          <div className="bg-white/5 border border-white/10 p-5 rounded-2xl shadow-inner">
            <code className="text-[11px] font-mono break-all text-brand-400 leading-relaxed italic font-medium">
              {dataHash || "PENDING_BLOCKCHAIN_SYNC_SIGNAL_ERR"}
            </code>
          </div>
        </div>

        <div className="flex gap-4 relative z-10 w-full md:w-auto">
          <button
            onClick={downloadPDF}
            className="flex-1 md:flex-none bg-white text-slate-900 hover:bg-slate-50 px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl group/btn"
          >
            <Download className="h-5 w-5 group-hover/btn:-translate-y-1 transition-transform" />
            Export Professional PDF
          </button>
          <button className="hidden md:flex p-5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all active:scale-95">
            <Globe className="h-5 w-5" />
          </button>
        </div>

        {/* Animation light streak */}
        <div className="absolute top-0 -left-1/2 w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-[-25deg] group-hover:left-[150%] transition-all duration-1000 pointer-events-none"></div>
      </div>
    </div>
  );
}

