'use client';

import React from 'react';
import { Plus, Search, Award, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

export default function AdminPage() {
  const [stats, setStats] = React.useState({ total: 0, today: 0, recent: [] });
  const [loading, setLoading] = React.useState(true);

  const handleRevoke = async (id: string) => {
    const reason = window.prompt('Enter revocation reason:');
    if (reason === null) return;

    try {
      const res = await fetch('/api/revoke', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ certificateId: id, reason })
      });
      if (res.ok) {
        alert('Certificate revoked');
        // Refresh data
        window.location.reload();
      }
    } catch (err) {
      console.error(err);
    }
  };

  React.useEffect(() => {
    fetch('/api/analytics')
      .then(res => res.json())
      .then(data => {
        if (data && !data.error) {
          setStats(data);
        } else {
          console.error('Analytics error:', data?.error);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-end mb-12">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Admin Dashboard</h2>
          <p className="text-slate-500 mt-1 font-medium">Manage your certification programs and track results.</p>
        </div>
        <a href="/admin/issue-certificate" className="btn-primary flex items-center gap-2">
          <Plus className="h-5 w-5" /> Issue New Certificate
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
        {[
          { label: "Total Issued", value: stats.total.toString(), color: "bg-brand-500" },
          { label: "Active Templates", value: "3", color: "bg-accent-violet" },
          { label: "Pending Renewal", value: "0", color: "bg-amber-500" },
          { label: "Issued Today", value: stats.today.toString(), color: "bg-accent-emerald" }
        ].map((stat, i) => (
          <div key={i} className="glass-card p-8 rounded-3xl hover:bg-white transition-all group">
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">{stat.label}</p>
            <div className="flex items-end justify-between">
              <p className="text-4xl font-black text-slate-900">{stat.value}</p>
              <div className={`w-2 h-8 ${stat.color} rounded-full opacity-20 group-hover:opacity-100 transition-opacity`}></div>
            </div>
          </div>
        ))}
      </div>

      <div className="glass-card p-8 rounded-3xl mb-12">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-brand-50 rounded-lg">
              <TrendingUp className="h-6 w-6 text-brand-600" />
            </div>
            <h3 className="font-black text-slate-900 text-xl tracking-tight">Issuance Trend</h3>
          </div>
          <div className="px-3 py-1 bg-slate-50 text-slate-500 text-xs font-bold rounded-full border border-slate-100 uppercase tracking-tighter italic">Last 7 days</div>
        </div>
        <div className="h-80 w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={(stats as any).trend}>
              <defs>
                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0e8ee9" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#0e8ee9" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 700 }} dy={15} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 700 }} />
              <Tooltip
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.1)', padding: '12px' }}
              />
              <Area type="monotone" dataKey="count" stroke="#0e8ee9" fillOpacity={1} fill="url(#colorCount)" strokeWidth={4} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="glass-card rounded-3xl overflow-hidden mb-12">
        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-white/50">
          <h3 className="font-black text-slate-900 text-xl tracking-tight">Recent Issuances</h3>
          <div className="relative group">
            <Search className="h-4 w-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-600 transition-colors" />
            <input type="text" placeholder="Search certificates..." className="pl-12 pr-6 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all w-64" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 text-slate-400 text-[10px] uppercase font-black tracking-widest">
              <tr>
                <th className="px-8 py-5">ID</th>
                <th className="px-8 py-5">Recipient</th>
                <th className="px-8 py-5">Template</th>
                <th className="px-8 py-5">Issue Date</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan={6} className="px-8 py-12 text-center text-slate-400 font-medium">Loading data...</td></tr>
              ) : stats.recent.length === 0 ? (
                <tr><td colSpan={6} className="px-8 py-12 text-center text-slate-400 font-medium">No certificates issued yet.</td></tr>
              ) : (
                stats.recent.map((row: any, i) => (
                  <tr key={i} className="hover:bg-brand-50/30 transition-colors group">
                    <td className="px-8 py-5 text-slate-500 text-xs font-mono">{row.certificate_id}</td>
                    <td className="px-8 py-5">
                      <p className="font-bold text-slate-900">{row.full_name || 'N/A'}</p>
                      <p className="text-[10px] text-slate-400 font-medium">{row.recipient_email || 'No email'}</p>
                    </td>
                    <td className="px-8 py-5 text-slate-600 font-semibold">{row.template_name || 'Generic'}</td>
                    <td className="px-8 py-5 text-slate-500 text-sm">{new Date(row.issue_date).toLocaleDateString()}</td>
                    <td className="px-8 py-5">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${row.status === 'valid' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right flex gap-4 justify-end">
                      <a href={`/preview/${row.certificate_id}`} className="text-brand-600 hover:text-brand-700 text-xs font-black uppercase tracking-widest">View</a>
                      {row.status === 'valid' && (
                        <button
                          onClick={() => handleRevoke(row.certificate_id)}
                          className="text-rose-500 hover:text-rose-700 text-xs font-black uppercase tracking-widest"
                        >
                          Revoke
                        </button>
                      )}
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
