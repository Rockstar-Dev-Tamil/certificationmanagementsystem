'use client';

import React from 'react';
import Link from 'next/link';
import { Award, Mail, Globe, Github } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    <div className="col-span-1 md:col-span-1">
                        <Link href="/" className="flex items-center mb-6">
                            <div className="bg-brand-600 p-1.5 rounded-lg">
                                <Award className="h-5 w-5 text-white" />
                            </div>
                            <span className="ml-2 text-xl font-bold text-white">CertiSafe</span>
                        </Link>
                        <p className="text-sm leading-relaxed">
                            The trust layer of modern certification. Securing digital credentials through transparency and innovation.
                        </p>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-6">Platform</h4>
                        <ul className="space-y-4 text-sm">
                            <li><Link href="/verify" className="hover:text-brand-400 transition-colors">Verify Certificate</Link></li>
                            <li><Link href="/verify/search" className="hover:text-brand-400 transition-colors">Search Registry</Link></li>
                            <li><Link href="/login" className="hover:text-brand-400 transition-colors">Admin Login</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-6">Company</h4>
                        <ul className="space-y-4 text-sm">
                            <li><Link href="#" className="hover:text-brand-400 transition-colors">About Us</Link></li>
                            <li><Link href="#" className="hover:text-brand-400 transition-colors">Privacy Policy</Link></li>
                            <li><Link href="#" className="hover:text-brand-400 transition-colors">Terms of Service</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-6">Connect</h4>
                        <div className="flex space-x-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-brand-600 hover:text-white transition-all">
                                <Mail className="h-5 w-5" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-brand-600 hover:text-white transition-all">
                                <Globe className="h-5 w-5" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-brand-600 hover:text-white transition-all">
                                <Github className="h-5 w-5" />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="pt-8 border-t border-slate-800 text-center md:text-left flex flex-col md:flex-row justify-between items-center bg-slate-900">
                    <p className="text-xs">
                        &copy; {new Date().getFullYear()} CertiSafe. All rights reserved. Built with trust.
                    </p>
                    <div className="flex space-x-6 mt-4 md:mt-0 text-xs">
                        <Link href="#" className="hover:text-white transition-colors">Cookies</Link>
                        <Link href="#" className="hover:text-white transition-colors">Security</Link>
                        <Link href="#" className="hover:text-white transition-colors">Support</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
