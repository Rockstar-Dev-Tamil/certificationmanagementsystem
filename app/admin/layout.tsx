'use client';

import React from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { useRouter } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const router = useRouter();

  React.useEffect(() => {
    fetch('/api/auth/user')
      .then(res => res.json())
      .then(data => {
        if (!data.user || data.user.role !== 'admin') {
          router.push('/dashboard');
        } else {
          setUser(data.user);
        }
        setLoading(false);
      })
      .catch(() => {
        router.push('/login');
      });
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="h-2 w-24 bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-brand-600 animate-progress origin-left"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/10">
      <div className="hidden lg:block">
        <Sidebar user={{ name: user?.full_name || user?.name, email: user?.email }} />
      </div>
      <div className="lg:pl-[260px]">
        <Header />
        <main className="min-h-[calc(100vh-5rem)]">
          {children}
        </main>
      </div>
    </div>
  );
}
