'use client';

import React from 'react';
import { ShieldCheck, Clock, LayoutDashboard, Menu, X, CheckCircle, Lock, Zap, HelpCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

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
    <div className="min-h-screen bg-white text-slate-900 selection:bg-brand-100 selection:text-brand-900">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center shadow-lg shadow-brand-200">
                <ShieldCheck className="text-white h-6 w-6" />
              </div>
              <span className="text-2xl font-black text-slate-900 tracking-tight text-gradient">CertiSafe</span>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm font-semibold text-slate-600 hover:text-brand-600 transition-colors">Features</a>
              <a href="#how-it-works" className="text-sm font-semibold text-slate-600 hover:text-brand-600 transition-colors">How it Works</a>
              <a href="#security" className="text-sm font-semibold text-slate-600 hover:text-brand-600 transition-colors">Security</a>
              <div className="h-6 w-px bg-slate-200 mx-2"></div>
              <a href="/login" className="text-sm font-bold text-slate-900 hover:text-brand-600">Sign In</a>
              <a href="/register" className="bg-brand-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-brand-700 transition-all shadow-md shadow-brand-100 active:scale-95">
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
          <div className="md:hidden bg-white border-b border-slate-100 p-4 animate-in slide-in-from-top duration-300">
            <div className="flex flex-col gap-4">
              <a href="#features" className="p-2 font-bold text-slate-900" onClick={() => setIsMenuOpen(false)}>Features</a>
              <a href="#how-it-works" className="p-2 font-bold text-slate-900" onClick={() => setIsMenuOpen(false)}>How it Works</a>
              <a href="#security" className="p-2 font-bold text-slate-900" onClick={() => setIsMenuOpen(false)}>Security</a>
              <a href="/login" className="p-2 font-bold text-slate-900" onClick={() => setIsMenuOpen(false)}>Sign In</a>
              <a href="/register" className="bg-brand-600 text-center text-white py-3 rounded-xl font-bold" onClick={() => setIsMenuOpen(false)}>Join Now</a>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <div className="relative pt-40 pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-brand-50 border border-brand-100 text-brand-700 font-bold text-sm mb-10 shadow-sm animate-fade-in">
            <span className="flex h-2.5 w-2.5 rounded-full bg-brand-500 mr-2 animate-pulse"></span>
            Enterprise Edition V2 Now Live
          </div>

          <h1 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tight mb-8 leading-[1]">
            Trust. <span className="text-gradient">Automated.</span>
          </h1>

          <p className="text-xl md:text-2xl text-slate-500 mb-12 leading-relaxed max-w-3xl mx-auto font-medium">
            The industry standard for secure digital credentialing. Issue, manage, and verify professional certificates with cryptographic certainty.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <a href="/admin" className="bg-slate-900 text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 group">
              Get Started as Admin
              <Zap className="inline-block ml-2 h-5 w-5 group-hover:fill-brand-400" />
            </a>
            <a href="/verify" className="bg-white border-2 border-slate-100 text-slate-900 px-10 py-5 rounded-2xl font-bold text-lg hover:border-brand-200 hover:bg-slate-50 transition-all flex items-center justify-center gap-2 group">
              Verify a Certificate
              <ShieldCheck className="h-6 w-6 text-brand-500 group-hover:rotate-12 transition-transform" />
            </a>
          </div>

          {/* Stats Bar */}
          <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-slate-100 pt-16 text-center">
            {[
              { label: 'Verified Issuers', val: '500+' },
              { label: 'Certificates Issued', val: '2M+' },
              { label: 'Fraud Attempts Blocked', val: '10K+' },
              { label: 'Verification Speed', val: '< 1s' },
            ].map((stat, i) => (
              <div key={i}>
                <div className="text-3xl font-black text-slate-900">{stat.val}</div>
                <div className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic Background */}
        <div className="absolute top-0 left-0 w-full h-[800px] -z-10 opacity-40">
          <div className="absolute top-[-100px] left-[10%] w-[500px] h-[500px] bg-brand-100 blur-[150px] rounded-full animate-float"></div>
          <div className="absolute top-[200px] right-[5%] w-[400px] h-[400px] bg-accent-violet/20 blur-[150px] rounded-full animate-float" style={{ animationDelay: '-2s' }}></div>
        </div>
      </div>

      {/* Features Deep Dive */}
      <div id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="text-center mb-24">
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">Enterprise Infrastructure</h2>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto">CertiSafe is built for organizations that cannot afford to compromise on trust.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-12">
          {[
            {
              icon: Lock,
              title: "Cryptographic Integrity",
              desc: "Every certificate is anchored to our secure MySQL backend with a unique SHA-256 signature for zero-drift verification.",
              color: "brand"
            },
            {
              icon: LayoutDashboard,
              title: "Bulk Operations",
              desc: "Process thousands of certifications in seconds with our high-throughput bulk issuance engine and CSV integrations.",
              color: "emerald"
            },
            {
              icon: Clock,
              title: "Compliance Automator",
              desc: "Never miss a renewal. Automatic email triggers and dashboard alerts keep your certified workforce fully compliant.",
              color: "violet"
            }
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} className="group relative px-6">
                <div className={`w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center mb-8 border border-slate-100 group-hover:scale-110 transition-transform duration-500 shadow-sm shadow-slate-100`}>
                  <Icon className={`h-8 w-8 text-slate-900`} />
                </div>
                <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                <p className="text-slate-500 leading-relaxed text-lg">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Security Deep Dive Section */}
      <div id="security" className="bg-slate-900 py-32 relative overflow-hidden text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 text-brand-300 font-bold text-sm mb-6">
                Security-First Architecture
              </div>
              <h2 className="text-4xl md:text-5xl font-black mb-8 leading-tight text-white">Advanced Protection Against Degree Forgery</h2>
              <p className="text-xl text-slate-400 mb-10 leading-relaxed">
                CertiSafe employs a multi-layered security approach to ensure that every document issued is 100% tamper-proof and instantly verifiable globally.
              </p>
              <div className="space-y-6">
                {[
                  "JWT-secured administrative sessions",
                  "Encrypted QR-payloads for verification",
                  "Bcrypt password hashing (Salt cost 12)",
                  "Transactional database integrity (ACID)",
                ].map((text, i) => (
                  <div key={i} className="flex items-center gap-4 text-lg">
                    <CheckCircle className="text-brand-400 h-6 w-6" />
                    <span>{text}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="glass-card bg-white/5 border-white/10 p-8 rounded-[2rem] backdrop-blur-3xl">
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                    <span className="text-slate-400 font-bold uppercase tracking-wider text-xs">Verification Protocol</span>
                    <span className="text-brand-400 font-mono text-sm leading-none">v2.4-ACTIVE</span>
                  </div>
                  <div className="h-64 rounded-xl bg-gradient-to-br from-brand-600/30 to-brand-900/30 flex items-center justify-center border border-white/10">
                    <ShieldCheck className="h-24 w-24 text-brand-400 animate-pulse" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-white/5 rounded-xl text-center">
                      <div className="text-brand-400 font-black text-xl">100%</div>
                      <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Uptime</div>
                    </div>
                    <div className="p-4 bg-white/5 rounded-xl text-center">
                      <div className="text-brand-400 font-black text-xl">SHA256</div>
                      <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Hashing</div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Decoration */}
              <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-brand-500/20 blur-[100px]"></div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div id="how-it-works" className="py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight text-gradient">The 1-Second Verification Workflow</h2>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto">Seamless automation from issuance to stakeholder approval.</p>
          </div>

          <div className="grid md:grid-cols-4 gap-12 text-center">
            {[
              { step: "01", title: "Institutional Setup", desc: "Organizations register and configure custom layouts." },
              { step: "02", title: "Secure Issuance", desc: "Admins generate degrees with cryptographic IDs." },
              { step: "03", title: "Digital Delivery", desc: "Recipients gain instant access to their digital portal." },
              { step: "04", title: "Global Verification", desc: "Employers scan the QR to get 'Live Truth' results." }
            ].map((step, i) => (
              <div key={i} className="relative px-6">
                <div className="text-7xl font-black text-slate-50 absolute -top-8 left-1/2 -translate-x-1/2 -z-10 select-none">{step.step}</div>
                <h4 className="text-xl font-bold text-slate-900 mb-4">{step.title}</h4>
                <p className="text-slate-500 leading-relaxed font-medium">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-slate-50 py-32 border-y border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <HelpCircle className="h-12 w-12 text-brand-600 mx-auto mb-6" />
            <h2 className="text-4xl font-black text-slate-900 mb-4">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-6">
            {[
              { q: "How secure is the QR verification?", a: "Extremely. Each QR code contains a cryptographically hashed unique ID that points to a specific, immutable entry in our ACID-compliant MySQL database. It cannot be spoofed." },
              { q: "Can we use our own certificate designs?", a: "Yes. CertiSafe supports custom templates and CSS styling to ensure your digital certificates match your institution's branding perfectly." },
              { q: "Is there a limit to how many I can issue?", a: "Our enterprise infrastructure is built on Next.js 15 and MySQL, designed to handle millions of issuance requests with zero latency." },
            ].map((faq, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <h4 className="text-xl font-bold text-slate-900 mb-3 flex items-start gap-4">
                  <span className="text-brand-600 font-black shrink-0">Q.</span> <span>{faq.q}</span>
                </h4>
                <p className="text-slate-600 leading-relaxed pl-9">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Final CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-40 text-center">
        <div className="glass-card p-16 md:p-24 rounded-[4rem] bg-gradient-to-br from-slate-900 to-black text-white shadow-2xl overflow-hidden relative border border-white/10">
          <div className="relative z-10">
            <h2 className="text-5xl md:text-7xl font-black mb-10 leading-tight">Future-Proof Your <br /><span className="text-brand-400">Credentials.</span></h2>
            <p className="text-xl md:text-2xl text-slate-400 mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
              Join leading global institutions in defining the next era of digital trust. Starts with a single click.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <a href="/register" className="bg-brand-600 text-white hover:bg-brand-500 font-bold px-12 py-5 rounded-2xl transition-all shadow-xl shadow-brand-900/40 hover:scale-105 active:scale-95 text-lg">
                Create Free Account
              </a>
              <a href="/login" className="bg-white/5 backdrop-blur-md border border-white/20 text-white hover:bg-white/10 font-bold px-12 py-5 rounded-2xl transition-all text-lg">
                Member Login
              </a>
            </div>
          </div>
          {/* Animated background highlights */}
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-600/20 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent-violet/10 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-100 py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
                  <ShieldCheck className="text-white h-5 w-5" />
                </div>
                <span className="text-xl font-black text-slate-900">CertiSafe</span>
              </div>
              <p className="text-slate-500 max-w-sm mb-8 leading-relaxed font-medium">
                The most trusted infrastructure for digital certification management. Empowering transparency in professional achievement.
              </p>
            </div>
            <div>
              <h5 className="font-black text-slate-900 mb-6 uppercase tracking-widest text-xs">Resources</h5>
              <ul className="space-y-4 text-slate-500 font-bold text-sm">
                <li><a href="#" className="hover:text-brand-600 transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-brand-600 transition-colors">API Reference</a></li>
                <li><a href="#" className="hover:text-brand-600 transition-colors">Guides</a></li>
                <li><a href="#" className="hover:text-brand-600 transition-colors">Support</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-black text-slate-900 mb-6 uppercase tracking-widest text-xs">Company</h5>
              <ul className="space-y-4 text-slate-500 font-bold text-sm">
                <li><a href="#" className="hover:text-brand-600 transition-colors">Security</a></li>
                <li><a href="#" className="hover:text-brand-600 transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-brand-600 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-brand-600 transition-colors">Contact Us</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-12 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
            <p className="text-slate-400 text-sm font-bold">© 2024 CertiSafe Enterprise. All rights reserved.</p>
            <div className="flex gap-8 text-slate-400 font-bold text-sm">
              <a href="#" className="hover:text-slate-900 transition-colors">Twitter</a>
              <a href="#" className="hover:text-slate-900 transition-colors">GitHub</a>
              <a href="#" className="hover:text-slate-900 transition-colors">LinkedIn</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
