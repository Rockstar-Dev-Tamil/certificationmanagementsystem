'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Lock, Mail, Shield, User, Building, CheckCircle, KeyRound } from 'lucide-react';

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

type Role = 'admin' | 'user';

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [formData, setFormData] = React.useState({
    fullName: '',
    email: '',
    password: '',
    role: 'user' as Role,
    orgSecret: '',
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data: any = await res.json();
      if (!res.ok) {
        setError(data.error || 'Registration failed. Please check inputs.');
        return;
      }
      router.push(data?.user?.role === 'admin' ? '/dashboard' : '/user');
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
                    Establish Your <span className="text-brand-600">Infrastructure</span>.
                </h1>
                <p className="text-lg text-slate-500 font-medium mb-12 leading-relaxed">
                    Join the global network of trusted issuers. Set up your institutional workspace and begin issuing verified cryptographic assets today.
                </p>

                <div className="space-y-6">
                    {[
                        { title: "Standardized Frameworks", desc: "Access the template library for industrial standards." },
                        { title: "Immutable Audit Trails", desc: "Every issuance is logged in our high-density ledger." },
                        { title: "Role-Based Orchestration", desc: "Manage granular permissions for your entire faculty." }
                    ].map((feature, i) => (
                        <div key={i} className="flex gap-4">
                            <div className="mt-1 p-1 bg-brand-100 text-brand-600 rounded-md h-fit">
                                <CheckCircle className="h-4 w-4" />
                            </div>
                            <div>
                                <div className="font-black text-slate-900 text-sm uppercase tracking-tight">{feature.title}</div>
                                <div className="text-slate-500 text-sm font-medium">{feature.desc}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        <div className="relative z-10">
            <div className="px-6 py-4 bg-white border border-slate-200 rounded-2xl shadow-sm inline-flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Network Status: Operational</span>
            </div>
        </div>
      </div>

      {/* Auth Section */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white overflow-y-auto">
        <div className="w-full max-w-md my-auto animate-fade-up">
          <div className="lg:hidden flex justify-center mb-12">
            <div className="h-12 w-12 bg-brand-600 rounded-xl flex items-center justify-center text-white font-black text-2xl">C</div>
          </div>

          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-black tracking-tight text-slate-900 mb-2">Create Workspace</h2>
            <p className="text-slate-500 font-medium">Join the institutional certification ecosystem.</p>
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
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Full Name</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-brand-600 transition-colors" />
                  <input
                    required
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData(p => ({ ...p, fullName: e.target.value }))}
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:bg-white focus:border-brand-200 transition-all shadow-inner"
                    placeholder="Jane Doe"
                  />
                </div>
              </div>

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
                    placeholder="jane@university.edu"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Access Key</label>
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

              {formData.role === 'admin' && (
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Organization Secret</label>
                  <div className="relative group">
                    <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-brand-600 transition-colors" />
                    <input
                      type="password"
                      value={formData.orgSecret}
                      onChange={(e) => setFormData(p => ({ ...p, orgSecret: e.target.value }))}
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:bg-white focus:border-brand-200 transition-all shadow-inner"
                      placeholder="Enter the organization bootstrap secret"
                    />
                  </div>
                  <p className="text-[11px] font-medium text-slate-400">
                    The first admin can bootstrap the workspace without this secret. Later admin signups require it.
                  </p>
                </div>
              )}

              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Account Classification</label>
                <div className="grid grid-cols-2 gap-3">
                    <button 
                        type="button"
                        onClick={() => setFormData(p => ({ ...p, role: 'user' }))}
                        className={`p-4 rounded-xl border text-left transition-all ${formData.role === 'user' ? 'border-brand-600 bg-brand-50 ring-2 ring-brand-500/10' : 'border-slate-100 bg-slate-50 hover:bg-slate-100'}`}
                    >
                        <User className={`h-5 w-5 mb-2 ${formData.role === 'user' ? 'text-brand-600' : 'text-slate-400'}`} />
                        <div className="text-xs font-black text-slate-900 uppercase tracking-tight">Individual</div>
                        <div className="text-[9px] font-bold text-slate-400 leading-tight mt-1">Personal asset vault & verification.</div>
                    </button>
                    <button 
                        type="button"
                        onClick={() => setFormData(p => ({ ...p, role: 'admin' }))}
                        className={`p-4 rounded-xl border text-left transition-all ${formData.role === 'admin' ? 'border-brand-600 bg-brand-50 ring-2 ring-brand-500/10' : 'border-slate-100 bg-slate-50 hover:bg-slate-100'}`}
                    >
                        <Building className={`h-5 w-5 mb-2 ${formData.role === 'admin' ? 'text-brand-600' : 'text-slate-400'}`} />
                        <div className="text-xs font-black text-slate-900 uppercase tracking-tight">Institution</div>
                        <div className="text-[9px] font-bold text-slate-400 leading-tight mt-1">Issuance, templates, and full auditing.</div>
                    </button>
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
                Assemble Account
              </Button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-sm font-medium text-slate-400">
                Already registered?{" "}
                <Link href="/login" className="text-brand-600 font-bold hover:underline">Establish Session</Link>
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}


