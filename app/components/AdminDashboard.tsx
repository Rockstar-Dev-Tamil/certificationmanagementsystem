'use client';

import React from 'react';
import { Plus, RefreshCcw, Award, ShieldCheck, UserCheck, TrendingUp, Search, Filter, Eye, Trash2, MoreHorizontal } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface AdminDashboardProps {
    stats: any;
    loading: boolean;
    onRefresh: () => void;
    onRevoke: (id: string) => void;
}

export default function AdminDashboard({ stats, loading, onRefresh, onRevoke }: AdminDashboardProps) {
    return (
        <div className="animate-fade-in">
            {/* Superior Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="px-3 py-1 bg-brand-600 text-white rounded-lg text-[10px] font-black uppercase tracking-widest italic shadow-lg shadow-brand-200">System Admin</div>
                        <span className="h-1 w-1 rounded-full bg-slate-300"></span>
                        <span className="text-xs font-bold text-slate-400">V2.4.1 Stable Build</span>
                    </div>
                    <h2 className="text-5xl font-black text-slate-900 tracking-tighter">Command Center</h2>
                    <p className="text-slate-500 mt-2 font-medium text-lg italic">CertiSafe Enterprise Infrastructure Monitor.</p>
                </div>
                <div className="flex gap-4 w-full md:w-auto">
                    <button
                        onClick={onRefresh}
                        className="flex-1 md:flex-none p-4 bg-white border border-slate-200 rounded-2xl text-slate-600 hover:bg-slate-50 transition-colors"
                    >
                        <RefreshCcw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                    <a href="/admin/issue-certificate" className="flex-1 md:flex-none bg-brand-600 text-white px-8 py-4 rounded-2xl font-black text-sm hover:bg-brand-700 shadow-2xl shadow-brand-100 transition-all flex items-center justify-center gap-3 active:scale-95 group">
                        <Plus className="h-5 w-5 group-hover:rotate-90 transition-transform" />
                        Generate New Credential
                    </a>
                </div>
            </div>

            {/* Dynamic Metric Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
                {[
                    { label: "Total Assets Issued", value: stats.total?.toString() || '0', color: "bg-brand-600", icon: Award },
                    { label: "Active Frameworks", value: "3", color: "bg-violet-600", icon: ShieldCheck },
                    { label: "Compliance Audits", value: "24", color: "bg-amber-500", icon: UserCheck },
                    { label: "Real-time Traffic", value: stats.today?.toString() || '0', color: "bg-emerald-500", icon: TrendingUp }
                ].map((stat, i) => (
                    <div key={i} className="glass-card p-10 rounded-[2.5rem] bg-white border-transparent hover:border-brand-100 transition-all group relative overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-1 duration-500">
                        <div className="relative z-10 flex flex-col justify-between h-full">
                            <div className="flex justify-between items-start mb-10">
                                <div className={`p-4 ${stat.color}/10 rounded-2xl`}>
                                    <stat.icon className={`h-6 w-6 ${stat.color.replace('bg-', 'text-')}`} />
                                </div>
                                <span className="text-[10px] font-black text-emerald-500">+12.5%</span>
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{stat.label}</p>
                                <p className="text-5xl font-black text-slate-900 tracking-tighter">{stat.value}</p>
                            </div>
                        </div>
                        <div className={`absolute -right-10 -bottom-10 w-40 h-40 ${stat.color} opacity-[0.03] rounded-full blur-3xl group-hover:opacity-10 transition-opacity`}></div>
                    </div>
                ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-12 mb-16">
                {/* Main Intelligence View */}
                <div className="lg:col-span-2 glass-card p-10 rounded-[3rem] bg-white">
                    <div className="flex items-center justify-between mb-12">
                        <div>
                            <h3 className="font-black text-slate-900 text-2xl tracking-tight">Issuance Analytics</h3>
                            <p className="text-slate-400 text-xs font-bold mt-1 uppercase tracking-widest">Global Protocol Activity</p>
                        </div>
                        <div className="flex gap-2">
                            <button className="px-4 py-2 bg-slate-50 text-[10px] font-black text-slate-400 rounded-xl hover:text-brand-600">7D</button>
                            <button className="px-4 py-2 bg-brand-50 text-[10px] font-black text-brand-600 rounded-xl">30D</button>
                        </div>
                    </div>
                    <div className="h-96 w-full mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={stats.trend || []}>
                                <defs>
                                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#0e8ee9" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#0e8ee9" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 800 }} dy={15} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 800 }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.1)', padding: '20px', fontWeight: 'bold' }}
                                />
                                <Area type="monotone" dataKey="count" stroke="#0e8ee9" fillOpacity={1} fill="url(#colorCount)" strokeWidth={6} dot={{ r: 4, fill: '#fff', stroke: '#0e8ee9', strokeWidth: 3 }} activeDot={{ r: 8, stroke: '#0e8ee9', strokeWidth: 4 }} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Right panel: Alerts/Updates */}
                <div className="glass-card p-10 rounded-[3rem] bg-slate-900 text-white relative overflow-hidden">
                    <div className="relative z-10">
                        <h3 className="font-black text-xl mb-10 tracking-tight">Security Alerts</h3>
                        <div className="space-y-8">
                            {[
                                { type: "Critical", msg: "Invalid QR scan detected in region AS-E1", time: "2m ago", color: "text-rose-400" },
                                { type: "Info", msg: "Institutional framework V2 deployed", time: "1h ago", color: "text-emerald-400" },
                                { type: "Notice", msg: "New admin 'Rockstar' provisioned", time: "3h ago", color: "text-brand-400" },
                                { type: "Audit", msg: "Bulk issuance completed (1.2k IDs)", time: "5h ago", color: "text-violet-400" },
                            ].map((item, i) => (
                                <div key={i} className="flex gap-5 group cursor-pointer hover:translate-x-2 transition-transform">
                                    <div className={`w-1 h-12 rounded-full ${item.color.replace('text-', 'bg-')} opacity-30 group-hover:opacity-100 transition-opacity`}></div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${item.color}`}>{item.type}</span>
                                            <span className="w-1 h-1 bg-slate-700 rounded-full"></span>
                                            <span className="text-[10px] font-bold text-slate-500 italic">{item.time}</span>
                                        </div>
                                        <p className="text-sm font-bold text-slate-300 leading-tight group-hover:text-white transition-colors">{item.msg}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="w-full mt-16 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-colors">View Security Logs</button>
                    </div>
                    <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-brand-600/20 blur-[100px] rounded-full pointer-events-none"></div>
                </div>
            </div>

            {/* Modern Transaction Log */}
            <div className="glass-card rounded-[3rem] bg-white overflow-hidden shadow-2xl shadow-slate-200">
                <div className="px-10 py-10 border-b border-slate-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h3 className="font-black text-slate-900 text-2xl tracking-tight">Core Asset Registry</h3>
                        <p className="text-slate-400 text-xs font-bold mt-1 uppercase tracking-widest italic">Immutable Transactional Ledger</p>
                    </div>
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="relative flex-1 md:flex-none group">
                            <Search className="h-4 w-4 absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-600 transition-colors" />
                            <input type="text" placeholder="Protocol Hash / Name..." className="pl-14 pr-6 py-4 bg-slate-50 border border-transparent rounded-[1.25rem] text-sm font-bold focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:bg-white focus:border-brand-100 transition-all w-full md:w-80 shadow-inner" />
                        </div>
                        <button className="p-4 bg-slate-50 rounded-[1.25rem] hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200">
                            <Filter className="h-5 w-5 text-slate-500" />
                        </button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50/50 text-slate-400 text-[10px] uppercase font-black tracking-[0.2em]">
                            <tr>
                                <th className="px-10 py-6">ID Key</th>
                                <th className="px-10 py-6">Identity Registry</th>
                                <th className="px-10 py-6">Framework</th>
                                <th className="px-10 py-6">Timestamp</th>
                                <th className="px-10 py-6">Validation Status</th>
                                <th className="px-10 py-6 text-right">Terminal</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 italic">
                            {loading ? (
                                <tr><td colSpan={6} className="px-10 py-20 text-center font-black animate-pulse text-slate-300 tracking-widest uppercase italic">Initializing Data Interface...</td></tr>
                            ) : stats.recent?.length === 0 ? (
                                <tr><td colSpan={6} className="px-10 py-20 text-center text-slate-400 font-bold italic tracking-tighter">THE LEDGER IS VACANT. AWAITING INITIAL ISSUANCE.</td></tr>
                            ) : (
                                stats.recent?.map((row: any, i: number) => (
                                    <tr key={i} className="hover:bg-brand-50/20 transition-all group duration-300">
                                        <td className="px-10 py-6 text-slate-400 text-[10px] font-black group-hover:text-brand-600 transition-colors tracking-tighter">{row.certificate_id}</td>
                                        <td className="px-10 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-black text-slate-400 text-xs shrink-0 group-hover:bg-white group-hover:shadow-md transition-all">
                                                    {row.full_name?.charAt(0) || 'U'}
                                                </div>
                                                <div>
                                                    <p className="font-extrabold text-slate-900 tracking-tight group-hover:text-brand-600 transition-colors">{row.full_name || 'N/A'}</p>
                                                    <p className="text-[10px] text-slate-400 font-black italic">{row.recipient_email || 'No email registered'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-6">
                                            <p className="text-sm font-black text-slate-700 uppercase tracking-tighter">{row.template_name || 'Generic Base'}</p>
                                        </td>
                                        <td className="px-10 py-6">
                                            <p className="text-xs font-bold text-slate-500">{new Date(row.issue_date).toLocaleDateString()} @ {new Date(row.issue_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                        </td>
                                        <td className="px-10 py-6">
                                            <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.1em] ${row.status === 'valid' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600 animate-pulse'}`}>
                                                <div className={`w-1.5 h-1.5 rounded-full ${row.status === 'valid' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                                                {row.status}
                                            </span>
                                        </td>
                                        <td className="px-10 py-6 text-right">
                                            <div className="flex justify-end items-center gap-2 group-hover:translate-x-[-8px] transition-transform duration-500">
                                                <a href={`/preview/${row.certificate_id}`} className="p-3 bg-slate-50 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-xl transition-all shadow-sm" title="View Asset">
                                                    <Eye className="h-4 w-4" />
                                                </a>
                                                {row.status === 'valid' && (
                                                    <button
                                                        onClick={() => onRevoke(row.certificate_id)}
                                                        className="p-3 bg-slate-50 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all shadow-sm"
                                                        title="Revoke Protocol"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                )}
                                                <button className="p-3 bg-slate-50 text-slate-400 hover:bg-slate-100 rounded-xl transition-all">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
