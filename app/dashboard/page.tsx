'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import {
    LayoutDashboard,
    Award,
    Settings,
    LogOut,
    Plus,
    ShieldCheck,
    FileText,
    TrendingUp,
    Search,
    User
} from 'lucide-react';
import AdminPage from '../admin/page'; // Reuse the existing admin components if possible
import UserPage from '../user/page';   // Reuse the existing user profile logic

export default function Dashboard() {
    const router = useRouter();
    const [user, setUser] = React.useState<any>(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        fetch('/api/auth/user')
            .then(res => res.json())
            .then(data => {
                if (data.user) {
                    setUser(data.user);
                } else {
                    router.push('/login');
                }
                setLoading(false);
            })
            .catch(() => {
                router.push('/login');
                setLoading(false);
            });
    }, [router]);

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/');
        router.refresh();
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
    );

    if (!user) return null;

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Sidebar */}
            <aside className="w-72 bg-white border-r border-slate-200 hidden lg:flex flex-col sticky top-20 h-[calc(100vh-80px)]">
                <div className="p-8">
                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-6 px-4">Main Menu</p>
                    <nav className="space-y-2">
                        <button className="w-full flex items-center gap-3 px-5 py-3.5 bg-brand-50 text-brand-700 rounded-2xl font-bold transition-all">
                            <LayoutDashboard className="h-5 w-5" /> Dashboard
                        </button>
                        <button className="w-full flex items-center gap-3 px-5 py-3.5 text-slate-600 hover:bg-slate-50 rounded-2xl font-semibold transition-all group">
                            <Award className="h-5 w-5 group-hover:text-brand-600" /> {user.role === 'admin' ? 'All Certificates' : 'My Certificates'}
                        </button>
                        {user.role === 'admin' && (
                            <button className="w-full flex items-center gap-3 px-5 py-3.5 text-slate-600 hover:bg-slate-50 rounded-2xl font-semibold transition-all group">
                                <FileText className="h-5 w-5 group-hover:text-brand-600" /> Templates
                            </button>
                        )}
                        <button className="w-full flex items-center gap-3 px-5 py-3.5 text-slate-600 hover:bg-slate-50 rounded-2xl font-semibold transition-all group">
                            <Settings className="h-5 w-5 group-hover:text-brand-600" /> Settings
                        </button>
                    </nav>
                </div>

                <div className="mt-auto p-8 border-t border-slate-100 bg-slate-50/50">
                    <div className="flex items-center gap-4 mb-8 px-2">
                        <div className="h-12 w-12 rounded-2xl bg-brand-600 flex items-center justify-center text-white font-black shadow-lg shadow-brand-200">
                            {user.email.substring(0, 1).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-black text-slate-900 truncate">{user.email}</p>
                            <p className="text-xs font-bold text-brand-600 uppercase tracking-tighter">{user.role}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all active:scale-[0.98] shadow-lg shadow-slate-200"
                    >
                        <LogOut className="h-4 w-4" /> Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <div className="p-8">
                    {user.role === 'admin' ? (
                        <div>
                            <div className="flex justify-between items-center mb-10">
                                <div>
                                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Organization Console</h1>
                                    <p className="text-slate-500 mt-1">Manage institutional certificates and analytics.</p>
                                </div>
                                <div className="flex gap-3">
                                    <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl font-bold bg-white hover:bg-slate-50 transition-colors">
                                        <TrendingUp className="h-4 w-4" /> Reports
                                    </button>
                                    <a href="/admin/issue-certificate" className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all">
                                        <Plus className="h-4 w-4" /> Issue Certificate
                                    </a>
                                </div>
                            </div>

                            {/* Embed Admin Dashboard logic here */}
                            <AdminPage />
                        </div>
                    ) : (
                        <div>
                            <div className="mb-10">
                                <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Personal Workspace</h1>
                                <p className="text-slate-500 mt-1">Your earned credentials and verification history.</p>
                            </div>

                            {/* Embed User Profile logic here */}
                            <UserPage />
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
