'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Award, Eye, Download, Calendar, Lock, ShieldCheck, Loader2, RefreshCcw, BarChart3, Clock, CheckCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(true);
  const [user, setUser] = React.useState<any>(null);
  const [certificates, setCertificates] = React.useState<any[]>([]);

  const fetchData = React.useCallback(async () => {
    setLoading(true);
    try {
      const userRes = await fetch('/api/auth/user');
      const userData = await userRes.json();

      if (!userData.user) {
        router.push('/login');
        return;
      }

      // If admin, redirect to admin dashboard
      if (userData.user.role === 'admin') {
        router.push('/admin');
        return;
      }

      setUser(userData.user);

      const certsRes = await fetch('/api/certificates');
      const certsData = await certsRes.json();
      if (Array.isArray(certsData)) {
        setCertificates(certsData);
      }
    } catch {
      // fail silently
    } finally {
      setLoading(false);
    }
  }, [router]);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-8">
        <Loader2 className="h-10 w-10 text-brand-600 animate-spin mb-4" />
        <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] animate-pulse">Loading Your Vault...</div>
      </div>
    );
  }

  const totalCerts = certificates.length;
  const validCerts = certificates.filter(c => c.status === 'valid').length;
  const expiredCerts = certificates.filter(c => c.status === 'expired').length;

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-12 animate-fade-in-up">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-emerald-100">Verified Member</div>
              <div className="h-1 w-1 rounded-full bg-slate-300"></div>
              <span className="text-[11px] font-bold text-slate-400">CertiSafe Protocol</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter">
              Welcome back, <span className="text-brand-600">{user?.full_name?.split(' ')[0] || 'User'}</span>
            </h1>
            <p className="text-slate-500 font-medium mt-2 text-lg">Your personal credential vault and verification center.</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="md" onClick={() => fetchData()}>
              <RefreshCcw className="h-4 w-4" />
            </Button>
            <Link href="/verify">
              <Button variant="primary" size="md" leftIcon={<ShieldCheck className="h-4 w-4" />}>
                Verify Certificate
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            { label: 'Total Certificates', value: totalCerts, icon: Award, color: 'bg-brand-600', textColor: 'text-brand-600' },
            { label: 'Active & Valid', value: validCerts, icon: CheckCircle, color: 'bg-emerald-500', textColor: 'text-emerald-500' },
            { label: 'Expired', value: expiredCerts, icon: Clock, color: 'bg-amber-500', textColor: 'text-amber-500' },
          ].map((stat, i) => (
            <div key={i} className="glass-card p-8 rounded-[2rem] bg-white border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-500 group">
              <div className="flex justify-between items-start mb-6">
                <div className={`p-3 ${stat.color}/10 rounded-xl`}>
                  <stat.icon className={`h-5 w-5 ${stat.textColor}`} />
                </div>
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{stat.label}</p>
              <p className="text-4xl font-black text-slate-900 tracking-tighter">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Certificates Section */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">My Credentials</h2>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Personal Achievement Registry</p>
          </div>
        </div>

        {certificates.length === 0 ? (
          <div className="text-center py-32 bg-slate-50/50 rounded-[3rem] border border-slate-100 flex flex-col items-center max-w-2xl mx-auto">
            <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mb-8 shadow-sm border border-slate-100">
              <ShieldCheck className="h-10 w-10 text-slate-200" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-4">No Credentials Yet</h3>
            <p className="text-slate-500 font-medium max-w-sm mb-8">Your credential vault is currently empty. Once an institution issues you a certificate, it will appear here.</p>
            <Link href="/verify">
              <Button variant="primary" rightIcon={<ArrowRight className="h-4 w-4" />}>
                Verify a Certificate
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {certificates.map((cert: any, i: number) => (
              <div key={i} className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden group hover:shadow-2xl hover:-translate-y-1 transition-all duration-500">
                <div className="h-44 bg-gradient-to-br from-slate-50 to-brand-50/30 flex items-center justify-center border-b border-slate-50 relative overflow-hidden">
                  <Award className="h-16 w-16 text-slate-200 group-hover:scale-110 group-hover:text-brand-200 transition-all duration-700" />
                  <div className="absolute top-5 right-5">
                    <div className={`px-3 py-1 backdrop-blur-md rounded-full border text-[10px] font-black uppercase tracking-widest ${
                      cert.status === 'valid'
                        ? 'bg-emerald-50/80 border-emerald-100 text-emerald-600'
                        : cert.status === 'expired'
                          ? 'bg-amber-50/80 border-amber-100 text-amber-600'
                          : 'bg-rose-50/80 border-rose-100 text-rose-600'
                    }`}>
                      {cert.status}
                    </div>
                  </div>
                </div>
                <div className="p-7">
                  <div className="flex justify-between items-start mb-5">
                    <h3 className="font-black text-slate-900 text-lg tracking-tight group-hover:text-brand-600 transition-colors leading-tight flex-1 mr-3">{cert.title}</h3>
                    <div className="p-2 bg-slate-50 rounded-lg shrink-0">
                      <Lock className="h-4 w-4 text-slate-300" />
                    </div>
                  </div>

                  <div className="space-y-3 mb-8">
                    <div className="flex items-center gap-3 text-slate-400">
                      <Calendar className="h-4 w-4" />
                      <div className="text-[11px] font-bold">{cert.date}</div>
                      {cert.expiry && cert.expiry !== 'N/A' && (
                        <>
                          <span className="text-slate-200">→</span>
                          <div className="text-[11px] font-bold">{cert.expiry}</div>
                        </>
                      )}
                    </div>
                    <div className="px-3 py-2.5 bg-slate-50 rounded-xl border border-slate-100">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Certificate ID</p>
                      <p className="font-mono text-[11px] font-bold text-slate-600 truncate">{cert.id}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <Link href={`/preview/${cert.id}`} className="flex items-center justify-center gap-2 bg-slate-900 text-white py-3.5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all active:scale-95 group/btn">
                      <Eye className="h-3.5 w-3.5 opacity-50 group-hover/btn:opacity-100" /> View
                    </Link>
                    <button className="flex items-center justify-center gap-2 bg-white border border-slate-100 text-slate-400 py-3.5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:text-brand-600 hover:border-brand-100 transition-all active:scale-95">
                      <Download className="h-3.5 w-3.5" /> Export
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
