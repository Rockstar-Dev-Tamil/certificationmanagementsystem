'use client';

import React from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50/30">
      <div className="hidden lg:block">
        <Sidebar />
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
