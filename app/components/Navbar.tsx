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
        <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center group">
                            <div className="bg-blue-600 p-1.5 rounded-lg group-hover:rotate-12 transition-transform duration-300">
                                <Award className="h-6 w-6 text-white" />
                            </div>
                            <span className="ml-2 text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">CertiSafe</span>
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-6">
                        <Link href="/verify" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">Verify QR</Link>
                        <Link href="/verify/search" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">Search Portal</Link>
                        <div className="h-4 w-px bg-slate-200 mx-2" />

                        {user ? (
                            <>
                                <Link href="/dashboard" className="text-slate-600 hover:text-blue-600 font-semibold transition-colors px-2">Dashboard</Link>
                                <button
                                    onClick={handleLogout}
                                    className="text-slate-900 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-xl font-bold transition-all"
                                >
                                    Sign Out
                                </button>
                            </>
                        ) : (
                            <>
                                <Link href="/login" className="text-slate-600 hover:text-blue-600 font-semibold transition-colors px-2">Login</Link>
                                <Link href="/register" className="text-blue-600 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-xl font-bold transition-all">
                                    Register
                                </Link>
                            </>
                        )}

                        <Link href="/admin" className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200 transition-all">
                            Admin Portal
                        </Link>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-slate-600 hover:text-blue-600 p-2"
                        >
                            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-white border-b border-slate-200 animate-in slide-in-from-top duration-300">
                    <div className="px-4 pt-2 pb-6 space-y-3">
                        <Link
                            href="/verify"
                            className="block px-4 py-2 text-slate-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg font-medium"
                            onClick={() => setIsOpen(false)}
                        >
                            Verify QR
                        </Link>
                        <Link
                            href="/verify/search"
                            className="block px-4 py-2 text-slate-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg font-medium"
                            onClick={() => setIsOpen(false)}
                        >
                            Search Portal
                        </Link>
                        <div className="border-t border-slate-100 my-2 pt-2 space-y-3">
                            {user ? (
                                <>
                                    <Link
                                        href="/dashboard"
                                        className="block px-4 py-2 text-slate-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg font-medium"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Dashboard
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-4 py-2 text-rose-600 hover:bg-rose-50 rounded-lg font-medium"
                                    >
                                        Sign Out
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        href="/login"
                                        className="block px-4 py-2 text-slate-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg font-medium"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        href="/register"
                                        className="block px-4 py-2 text-blue-600 bg-blue-50 rounded-lg font-bold text-center"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Register
                                    </Link>
                                </>
                            )}
                            <Link
                                href="/admin"
                                className="block px-4 py-4 bg-blue-600 text-white rounded-xl font-bold text-center"
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
