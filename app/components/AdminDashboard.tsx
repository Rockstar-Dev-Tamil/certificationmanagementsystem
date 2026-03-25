'use client';

import React from 'react';
import { Plus, RefreshCcw, Award, ShieldCheck, UserCheck, TrendingUp, Search, Eye, Trash2, Download, Bell, Activity } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MetricCard } from '@/components/ui/MetricCard';
import { DataTable } from '@/components/ui/DataTable';
import { StatusPill } from '@/components/ui/StatusPill';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

interface AdminDashboardProps {
    stats: any;
    loading: boolean;
    onRefresh: () => void;
    onRevoke: (id: string) => void;
}

export default function AdminDashboard({ stats, loading, onRefresh, onRevoke }: AdminDashboardProps) {
    const exportToCSV = () => {
        if (!stats.recent) return;
        const headers = ['ID', 'Recipient', 'Email', 'Template', 'Date', 'Status', 'Hash'];
        const csvRows = stats.recent.map((row: any) => [
            row.certificate_id,
            row.full_name,
            row.recipient_email,
            row.template_name,
            new Date(row.issue_date).toLocaleString(),
            row.status,
            row.data_hash
        ]);

        const csvContent = [headers, ...csvRows].map(e => e.join(",")).join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `certisafe-ledger-${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const columns = [
        {
            key: 'id',
            header: 'Certificate ID',
            render: (row: any) => (
                <span className="font-mono text-[11px] text-slate-500 uppercase tracking-tight">
                    {row.certificate_id}
                </span>
            )
        },
        {
            key: 'recipient',
            header: 'Recipient',
            sortable: true,
            render: (row: any) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center font-bold text-slate-500 text-[10px]">
                        {row.full_name?.charAt(0) || 'U'}
                    </div>
                    <div>
                        <p className="font-bold text-slate-900">{row.full_name || 'N/A'}</p>
                        <p className="text-[10px] text-slate-400 font-medium">{row.recipient_email}</p>
                    </div>
                </div>
            )
        },
        {
            key: 'template',
            header: 'Template',
            render: (row: any) => (
                <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[11px] font-bold uppercase tracking-wider">
                    {row.template_name || 'Standard'}
                </span>
            )
        },
        {
            key: 'status',
            header: 'Status',
            render: (row: any) => <StatusPill status={row.status as any} />
        },
        {
            key: 'actions',
            header: '',
            render: (row: any) => (
                <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="View Detail">
                        <Eye className="h-4 w-4" />
                    </Button>
                    {row.status === 'valid' && (
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50" 
                            onClick={(e) => {
                                e.stopPropagation();
                                onRevoke(row.certificate_id);
                            }}
                            title="Revoke Certificate"
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            )
        }
    ];

    return (
        <div className="animate-fade-up">
            {/* Header Section */}
            <header className="flex flex-wrap items-end justify-between gap-6 mb-10">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="px-2 py-0.5 bg-brand-600 text-white rounded text-[10px] font-bold uppercase tracking-widest">Administrator</div>
                        <div className="h-1 w-1 rounded-full bg-slate-300"></div>
                        <span className="text-[11px] font-bold text-slate-400">CertiSafe Protocol V2.5</span>
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">Command Center</h1>
                    <p className="text-slate-500 font-medium mt-1">Real-time cryptographic asset monitoring & institutional orchestration.</p>
                </div>
                
                <div className="flex items-center gap-3">
                    <Button variant="outline" size="md" onClick={exportToCSV} leftIcon={<Download className="h-4 w-4" />}>
                        Generate Manifest
                    </Button>
                    <Button variant="outline" size="md" onClick={onRefresh} isLoading={loading}>
                        <RefreshCcw className="h-4 w-4" />
                    </Button>
                    <a href="/admin/issue-certificate" className="block">
                        <Button variant="primary" size="md" leftIcon={<Plus className="h-4 w-4" />}>
                            New Credential
                        </Button>
                    </a>
                </div>
            </header>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <MetricCard 
                    title="Total Issuance" 
                    value={stats.total || 0} 
                    icon={Award} 
                    trend={{ value: 8.4, isUp: true }}
                />
                <MetricCard 
                    title="Active Templates" 
                    value={stats.templates || 0} 
                    icon={ShieldCheck} 
                    description="Standardized Frameworks"
                />
                <MetricCard 
                    title="Unique Holders" 
                    value={stats.profiles || 0} 
                    icon={UserCheck} 
                    trend={{ value: 2.1, isUp: true }}
                />
                <MetricCard 
                    title="Network Load" 
                    value={stats.today || 0} 
                    icon={TrendingUp} 
                    description="24h Asset Interactions"
                />
            </div>

            {/* Main Content Grid (12-column baseline) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10">
                {/* Analytics Chart */}
                <Card className="lg:col-span-8 overflow-visible" padding="lg">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
                                <Activity className="h-5 w-5 text-brand-600" />
                                Protocol Activity
                            </h3>
                            <p className="text-xs font-medium text-slate-400 mt-0.5 uppercase tracking-wider">Asset Issuance Velocity (30D)</p>
                        </div>
                    </div>
                    
                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={stats.trend || []}>
                                <defs>
                                    <linearGradient id="colorPrimary" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#2563EB" stopOpacity={0.15}/>
                                        <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                                <XAxis 
                                    dataKey="date" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fill: '#94A3B8', fontSize: 10, fontWeight: 700 }} 
                                    dy={10} 
                                />
                                <YAxis 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fill: '#94A3B8', fontSize: 10, fontWeight: 700 }} 
                                />
                                <Tooltip 
                                    contentStyle={{ 
                                        borderRadius: '12px', 
                                        border: '1px solid #E2E8F0', 
                                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                        background: '#FFF'
                                    }} 
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey="count" 
                                    stroke="#2563EB" 
                                    strokeWidth={3}
                                    fillOpacity={1} 
                                    fill="url(#colorPrimary)" 
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* Audit Timeline */}
                <Card className="lg:col-span-4 bg-slate-900 text-white border-transparent" padding="lg">
                    <h3 className="text-lg font-bold mb-6 tracking-tight flex items-center gap-2">
                        <Bell className="h-5 w-5 text-brand-400" />
                        Live Security Audit
                    </h3>
                    
                    <div className="space-y-6 relative">
                        {/* Timeline Line */}
                        <div className="absolute left-[3px] top-2 bottom-0 w-[2px] bg-slate-800"></div>
                        
                        {(!stats.audits || stats.audits.length === 0) ? (
                            <p className="text-slate-500 text-xs font-bold italic uppercase">No events logged.</p>
                        ) : (
                            stats.audits.map((item: any, i: number) => (
                                <div key={i} className="pl-6 relative group transition-transform hover:translate-x-1">
                                    {/* Timeline Dot */}
                                    <div className="absolute left-0 top-[6px] w-[8px] h-[8px] rounded-full bg-brand-400 border-2 border-slate-900 z-10"></div>
                                    
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-brand-400">
                                            {item.action.replace('BLOCKCHAIN_', '').replace(/_/g, ' ')}
                                        </span>
                                        <span className="font-mono text-[9px] text-slate-500">
                                            {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                    <p className="text-sm font-bold text-slate-200 line-clamp-1 group-hover:text-white transition-colors">
                                        {item.target_id || 'Global System'}
                                    </p>
                                </div>
                            ))
                        )}
                    </div>
                    
                    <Button variant="ghost" className="w-full mt-10 border border-white/10 text-white/60 hover:text-white hover:bg-white/5 text-[10px] uppercase font-black tracking-widest">
                        Access Deep Ledger
                    </Button>
                </Card>
            </div>

            {/* Asset Table Section */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-slate-900 tracking-tight">Core Asset Registry</h2>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest italic">Immutable Transactional State</p>
                </div>
                
                <DataTable 
                    columns={columns} 
                    data={stats.recent || []} 
                    onRowClick={(row) => {
                        window.location.href = `/preview/${row.certificate_id}`;
                    }}
                />
            </div>
        </div>
    );
}


