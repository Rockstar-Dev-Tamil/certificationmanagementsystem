'use client';

import React from 'react';
import { ShieldCheck, Clock, LayoutDashboard } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  React.useEffect(() => {
    fetch('/api/auth/user')
      .then(res => res.json())
      .then(data => {
        if (data.user) router.push('/dashboard');
      });
  }, [router]);

  return (
    <div className="min-h-screen font-sans text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-5xl font-extrabold text-slate-900 tracking-tight mb-6">
            Secure Digital <span className="text-blue-600">Certification</span> Management
          </h1>
          <p className="text-xl text-slate-600 mb-10">
            Issue, manage, and verify professional certificates with ease. Prevent fraud and automate your entire certification lifecycle.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a href="/admin" className="px-8 py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all">
              Get Started as Admin
            </a>
            <a href="/verify" className="px-8 py-4 bg-white text-slate-900 border border-slate-200 rounded-xl font-bold text-lg hover:bg-slate-50 transition-all">
              Verify a Certificate
            </a>
          </div>
        </div>

        <div className="mt-24 grid md:grid-cols-3 gap-8">
          {[
            { icon: ShieldCheck, title: "Fraud Proof", desc: "QR-based instant verification ensures authenticity." },
            { icon: Clock, title: "Expiry Tracking", desc: "Automated alerts for certificate renewals and expirations." },
            { icon: LayoutDashboard, title: "Centralized Hub", desc: "Manage all your templates and issuances in one place." }
          ].map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-6">
                  <Icon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600">{feature.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
