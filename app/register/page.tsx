'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User, Mail, Lock, Loader2, Award, ShieldCheck } from 'lucide-react';

export default function RegisterPage() {
    const router = useRouter();
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState('');
    const [formData, setFormData] = React.useState({
        fullName: '',
        email: '',
        password: '',
        role: 'user'
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (res.ok) {
                // Automatically log in after registration or redirect to login
                router.push('/login');
            } else {
                setError(data.error || 'Registration failed');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4 py-12">
            <div className="max-w-md w-full">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center p-3 bg-blue-600 rounded-2xl mb-4 shadow-lg shadow-blue-200">
                        <Award className="h-8 w-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900">Create Account</h1>
                    <p className="text-slate-500 mt-2">Start managing your certificates today</p>
                </div>

                <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
                    {error && (
                        <div className="mb-6 p-4 bg-rose-50 text-rose-600 rounded-xl text-sm font-medium border border-rose-100">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                <input
                                    required
                                    type="text"
                                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                    placeholder="John Doe"
                                    value={formData.fullName}
                                    onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                <input
                                    required
                                    type="email"
                                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                    placeholder="name@company.com"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                <input
                                    required
                                    type="password"
                                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Account Type</label>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, role: 'user' })}
                                    className={`py-3 rounded-xl text-sm font-bold transition-all border ${formData.role === 'user' ? 'bg-white border-blue-200 text-blue-600 shadow-sm' : 'bg-transparent border-transparent text-slate-500'}`}
                                >
                                    Individual
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, role: 'admin' })}
                                    className={`py-3 rounded-xl text-sm font-bold transition-all border ${formData.role === 'admin' ? 'bg-white border-blue-200 text-blue-600 shadow-sm' : 'bg-transparent border-transparent text-slate-500'}`}
                                >
                                    Organization (Admin)
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all flex items-center justify-center disabled:opacity-70"
                        >
                            {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : 'Create Account'}
                        </button>
                    </form>

                    <p className="text-center mt-8 text-slate-500">
                        Already have an account?{' '}
                        <Link href="/login" className="text-blue-600 font-bold hover:underline">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
