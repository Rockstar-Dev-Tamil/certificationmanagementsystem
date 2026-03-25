'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Award,
  Layers,
  ScrollText,
  BarChart3,
  Settings,
  ExternalLink,
  ChevronRight,
  LogOut,
  ShieldCheck,
  User,
} from 'lucide-react';

import { cn } from '@/lib/cn';

export interface SidebarProps {
  user?: { name: string; email?: string; role?: string } | null;
}

const adminNavItems = [
  { label: 'Command Center', href: '/admin', icon: LayoutDashboard },
  { label: 'Issue Credentials', href: '/admin/issue', icon: Award },
  { label: 'Templates', href: '/admin/templates', icon: Layers },
  { label: 'Audit Ledger', href: '/admin/audit', icon: ScrollText },
  { label: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
];

const userNavItems = [
  { label: 'My Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'My Certificates', href: '/user', icon: Award },
  { label: 'Verify', href: '/verify', icon: ShieldCheck },
];

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const isAdmin = user?.role === 'admin';
  const navItems = isAdmin ? adminNavItems : userNavItems;

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/login';
  }

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-[260px] border-r border-slate-100 bg-white flex flex-col">
      {/* Brand Header */}
      <div className="h-20 px-6 flex items-center gap-3 border-b border-slate-50">
        <div className="h-10 w-10 bg-brand-600 rounded-xl flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-brand-100">C</div>
        <div>
          <div className="text-sm font-black text-slate-900 tracking-tighter leading-none">
            CertiSafe <span className="text-brand-600 italic">V2</span>
          </div>
          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
            {isAdmin ? 'Admin Console' : 'Credential Vault'}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-8 px-4 space-y-8">
        <div>
          <div className="px-4 mb-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
            {isAdmin ? 'Operations' : 'Navigation'}
          </div>
          <div className="space-y-1">
            {navItems.map((item) => {
              const active = pathname === item.href || (item.href !== '/' && item.href !== '/dashboard' && pathname.startsWith(item.href));
              const exactMatch = pathname === item.href;
              const isActive = item.href === '/dashboard' || item.href === '/admin' ? exactMatch : active;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200",
                    isActive
                      ? "bg-brand-600 text-white shadow-lg shadow-brand-100 ring-4 ring-brand-500/10"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={cn("h-4 w-4 shrink-0", isActive ? "text-white" : "text-slate-400 group-hover:text-brand-600")} />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <ChevronRight className="h-3 w-3 text-white/50" />}
                </Link>
              );
            })}
          </div>
        </div>

        {isAdmin && (
          <div>
            <div className="px-4 mb-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">System</div>
            <div className="space-y-1">
              <Link
                href="/admin/settings"
                className={cn(
                  "group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200",
                  pathname.startsWith('/admin/settings')
                    ? "bg-brand-600 text-white shadow-lg shadow-brand-100"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <Settings className={cn("h-4 w-4 shrink-0", pathname.startsWith('/admin/settings') ? "text-white" : "text-slate-400 group-hover:text-brand-600")} />
                <span>Settings</span>
              </Link>
              <a
                href="/verify"
                target="_blank"
                className="group flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-all duration-200"
              >
                <div className="flex items-center gap-3">
                  <ExternalLink className="h-4 w-4 text-slate-400 group-hover:text-brand-600 shrink-0" />
                  <span>Public Portal</span>
                </div>
              </a>
            </div>
          </div>
        )}
      </nav>

      {/* User Footer */}
      <div className="p-4 border-t border-slate-50">
        <div className="bg-slate-50 rounded-2xl p-4 flex items-center gap-3 group cursor-pointer hover:bg-brand-50 transition-colors">
          <div className={cn(
            "h-10 w-10 rounded-xl flex items-center justify-center font-black text-xs shadow-sm border",
            isAdmin
              ? "bg-brand-50 border-brand-100 text-brand-600"
              : "bg-white border-slate-200 text-slate-400"
          )}>
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="truncate text-xs font-black text-slate-900 tracking-tight">
              {user?.name || 'User'}
            </div>
            <div className="truncate text-[10px] text-slate-400 font-bold flex items-center gap-1">
              {isAdmin && <span className="inline-block w-1.5 h-1.5 rounded-full bg-brand-600 shrink-0"></span>}
              {user?.email || 'user@certisafe.io'}
            </div>
          </div>
          <button className="text-slate-400 hover:text-red-600 transition-colors" onClick={() => void handleLogout()} aria-label="Log out">
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
