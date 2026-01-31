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
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Admin Dashboard</h2>
          <p className="text-slate-500">Manage your certification programs</p>
        </div>
        <a href="/admin/issue-certificate" className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700">
          <Plus className="h-4 w-4" /> Issue New Certificate
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        {[
          { label: "Total Issued", value: stats.total.toString(), color: "blue" },
          { label: "Active Templates", value: "3", color: "indigo" },
          { label: "Pending Renewal", value: "0", color: "amber" },
          { label: "Issued Today", value: stats.today.toString(), color: "emerald" }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-sm font-medium text-slate-500 mb-1">{stat.label}</p>
            <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm mb-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            <h3 className="font-bold text-slate-900 text-lg">Issuance Trend</h3>
          </div>
          <p className="text-sm text-slate-500">Last 7 days</p>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={(stats as any).trend}>
              <defs>
                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
              <Tooltip
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
              />
              <Area type="monotone" dataKey="count" stroke="#3b82f6" fillOpacity={1} fill="url(#colorCount)" strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
          <h3 className="font-bold text-slate-900">Recent Issuances</h3>
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="Search certificates..." className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
            <tr>
              <th className="px-6 py-3">ID</th>
              <th className="px-6 py-3">Recipient</th>
              <th className="px-6 py-3">Template</th>
              <th className="px-6 py-3">Issue Date</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr><td colSpan={6} className="px-6 py-4 text-center">Loading...</td></tr>
            ) : stats.recent.length === 0 ? (
              <tr><td colSpan={6} className="px-6 py-4 text-center">No certificates issued yet.</td></tr>
            ) : (
              stats.recent.map((row: any, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-slate-600 text-sm">{row.certificate_id}</td>
                  <td className="px-6 py-4 font-medium text-slate-900">{row.full_name || 'N/A'}</td>
                  <td className="px-6 py-4 text-slate-600">{row.template_name || 'Generic'}</td>
                  <td className="px-6 py-4 text-slate-600">{new Date(row.issue_date).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${row.status === 'valid' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right flex gap-3 justify-end">
                    <a href={`/preview/${row.certificate_id}`} className="text-blue-600 hover:underline text-sm font-medium">View</a>
                    {row.status === 'valid' && (
                      <button
                        onClick={() => handleRevoke(row.certificate_id)}
                        className="text-rose-600 hover:underline text-sm font-medium"
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
  );
}
