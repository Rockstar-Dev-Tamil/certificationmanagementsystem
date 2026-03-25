'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ShieldAlert, RefreshCcw, Loader2 } from 'lucide-react';
import AdminDashboard from '@/app/components/AdminDashboard';
import { Button } from '@/components/ui/Button';

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(true);
  const [user, setUser] = React.useState<any>(null);
  const [stats, setStats] = React.useState<any>(null);
  const [error, setError] = React.useState<string | null>(null);

  const fetchData = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const userRes = await fetch('/api/auth/user');
      const userData = await userRes.json();
      
      if (!userData.user) {
        router.push('/login');
        return;
      }
      setUser(userData.user);

      if (userData.user.role === 'admin') {
        const analyticsRes = await fetch('/api/analytics');
        const analyticsData = await analyticsRes.json();
        
        if (analyticsData.error) {
          setError(analyticsData.error);
        } else {
          setStats(analyticsData);
        }
      } else {
        setError('UNAUTHORIZED_ACCESS_LEVEL: Issuer permissions required.');
      }
    } catch (err) {
      setError('PROTOCOL_TIMEOUT: Failed to sync with certificate ledger.');
    } finally {
      setLoading(false);
    }
  }, [router]);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleRevoke = async (id: string) => {
    const reason = window.prompt('Security Protocol: Specify revocation reason (Auditable)');
    if (!reason) return;

    try {
      const res = await fetch('/api/revoke', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ certificateId: id, reason })
      });
      if (res.ok) {
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-8">
        <Loader2 className="h-10 w-10 text-brand-600 animate-spin mb-4" />
        <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] animate-pulse">Syncing Secure Nodes...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20 flex flex-col items-center text-center">
        <div className="h-20 w-20 bg-red-50 rounded-[2.5rem] flex items-center justify-center mb-8 border border-red-100 shadow-xl shadow-red-50 animate-shake">
          <ShieldAlert className="h-10 w-10 text-red-600" />
        </div>
        <h2 className="text-4xl font-black text-slate-900 tracking-tighter mb-4 italic uppercase">System Disruption</h2>
        <p className="text-slate-500 font-medium max-w-md mb-10 leading-relaxed italic">{error}</p>
        <div className="flex gap-4">
          <Button variant="outline" onClick={() => fetchData()} leftIcon={<RefreshCcw className="h-4 w-4" />}>
            Manual Sync
          </Button>
          <Button variant="primary" onClick={() => router.push('/verify')}>
            Gateway Portal
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {user?.role === 'admin' ? (
          <AdminDashboard 
            stats={stats} 
            loading={loading} 
            onRefresh={fetchData} 
            onRevoke={handleRevoke} 
          />
        ) : (
          <div className="text-center py-40">
            <h1 className="text-2xl font-black text-slate-400 italic">UNAUTHORIZED ROLE ACCESS</h1>
          </div>
        )}
      </div>
    </div>
  );
}


