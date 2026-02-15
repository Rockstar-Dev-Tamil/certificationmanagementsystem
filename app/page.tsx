'use client';

import React from 'react';
import { ShieldCheck, Clock, LayoutDashboard, Menu, X, CheckCircle, Lock, Zap, HelpCircle, ArrowRight, Play, Globe, Shield } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function Home() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  React.useEffect(() => {
    fetch('/api/auth/user')
      .then(res => res.json())
      .then(data => {
        if (data.user) router.push('/dashboard');
      });
  }, [router]);

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-brand-100 selection:text-brand-900 font-sans">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center gap-2 group cursor-pointer">
              <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center shadow-lg shadow-brand-200 group-hover:rotate-6 transition-transform">
                <ShieldCheck className="text-white h-6 w-6" />
              </div>
              <span className="text-2xl font-black text-slate-900 tracking-tight">CertiSafe</span>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm font-bold text-slate-600 hover:text-brand-600 transition-colors">Features</a>
              <a href="#showcase" className="text-sm font-bold text-slate-600 hover:text-brand-600 transition-colors">Showcase</a>
              <a href="#security" className="text-sm font-bold text-slate-600 hover:text-brand-600 transition-colors">Integrity</a>
              <div className="h-6 w-px bg-slate-200 mx-2"></div>
              <a href="/login" className="text-sm font-bold text-slate-900 hover:text-brand-600">Login</a>
              <a href="/register" className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-brand-600 transition-all shadow-md shadow-brand-100 active:scale-95">
                Join Now
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button className="md:hidden p-2 text-slate-600" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-100 p-6 animate-in slide-in-from-top duration-300">
            <div className="flex flex-col gap-6">
              <a href="#features" className="font-bold text-slate-900" onClick={() => setIsMenuOpen(false)}>Features</a>
              <a href="#showcase" className="font-bold text-slate-900" onClick={() => setIsMenuOpen(false)}>Showcase</a>
              <a href="#security" className="font-bold text-slate-900" onClick={() => setIsMenuOpen(false)}>Security</a>
              <div className="h-px bg-slate-100 w-full"></div>
              <a href="/login" className="font-bold text-slate-900" onClick={() => setIsMenuOpen(false)}>Log In</a>
              <a href="/register" className="bg-brand-600 text-center text-white py-4 rounded-2xl font-bold" onClick={() => setIsMenuOpen(false)}>Get Started</a>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <div className="relative pt-40 pb-20 lg:pt-56 lg:pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="text-left animate-fade-in-up">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-brand-50 border border-brand-100 text-brand-700 font-bold text-xs mb-8 shadow-sm">
                <span className="flex h-2 w-2 rounded-full bg-brand-500 mr-2 animate-pulse"></span>
                TRUSTED BY 500+ INSTITUTIONS
              </div>

              <h1 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tighter mb-8 leading-[0.9]">
                Verify Any <br />
                <span className="text-brand-600">Achievement.</span>
              </h1>

              <p className="text-xl text-slate-500 mb-12 leading-relaxed max-w-xl font-medium">
                The most advanced infrastructure for cryptographically secure digital credentials. Prevent fraud and automate verification in one second.
              </p>

              <div className="flex flex-col sm:flex-row gap-6">
                <a href="/register" className="bg-brand-600 text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-brand-700 transition-all shadow-2xl shadow-brand-200 flex items-center justify-center gap-3 active:scale-95 group">
                  Start Issuing Now
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </a>
                <a href="/verify" className="bg-white border-2 border-slate-100 text-slate-900 px-10 py-5 rounded-2xl font-bold text-lg hover:border-slate-200 hover:bg-slate-50 transition-all flex items-center justify-center gap-3 group">
                  Verify Portal
                  <ShieldCheck className="h-6 w-6 text-brand-500" />
                </a>
              </div>
            </div>

            {/* Hero Visual Asset */}
            <div className="relative animate-fade-in-left hidden lg:block">
              <div className="relative z-10 w-full h-[600px] flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-tr from-brand-400/20 to-violet-400/20 blur-3xl opacity-50 rounded-full animate-pulse-slow"></div>
                <Image
                  src="/assets/certificate_vibe.png"
                  alt="Holographic Certificate"
                  width={600}
                  height={600}
                  priority
                  className="relative z-10 drop-shadow-[0_35px_35px_rgba(14,142,233,0.3)] animate-float scale-110 object-contain"
                />
              </div>
              {/* Floating badges */}
              <div className="absolute -top-10 -right-10 glass-card p-6 rounded-3xl animate-float-delayed">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-200">
                    <CheckCircle className="text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-black text-slate-900 leading-none">Verified</div>
                    <div className="text-[10px] text-slate-400 font-bold tracking-widest mt-1">S.S.L SECURED</div>
                  </div>
                </div>
              </div>
              <div className="absolute top-1/2 -left-20 glass-card p-6 rounded-3xl animate-float">
                <div className="flex items-center gap-4 text-brand-600">
                  <Shield className="h-8 w-8" />
                  <div className="font-mono text-xl font-bold tracking-tighter">SHA-256</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Section */}
      <div id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 border-t border-slate-50">
        <div className="text-center mb-24">
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight italic uppercase">Enterprise Grade</h2>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto">Built for institutions that demand 100% data integrity and global compliance.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-16">
          {[
            { icon: Lock, color: "text-brand-600", title: "Tamper-Proof", desc: "Every credential is cryptographically signed and stored with immutable records manually verified by institutional admins." },
            { icon: LayoutDashboard, color: "text-emerald-500", title: "Power Management", desc: "Bulk issue thousands of certificates in minutes. Manage revocations and renewals from a centralized hub." },
            { icon: Globe, color: "text-violet-500", title: "Global Standard", desc: "Industry-compliant QR formats that can be scanned by any smartphone, anywhere in the world, instantly." }
          ].map((f, i) => (
            <div key={i} className="group relative">
              <div className={`w-20 h-20 rounded-3xl bg-slate-50 flex items-center justify-center mb-8 border border-slate-100 group-hover:scale-110 transition-transform duration-500 group-hover:bg-brand-50`}>
                <f.icon className={`h-10 w-10 ${f.color}`} />
              </div>
              <h3 className="text-2xl font-bold mb-4">{f.title}</h3>
              <p className="text-slate-500 leading-relaxed text-lg font-medium">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Product Showcase (Dashboard Mockup) */}
      <div id="showcase" className="py-32 bg-slate-900 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20 text-white">
            <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">The Modern Standard</h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">CertiSafe is not just a tool; it's a mission-control center for your organization's digital trust.</p>
          </div>

          <div className="relative group perspective-1000">
            <div className="absolute -inset-1 bg-gradient-to-r from-brand-600 to-violet-600 rounded-[3rem] blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative bg-black rounded-[3rem] overflow-hidden border border-white/10 shadow-3xl transform group-hover:scale-[1.02] transition-all duration-700">
              <Image
                src="/assets/dashboard_mockup.png"
                alt="Product Showcase"
                width={1400}
                height={800}
                className="w-full h-auto opacity-90 group-hover:opacity-100 transition-opacity"
              />
              {/* Floating UI Elements Over Mockup */}
              <div className="absolute bottom-10 left-10 p-6 glass-card bg-brand-600 text-white border-brand-400 rounded-3xl hidden lg:block animate-bounce-slow">
                <div className="flex items-center gap-4">
                  <Zap className="fill-white" />
                  <span className="font-bold">Real-time Analytics Enabled</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Grid Background */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
      </div>

      {/* Security Deep Dive Section */}
      <div id="security" className="py-32 relative overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="relative order-2 lg:order-1">
              <div className="w-full aspect-square bg-slate-50 rounded-[4rem] flex items-center justify-center p-12 border-4 border-slate-100">
                <div className="w-full h-full border-4 border-dashed border-slate-200 rounded-[3rem] flex items-center justify-center">
                  <Lock className="h-40 w-40 text-slate-200" />
                </div>
              </div>
              {/* Decorative dots grid */}
              <div className="absolute top-10 right-10 grid grid-cols-4 gap-4 opacity-10">
                {[...Array(16)].map((_, i) => <div key={i} className="w-4 h-4 bg-brand-600 rounded-full"></div>)}
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-slate-100 text-slate-900 font-black text-xs mb-8 uppercase tracking-widest">
                Infrastructure
              </div>
              <h2 className="text-4xl md:text-6xl font-black mb-10 leading-tight tracking-tighter">Bulletproof <br />Architecture.</h2>
              <div className="space-y-10">
                {[
                  { title: "AES-256 Encryption", desc: "Industry-standard data protection for all sensitive institutional data." },
                  { title: "ACID Transactions", desc: "No partial writes. Your certification records are always consistent and fully atomic." },
                  { title: "Global CDN", desc: "Verification speeds under 500ms regardless of where the verification happens." },
                ].map((item, i) => (
                  <div key={i} className="flex gap-6 group">
                    <div className="w-12 h-12 bg-brand-600 rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-brand-100 group-hover:rotate-6 transition-transform">
                      <ShieldCheck className="text-white h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold mb-2">{item.title}</h4>
                      <p className="text-slate-500 font-medium">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-slate-50 py-32 border-y border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <HelpCircle className="h-16 w-16 text-brand-600 mx-auto mb-6 opacity-20" />
            <h2 className="text-5xl font-black text-slate-900 mb-4 tracking-tighter uppercase italic">The Hard Questions</h2>
          </div>
          <div className="space-y-4">
            {[
              { q: "Is it really fraud-proof?", a: "Yes. Every QR code maps to a unique cryptographic hash. If a single pixel on the certificate is altered, the hash mismatch is instantly flagged by our verification engine." },
              { q: "How fast is deployment?", a: "Zero to live in under 5 minutes. Use our bulk issuance tool or API to start issuing verified credentials instantly." },
              { q: "Pricing for Universities?", a: "We offer special institutional pricing for academic bodies. Contact our partnership team for bulk certification tiers." },
            ].map((faq, i) => (
              <div key={i} className="bg-white p-10 rounded-3xl border border-slate-200 shadow-sm transition-all hover:shadow-xl hover:border-brand-200 group">
                <h4 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-6">
                  <span className="text-slate-200 font-black italic text-4xl group-hover:text-brand-600 transition-colors">0{i + 1}</span>
                  {faq.q}
                </h4>
                <p className="text-slate-500 leading-relaxed font-medium pl-14">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Final CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-40">
        <div className="glass-card p-20 md:p-32 rounded-[5rem] bg-gradient-to-br from-brand-600 to-brand-800 text-white shadow-3xl overflow-hidden relative border-4 border-brand-400/30 text-center">
          <div className="relative z-10">
            <h2 className="text-6xl md:text-8xl font-black mb-12 leading-[0.8] tracking-tighter uppercase italic">Future of Trust <br />Starts Here.</h2>
            <p className="text-2xl text-brand-100 mb-16 max-w-2xl mx-auto font-medium">
              Join the elite institutions securing their legacy with CertiSafe.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-8">
              <a href="/register" className="bg-white text-brand-700 hover:bg-slate-100 font-black px-14 py-6 rounded-3xl transition-all shadow-2xl hover:scale-105 active:scale-95 text-xl uppercase tracking-widest">
                Build My Account
              </a>
              <a href="/login" className="bg-transparent border-2 border-white/30 backdrop-blur-md text-white hover:bg-white/10 font-black px-14 py-6 rounded-3xl transition-all text-xl uppercase tracking-widest">
                Login Portal
              </a>
            </div>
          </div>
          {/* Animated background highlights */}
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-white/10 blur-[200px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-brand-300/10 blur-[150px] rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-32 bg-slate-950 text-white border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-20 mb-32">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-3 mb-10">
                <div className="w-12 h-12 bg-brand-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-brand-500/20">
                  <ShieldCheck className="text-white h-7 w-7" />
                </div>
                <span className="text-3xl font-black tracking-tight text-white">CertiSafe</span>
              </div>
              <p className="text-slate-400 max-w-sm mb-12 leading-relaxed text-lg font-medium italic">
                Securing the world's most valuable achievements through unbreakable cryptographic infrastructure.
              </p>
            </div>
            <div>
              <h5 className="font-black text-brand-500 mb-8 uppercase tracking-[0.2em] text-xs">Resources</h5>
              <ul className="space-y-6 text-slate-500 font-bold">
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Open API</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Verification Spec</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-black text-brand-500 mb-8 uppercase tracking-[0.2em] text-xs">Foundation</h5>
              <ul className="space-y-6 text-slate-500 font-bold">
                <li><a href="#" className="hover:text-white transition-colors">Privacy Charter</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security Whitepaper</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Expert</a></li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center gap-10 border-t border-white/5 pt-16">
            <p className="text-slate-600 font-black uppercase text-xs tracking-widest">© 2024 CertiSafe Enterprise. All systems active.</p>
            <div className="flex gap-12 text-slate-500 font-black text-xs uppercase tracking-[0.3em]">
              <a href="#" className="hover:text-brand-600 transition-colors">TW</a>
              <a href="#" className="hover:text-brand-600 transition-colors">GH</a>
              <a href="#" className="hover:text-brand-600 transition-colors">LN</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
