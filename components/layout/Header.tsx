'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, Terminal } from 'lucide-react';

import { cn } from '@/lib/cn';

function pathToCrumbs(pathname: string): Array<{ label: string; href: string }> {
  const parts = pathname.split('/').filter(Boolean);
  const crumbs: Array<{ label: string; href: string }> = [];
  let acc = '';
  for (const p of parts) {
    acc += `/${p}`;
    crumbs.push({
      label: p.replace(/-/g, ' ').replace(/\b\w/g, (m) => m.toUpperCase()),
      href: acc,
    });
  }
  return crumbs;
}

export interface HeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  action?: React.ReactNode;
}

export function Header({ className, action, ...props }: HeaderProps) {
  const pathname = usePathname();
  const crumbs = React.useMemo(() => pathToCrumbs(pathname), [pathname]);

  return (
    <header
      className={cn(
        "sticky top-0 z-30 flex h-20 items-center justify-between gap-4 border-b border-slate-50 bg-white/70 px-8 backdrop-blur-xl",
        className,
      )}
      {...props}
    >
      <nav className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest">
        <div className="flex items-center gap-2 text-slate-400 group">
          <Terminal className="h-3 w-3" />
          <Link href="/dashboard" className="hover:text-brand-600 transition-colors">
            Protocol
          </Link>
        </div>
        {crumbs.map((c, idx) => (
          <span key={c.href} className="flex items-center gap-3">
            <ChevronRight className="h-3 w-3 text-slate-200" />
            <Link
              href={c.href}
              className={cn(
                "transition-colors",
                idx === crumbs.length - 1 
                  ? "text-slate-900 px-3 py-1 bg-slate-50 rounded-lg italic" 
                  : "text-slate-400 hover:text-brand-600"
              )}
            >
              {c.label}
            </Link>
          </span>
        ))}
      </nav>
      {action ? <div className="shrink-0">{action}</div> : null}
    </header>
  );
}


