'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Lock, Mail, Shield, CheckCircle } from 'lucide-react';

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [formData, setFormData] = React.useState({ email: '', password: '' });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data: any = await res.json();
      if (!res.ok) {
        setError(data.error || 'Invalid credentials. Please try again.');
        return;
      }
      router.push('/dashboard');
      router.refresh();
    } catch {
      setError('System communication failure. Please retry.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col lg:flex-row">
      {/* Narrative Section */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-50 border-r border-slate-100 flex-col p-16 justify-between relative overflow-hidden">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
            <div className="absolute inset-0 [background-image:linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] [background-size:40px_40px]"></div>
        </div>
        
        <div className="relative z-10">
            <Link href="/" className="flex items-center gap-2 mb-20">
                <div className="h-10 w-10 bg-brand-600 rounded-xl flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-brand-100">C</div>
                <span className="font-extrabold text-slate-900 tracking-tighter text-xl">CertiSafe <span className="text-slate-400 font-medium">Protocol</span></span>
            </Link>

            <div className="max-w-md">
                <h1 className="text-5xl font-black tracking-tighter text-slate-900 mb-6 leading-[1.1]">
                    Institutional Grade <span className="text-brand-600">Credentialing</span>.
                </h1>
                <p className="text-lg text-slate-500 font-medium mb-12 leading-relaxed">
                    Securely issue, manage, and verify digital assets with cryptographic certainty. Built for the modern educational ecosystem.
                </p>

                <div className="space-y-4">
                    {[
                        "End-to-end cryptographic integrity",
                        "Seamless institutional SSO integration",
                        "Real-time metadata auditing",
                        "Universal verification gateway"
                    ].map((feature, i) => (
                        <div key={i} className="flex items-center gap-3 text-slate-700 font-bold">
                            <div className="p-1 bg-brand-100 text-brand-600 rounded-md">
                                <CheckCircle className="h-4 w-4" />
                            </div>
                            {feature}
                        </div>
                    ))}
                </div>
            </div>
        </div>

        <div className="relative z-10">
            <div className="flex items-center gap-4 py-8 border-t border-slate-200">
                <div className="flex -space-x-2">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-8 w-8 rounded-full border-2 border-slate-50 bg-slate-200"></div>
                    ))}
                </div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Trusted by 500+ Organizations</p>
            </div>
        </div>
      </div>

      {/* Auth Section */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md animate-fade-up">
          <div className="lg:hidden flex justify-center mb-12">
            <div className="h-12 w-12 bg-brand-600 rounded-xl flex items-center justify-center text-white font-black text-2xl">C</div>
          </div>

          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-black tracking-tight text-slate-900 mb-2">Welcome Back</h2>
            <p className="text-slate-500 font-medium">Access your institutional command center.</p>
          </div>

          <Card padding="lg" className="shadow-2xl shadow-slate-100/50">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-bold flex items-center gap-2 animate-shake">
                <Shield className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Work Email</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-brand-600 transition-colors" />
                  <input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(p => ({ ...p, email: e.target.value }))}
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:bg-white focus:border-brand-200 transition-all shadow-inner"
                    placeholder="name@institution.edu"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between px-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Access Key</label>
                  <button type="button" className="text-[10px] font-black text-brand-600 uppercase tracking-widest hover:underline">Recovery</button>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-brand-600 transition-colors" />
                  <input
                    required
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData(p => ({ ...p, password: e.target.value }))}
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:bg-white focus:border-brand-200 transition-all shadow-inner"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full rounded-xl shadow-lg shadow-brand-100 mt-4"
                isLoading={loading}
                rightIcon={!loading ? <ArrowRight className="h-4 w-4" /> : undefined}
              >
                Establish Session
              </Button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-sm font-medium text-slate-400">
                New to the protocol?{" "}
                <Link href="/register" className="text-brand-600 font-bold hover:underline">Create Institution</Link>
              </p>
            </div>
          </Card>

          <div className="mt-12 flex justify-center items-center gap-6 opacity-40 grayscale pointer-events-none">
            <div className="h-6 w-auto flex items-center font-black text-slate-400 text-xs tracking-tighter uppercase italic">Institutional Security</div>
            <div className="h-1 w-1 rounded-full bg-slate-300"></div>
            <div className="h-6 w-auto flex items-center font-black text-slate-400 text-xs tracking-tighter uppercase italic">AES-256 Storage</div>
          </div>
        </div>
      </div>
    </div>
  );
}


