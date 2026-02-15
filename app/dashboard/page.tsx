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
    User,
    ChevronRight,
    Bell
} from 'lucide-react';
import AdminPage from '../admin/page';
import UserPage from '../user/page';

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
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 bg-brand-600 rounded-2xl flex items-center justify-center animate-pulse shadow-2xl shadow-brand-200">
                    <ShieldCheck className="text-white h-8 w-8" />
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 animate-pulse">Initializing Interface</p>
            </div>
        </div>
    );

    if (!user) return null;

    return (
        <div className="min-h-screen bg-slate-50/50 flex transition-all duration-700">
            {/* Enterprise Sidebar */}
            <aside className="w-80 bg-white border-r border-slate-100 hidden lg:flex flex-col sticky top-0 h-screen shadow-sm">
                <div className="p-10">
                    <div className="flex items-center gap-3 mb-16 group cursor-pointer">
                        <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center shadow-lg shadow-brand-200 group-hover:rotate-6 transition-transform">
                            <ShieldCheck className="text-white h-6 w-6" />
                        </div>
                        <span className="text-2xl font-black text-slate-900 tracking-tight italic">CertiSafe</span>
                    </div>

                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] mb-8 px-4">Workspace Navigation</p>
                    <nav className="space-y-3">
                        <button className="w-full flex items-center justify-between px-6 py-4 bg-brand-600 text-white rounded-2xl font-black text-sm shadow-2xl shadow-brand-100 transition-all active:scale-95">
                            <div className="flex items-center gap-4">
                                <LayoutDashboard className="h-5 w-5" /> Dashboard
                            </div>
                            <ChevronRight className="h-4 w-4 opacity-50" />
                        </button>
                        {[
                            { icon: Award, label: user.role === 'admin' ? 'Credential Ledger' : 'My Credentials' },
                            { icon: FileText, label: 'Asset Templates', hide: user.role !== 'admin' },
                            { icon: Settings, label: 'Protocol Settings' }
                        ].map((item, i) => !item.hide && (
                            <button key={i} className="w-full flex items-center gap-4 px-6 py-4 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-2xl font-bold transition-all group">
                                <item.icon className="h-5 w-5 group-hover:scale-110 transition-transform" /> {item.label}
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="mt-auto p-8 bg-slate-900/5 m-4 rounded-[2rem] border border-slate-100">
                    <div className="flex items-center gap-4 mb-8 px-2">
                        <div className="h-12 w-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white font-black shadow-lg shadow-slate-200 border-2 border-white">
                            {user.email.substring(0, 1).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-black text-slate-900 truncate uppercase tracking-tighter">{user.email.split('@')[0]}</p>
                            <div className="flex items-center gap-1.5 mt-1">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                                <p className="text-[10px] font-black text-brand-600 uppercase tracking-widest italic">{user.role}</p>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-3 px-4 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all active:scale-[0.98] shadow-2xl shadow-slate-200 group"
                    >
                        <LogOut className="h-4 w-4 group-hover:-translate-x-1 transition-transform" /> Sign Out System
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 min-h-screen overflow-y-auto">
                {/* Global Workspace Header */}
                <div className="bg-white/50 backdrop-blur-md sticky top-0 z-20 border-b border-slate-100 px-10 py-6 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <div className="lg:hidden w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center">
                            <ShieldCheck className="text-white h-6 w-6" />
                        </div>
                        <div className="h-8 w-px bg-slate-200 hidden lg:block mr-2"></div>
                        <span className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] italic">Active Session: {new Date().toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-6">
                        <button className="relative p-2 text-slate-400 hover:text-brand-600 transition-colors">
                            <Bell className="h-5 w-5" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
                        </button>
                        <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white overflow-hidden shadow-sm">
                            <div className="w-full h-full bg-gradient-to-br from-brand-400 to-violet-400"></div>
                        </div>
                    </div>
                </div>

                <div className="p-10">
                    {user.role === 'admin' ? (
                        <div className="animate-fade-in">
                            {/* The logic for AdminPage is already imported and used below */}
                            <AdminPage />
                        </div>
                    ) : (
                        <div className="animate-fade-in max-w-7xl mx-auto">
                            <div className="flex justify-between items-end mb-16">
                                <div>
                                    <h1 className="text-5xl font-black text-slate-900 tracking-tighter">My Credentials</h1>
                                    <p className="text-slate-500 mt-2 font-medium italic">Verified achievements and professional history.</p>
                                </div>
                                <div className="flex gap-4">
                                    <button className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:bg-slate-50 transition-colors">
                                        <Search className="h-5 w-5 text-slate-400" />
                                    </button>
                                </div>
                            </div>

                            {/* Embed User Page logic here */}
                            <div className="bg-white rounded-[3rem] p-1 shadow-sm border border-slate-100">
                                <UserPage />
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
