'use client';

import React, { useState, useEffect } from 'react';
import { Users, Mail, Award, Search, MoreVertical, ShieldAlert } from 'lucide-react';

export default function UserManager() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await fetch('/api/users');
            const data = await res.json();
            setUsers(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleBlock = async (userId: string, currentStatus: boolean) => {
        setActionLoading(userId);
        try {
            const res = await fetch(`/api/users/${userId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ is_blocked: !currentStatus })
            });
            if (res.ok) fetchUsers();
        } catch (err) {
            console.error(err);
        } finally {
            setActionLoading(null);
        }
    };

    const handleRoleUpdate = async (userId: string, newRole: string) => {
        if (!confirm(`Elevate/Demote identity to ${newRole}?`)) return;
        setActionLoading(userId);
        try {
            const res = await fetch(`/api/users/${userId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ role: newRole })
            });
            if (res.ok) fetchUsers();
        } catch (err) {
            console.error(err);
        } finally {
            setActionLoading(null);
        }
    };

    const filteredUsers = users.filter(u =>
        u.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
                <div>
                    <h2 className="text-5xl font-black text-slate-900 tracking-tighter">Identity Management</h2>
                    <p className="text-slate-500 mt-2 font-medium italic text-lg">Audit and manage institutional identities.</p>
                </div>
            </div>

            <div className="glass-card rounded-[3rem] bg-white overflow-hidden shadow-2xl shadow-slate-200">
                <div className="px-10 py-10 border-b border-slate-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h3 className="font-black text-slate-900 text-2xl tracking-tight">Active Identities</h3>
                        <p className="text-slate-400 text-xs font-bold mt-1 uppercase tracking-widest italic">Global Identity Registry</p>
                    </div>
                    <div className="relative group w-full md:w-80">
                        <Search className="h-4 w-4 absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-600 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search Identities..."
                            className="pl-14 pr-6 py-4 bg-slate-50 border border-transparent rounded-[1.25rem] text-sm font-bold focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:bg-white focus:border-brand-100 transition-all w-full shadow-inner"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50/50 text-slate-400 text-[10px] uppercase font-black tracking-[0.2em]">
                            <tr>
                                <th className="px-10 py-6">Identity</th>
                                <th className="px-10 py-6">Assets</th>
                                <th className="px-10 py-6">Status</th>
                                <th className="px-10 py-6 text-right">Terminal</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 italic">
                            {loading ? (
                                <tr><td colSpan={4} className="px-10 py-20 text-center font-black animate-pulse text-slate-300 tracking-widest uppercase italic">Decrypting Identities...</td></tr>
                            ) : filteredUsers.length === 0 ? (
                                <tr><td colSpan={4} className="px-10 py-20 text-center text-slate-400 font-bold italic tracking-tighter uppercase">No identities found.</td></tr>
                            ) : (
                                filteredUsers.map((user, i) => (
                                    <tr key={i} className={`hover:bg-brand-50/20 transition-all group duration-300 ${user.is_blocked ? 'bg-rose-50/30' : ''}`}>
                                        <td className="px-10 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-sm shrink-0 transition-all ${user.is_blocked ? 'bg-rose-100 text-rose-400' : 'bg-slate-100 text-slate-400 group-hover:bg-white group-hover:shadow-md'}`}>
                                                    {user.full_name?.charAt(0) || <Users className="h-5 w-5" />}
                                                </div>
                                                <div>
                                                    <p className={`font-extrabold tracking-tight transition-colors ${user.is_blocked ? 'text-rose-600' : 'text-slate-900 group-hover:text-brand-600'}`}>{user.full_name || 'Anonymous'}</p>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <Mail className="h-3 w-3 text-slate-300" />
                                                        <p className="text-[10px] text-slate-400 font-black italic">{user.email}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-brand-50 rounded-lg">
                                                    <Award className="h-4 w-4 text-brand-600" />
                                                </div>
                                                <span className="font-black text-slate-700">{user.issuance_count}</span>
                                            </div>
                                        </td>
                                        <td className="px-10 py-6">
                                            <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${user.is_blocked ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                                                {user.is_blocked ? 'Suspended' : 'Verified'}
                                            </span>
                                        </td>
                                        <td className="px-10 py-6 text-right">
                                            <div className="flex justify-end items-center gap-2">
                                                <button
                                                    disabled={actionLoading === user.id}
                                                    onClick={() => handleToggleBlock(user.id, user.is_blocked)}
                                                    className={`p-3 rounded-xl transition-all ${user.is_blocked ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400 hover:text-rose-600 hover:bg-rose-50'} ${actionLoading === user.id ? 'animate-pulse' : ''}`}
                                                    title={user.is_blocked ? 'Restore Identity' : 'Suspend Identity'}
                                                >
                                                    <ShieldAlert className="h-4 w-4" />
                                                </button>
                                                <div className="relative group/menu">
                                                    <button className="p-3 bg-slate-50 text-slate-400 hover:bg-slate-100 rounded-xl transition-all">
                                                        <MoreVertical className="h-4 w-4" />
                                                    </button>
                                                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-slate-50 hidden group-hover/menu:block z-50 overflow-hidden">
                                                        <button
                                                            onClick={() => handleRoleUpdate(user.id, 'admin')}
                                                            className="w-full px-6 py-3 text-left text-[10px] font-black uppercase tracking-widest hover:bg-brand-50 hover:text-brand-600 transition-all border-b border-slate-50"
                                                        >Make Admin</button>
                                                        <button
                                                            onClick={() => handleRoleUpdate(user.id, 'user')}
                                                            className="w-full px-6 py-3 text-left text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 hover:text-slate-900 transition-all"
                                                        >Make Standard</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
