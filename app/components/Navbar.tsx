'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Award, Menu, X } from 'lucide-react';

export default function Navbar() {
    const [isOpen, setIsOpen] = React.useState(false);
    const [user, setUser] = React.useState<any>(null);
    const router = useRouter();

    React.useEffect(() => {
        fetch('/api/auth/user')
            .then(res => res.json())
            .then(data => setUser(data.user))
            .catch(() => setUser(null));
    }, []);

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        setUser(null);
        router.push('/');
        router.refresh();
    };

    return (
        <nav className="glass-card sticky top-0 z-50 transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20">
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center group">
                            <div className="bg-brand-600 p-2 rounded-xl group-hover:rotate-12 transition-all duration-500 shadow-lg shadow-brand-200">
                                <Award className="h-6 w-6 text-white" />
                            </div>
                            <span className="ml-3 text-2xl font-black bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent tracking-tight">CertiSafe</span>
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link href="/verify" className="text-slate-600 hover:text-brand-600 font-semibold transition-colors">Verify QR</Link>
                        <Link href="/verify/search" className="text-slate-600 hover:text-brand-600 font-semibold transition-colors">Search Portal</Link>

                        <div className="h-6 w-px bg-slate-200 mx-2" />

                        {user ? (
                            <>
                                <Link href="/dashboard" className="text-slate-600 hover:text-brand-600 font-semibold transition-colors">Dashboard</Link>
                                <button
                                    onClick={handleLogout}
                                    className="bg-slate-100 text-slate-900 hover:bg-slate-200 px-5 py-2.5 rounded-xl font-bold transition-all active:scale-95"
                                >
                                    Sign Out
                                </button>
                            </>
                        ) : (
                            <>
                                <Link href="/login" className="text-slate-600 hover:text-brand-600 font-semibold transition-colors">Login</Link>
                                <Link href="/register" className="bg-brand-50 text-brand-600 hover:bg-brand-100 px-5 py-2.5 rounded-xl font-bold transition-all active:scale-95">
                                    Register
                                </Link>
                            </>
                        )}

                        <Link href="/admin" className="btn-primary">
                            Admin Portal
                        </Link>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-slate-600 hover:bg-slate-100 p-2 rounded-lg transition-colors"
                        >
                            {isOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden border-t border-slate-100 bg-white/95 backdrop-blur-md animate-in slide-in-from-top duration-300">
                    <div className="px-4 py-6 space-y-4">
                        <Link
                            href="/verify"
                            className="block px-4 py-3 text-slate-700 hover:bg-brand-50 hover:text-brand-600 rounded-xl font-semibold transition-all"
                            onClick={() => setIsOpen(false)}
                        >
                            Verify QR
                        </Link>
                        <Link
                            href="/verify/search"
                            className="block px-4 py-3 text-slate-700 hover:bg-brand-50 hover:text-brand-600 rounded-xl font-semibold transition-all"
                            onClick={() => setIsOpen(false)}
                        >
                            Search Portal
                        </Link>

                        <div className="border-t border-slate-100 pt-4 space-y-4">
                            {user ? (
                                <>
                                    <Link
                                        href="/dashboard"
                                        className="block px-4 py-3 text-slate-700 hover:bg-brand-50 hover:text-brand-600 rounded-xl font-semibold transition-all"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Dashboard
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-4 py-3 text-rose-600 hover:bg-rose-50 rounded-xl font-semibold transition-all"
                                    >
                                        Sign Out
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        href="/login"
                                        className="block px-4 py-3 text-slate-700 hover:bg-brand-50 hover:text-brand-600 rounded-xl font-semibold transition-all"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        href="/register"
                                        className="block px-4 py-3 bg-brand-50 text-brand-600 rounded-xl font-bold text-center transition-all"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Register
                                    </Link>
                                </>
                            )}
                            <Link
                                href="/admin"
                                className="block px-4 py-4 bg-brand-600 text-white rounded-2xl font-black text-center shadow-lg shadow-brand-200"
                                onClick={() => setIsOpen(false)}
                            >
                                Admin Portal
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
