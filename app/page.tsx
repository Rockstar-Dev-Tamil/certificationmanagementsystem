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
    <div className="min-h-screen text-slate-900 overflow-hidden">
      {/* Hero Section */}
      <div className="relative pt-20 pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto animate-fade-in">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-brand-50 border border-brand-100 text-brand-700 font-bold text-sm mb-8 shadow-sm">
              <span className="flex h-2 w-2 rounded-full bg-brand-500 mr-2 animate-pulse"></span>
              CertiSafe V2 is now live
            </div>

            <h1 className="text-6xl md:text-7xl font-black text-slate-900 tracking-tight mb-8 leading-[1.1]">
              Secure Digital <span className="text-gradient">Certification</span> Management
            </h1>

            <p className="text-xl md:text-2xl text-slate-600 mb-12 leading-relaxed max-w-2xl mx-auto">
              Issue, manage, and verify professional certificates with ease. Prevent fraud and automate your entire certification lifecycle.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <a href="/admin" className="btn-primary flex items-center justify-center text-lg px-10 py-4">
                Get Started as Admin
              </a>
              <a href="/verify" className="btn-secondary flex items-center justify-center text-lg px-10 py-4 group">
                Verify a Certificate
                <ShieldCheck className="ml-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
              </a>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full -z-10 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-300 blur-[150px] rounded-full animate-float"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-violet/40 blur-[150px] rounded-full animate-float" style={{ animationDelay: '-1.5s' }}></div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">
        <div className="grid md:grid-cols-3 gap-8 relative">
          {[
            {
              icon: ShieldCheck,
              title: "Fraud Proof",
              desc: "QR-based instant verification ensures authenticity and built-in tamper protection.",
              bgColor: "bg-brand-500/10",
              textColor: "text-brand-600"
            },
            {
              icon: Clock,
              title: "Expiry Tracking",
              desc: "Automated alerts for certificate renewals and expirations to keep your pros compliant.",
              bgColor: "bg-accent-violet/10",
              textColor: "text-accent-violet-600"
            },
            {
              icon: LayoutDashboard,
              title: "Centralized Hub",
              desc: "Manage all your templates and issuances in one place with powerful analytics.",
              bgColor: "bg-accent-emerald/10",
              textColor: "text-accent-emerald-600"
            }
          ].map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div
                key={i}
                className="glass-card p-10 rounded-3xl group hover:-translate-y-2 transition-all duration-500 hover:bg-white/90"
              >
                <div className={`w-14 h-14 ${feature.bgColor} rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500`}>
                  <Icon className={`h-7 w-7 ${feature.textColor}`} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">{feature.title}</h3>
                <p className="text-slate-600 text-lg leading-relaxed">{feature.desc}</p>
                <div className="mt-8 flex items-center text-brand-600 font-bold group-hover:translate-x-2 transition-transform">
                  Learn more <span className="ml-2">→</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
