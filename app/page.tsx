'use client';

import React from 'react';
import { ShieldCheck, LayoutDashboard, Menu, X, CheckCircle, Lock, Zap, HelpCircle, ArrowRight, Globe, Shield, Award, BarChart3, Users, ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';

import Link from 'next/link';

function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = React.useState(0);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          let start = 0;
          const duration = 2000;
          const step = (timestamp: number) => {
            if (!start) start = timestamp;
            const progress = Math.min((timestamp - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return <div ref={ref}>{count.toLocaleString()}{suffix}</div>;
}

export default function Home() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    fetch('/api/auth/user')
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          router.push(data.user.role === 'admin' ? '/admin' : '/dashboard');
        }
      });
  }, [router]);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-brand-100 selection:text-brand-900 font-sans">
      {/* Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-white/80 backdrop-blur-xl shadow-sm border-b border-slate-100' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center gap-3">
              <div className="h-10 w-10 bg-brand-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-brand-100">C</div>
              <span className="font-black text-slate-900 tracking-tighter text-lg">CertiSafe</span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors">Features</a>
              <a href="#showcase" className="text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors">Product</a>
              <a href="#security" className="text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors">Security</a>
              <a href="#faq" className="text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors">FAQ</a>
            </div>

            <div className="hidden md:flex items-center gap-4">
              <Link href="/login" className="text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors px-5 py-2.5">
                Sign In
              </Link>
              <Link href="/register" className="bg-brand-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-brand-700 transition-all shadow-lg shadow-brand-100 active:scale-95">
                Get Started
              </Link>
            </div>

            <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-100 shadow-xl animate-fade-in-up">
            <div className="px-4 py-6 space-y-4">
              <a href="#features" className="block text-sm font-bold text-slate-600 py-2" onClick={() => setIsMenuOpen(false)}>Features</a>
              <a href="#showcase" className="block text-sm font-bold text-slate-600 py-2" onClick={() => setIsMenuOpen(false)}>Product</a>
              <a href="#security" className="block text-sm font-bold text-slate-600 py-2" onClick={() => setIsMenuOpen(false)}>Security</a>
              <a href="#faq" className="block text-sm font-bold text-slate-600 py-2" onClick={() => setIsMenuOpen(false)}>FAQ</a>
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <Link href="/login" className="block text-center text-sm font-bold text-slate-900 py-3 border border-slate-200 rounded-xl">Sign In</Link>
                <Link href="/register" className="block text-center bg-brand-600 text-white py-3 rounded-xl font-bold text-sm">Get Started</Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <div className="relative pt-40 pb-20 lg:pt-52 lg:pb-32 overflow-hidden">
        {/* Subtle grid bg */}
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
          <div className="absolute inset-0 [background-image:linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] [background-size:60px_60px]"></div>
        </div>
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

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/register" className="bg-brand-600 text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-brand-700 transition-all shadow-2xl shadow-brand-200 flex items-center justify-center gap-3 active:scale-95 group">
                  Start Issuing Now
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="/verify" className="bg-white border-2 border-slate-100 text-slate-900 px-10 py-5 rounded-2xl font-bold text-lg hover:border-slate-200 hover:bg-slate-50 transition-all flex items-center justify-center gap-3 group">
                  Verify Portal
                  <ShieldCheck className="h-6 w-6 text-brand-500" />
                </Link>
              </div>

              {/* Scroll indicator */}
              <div className="hidden lg:flex items-center gap-3 mt-16 text-slate-300">
                <div className="h-10 w-6 rounded-full border-2 border-slate-200 flex items-start justify-center p-1">
                  <div className="h-2 w-1.5 bg-slate-300 rounded-full animate-bounce"></div>
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest">Scroll to explore</span>
              </div>
            </div>

            {/* Hero Visual — Clean CSS Certificate Card */}
            <div className="relative animate-fade-in-left hidden lg:block">
              <div className="relative z-10 w-full h-[600px] flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-tr from-brand-400/10 to-violet-400/10 blur-3xl opacity-40 rounded-full"></div>
                {/* Abstract Certificate Card */}
                <div className="relative z-10 w-[420px] bg-white rounded-[2rem] border border-slate-200 shadow-2xl shadow-slate-200/50 p-10 transform rotate-[-2deg] hover:rotate-0 transition-transform duration-700">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="h-10 w-10 bg-brand-600 rounded-xl flex items-center justify-center text-white font-black text-lg shadow-lg shadow-brand-100">C</div>
                    <div>
                      <div className="text-sm font-black text-slate-900 tracking-tight">CertiSafe Protocol</div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Digital Credential</div>
                    </div>
                  </div>
                  <div className="h-px bg-slate-100 mb-8"></div>
                  <div className="mb-6">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Certificate of Completion</div>
                    <div className="text-2xl font-black text-slate-900 tracking-tight leading-tight">Advanced Blockchain Engineering</div>
                  </div>
                  <div className="grid grid-cols-2 gap-6 mb-8">
                    <div>
                      <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Issued To</div>
                      <div className="text-sm font-bold text-slate-700">Jane M. Richardson</div>
                    </div>
                    <div>
                      <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Issue Date</div>
                      <div className="text-sm font-bold text-slate-700">Mar 20, 2026</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-emerald-500"></div>
                      <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Verified</span>
                    </div>
                    <div className="grid grid-cols-5 grid-rows-5 gap-[2px] opacity-30">
                      {[...Array(25)].map((_, i) => <div key={i} className={`w-1.5 h-1.5 rounded-[1px] ${[0,1,4,5,6,9,10,14,15,19,20,21,23,24].includes(i) ? 'bg-slate-900' : 'bg-transparent'}`}></div>)}
                    </div>
                  </div>
                </div>
              </div>
              {/* Floating badges */}
              <div className="absolute top-8 right-0 bg-white/80 backdrop-blur-xl border border-slate-100 shadow-xl p-5 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-200">
                    <CheckCircle className="text-white h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-xs font-black text-slate-900 leading-none">Verified</div>
                    <div className="text-[9px] text-slate-400 font-bold tracking-widest mt-0.5">SSL SECURED</div>
                  </div>
                </div>
              </div>
              <div className="absolute bottom-20 left-0 bg-white/80 backdrop-blur-xl border border-slate-100 shadow-xl p-5 rounded-2xl">
                <div className="flex items-center gap-3 text-brand-600">
                  <Shield className="h-6 w-6" />
                  <div className="font-mono text-lg font-bold tracking-tighter">SHA-256</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Counter Section */}
      <div className="border-y border-slate-100 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: 50000, suffix: '+', label: 'Certificates Issued', icon: Award },
              { value: 500, suffix: '+', label: 'Institutions', icon: Users },
              { value: 99, suffix: '.9%', label: 'Uptime SLA', icon: BarChart3 },
              { value: 10, suffix: 'M+', label: 'Verifications', icon: ShieldCheck },
            ].map((stat, i) => (
              <div key={i} className="text-center group">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-brand-50 rounded-xl mb-4 group-hover:scale-110 transition-transform">
                  <stat.icon className="h-5 w-5 text-brand-600" />
                </div>
                <div className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter mb-1">
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Feature Section */}
      <div id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="text-center mb-24">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-brand-50 border border-brand-100 text-brand-600 font-black text-[10px] uppercase tracking-[0.2em] mb-6">Core Capabilities</div>
          <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tighter">Enterprise Grade</h2>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto">Built for institutions that demand 100% data integrity and global compliance.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: Lock, color: "bg-brand-600", title: "Tamper-Proof", desc: "Every credential is cryptographically signed and stored with immutable records manually verified by institutional admins." },
            { icon: LayoutDashboard, color: "bg-emerald-500", title: "Power Management", desc: "Bulk issue thousands of certificates in minutes. Manage revocations and renewals from a centralized hub." },
            { icon: Globe, color: "bg-violet-500", title: "Global Standard", desc: "Industry-compliant QR formats that can be scanned by any smartphone, anywhere in the world, instantly." }
          ].map((f, i) => (
            <div key={i} className="group relative bg-white p-10 rounded-[2.5rem] border border-slate-100 hover:border-brand-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
              <div className={`w-16 h-16 rounded-2xl ${f.color} flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg`}>
                <f.icon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-black mb-4 tracking-tight">{f.title}</h3>
              <p className="text-slate-500 leading-relaxed font-medium">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Product Showcase */}
      <div id="showcase" className="py-32 bg-slate-900 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20 text-white">
            <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">The Modern Standard</h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">CertiSafe is not just a tool; it&apos;s a mission-control center for your organization&apos;s digital trust.</p>
          </div>

          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-brand-600 to-violet-600 rounded-[3rem] blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
            {/* Clean CSS Dashboard Mockup */}
            <div className="relative bg-slate-950 rounded-[3rem] overflow-hidden border border-white/10 shadow-3xl transform group-hover:scale-[1.01] transition-all duration-700 p-8 md:p-12">
              {/* Top Bar */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 bg-brand-600 rounded-lg flex items-center justify-center text-white font-black text-sm">C</div>
                  <span className="text-white/80 font-bold text-sm hidden md:block">CertiSafe Command Center</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-emerald-500"></div>
                  <span className="text-emerald-400 text-[10px] font-bold uppercase tracking-widest hidden md:block">Live</span>
                </div>
              </div>
              {/* Metrics Row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[{label: 'Total Issued', value: '2,847', color: 'text-white'}, {label: 'Templates', value: '12', color: 'text-brand-400'}, {label: 'Holders', value: '1,432', color: 'text-emerald-400'}, {label: 'Today', value: '36', color: 'text-violet-400'}].map((m, i) => (
                  <div key={i} className="bg-white/5 rounded-2xl p-5 border border-white/5">
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">{m.label}</div>
                    <div className={`text-2xl md:text-3xl font-black tracking-tighter ${m.color}`}>{m.value}</div>
                  </div>
                ))}
              </div>
              {/* Chart Area */}
              <div className="bg-white/5 rounded-2xl p-6 border border-white/5 mb-6">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6">Issuance Velocity (30D)</div>
                <div className="flex items-end gap-1 h-32">
                  {[40,55,35,70,45,80,60,90,50,75,65,85,70,95,55,80,60,75,85,90,70,95,80,65,75,85,90,80,95,100].map((h, i) => (
                    <div key={i} className="flex-1 rounded-t-sm transition-all" style={{height: `${h}%`, background: `linear-gradient(to top, rgba(37,99,235,0.8), rgba(37,99,235,0.3))`}}></div>
                  ))}
                </div>
              </div>
              {/* Table Preview */}
              <div className="bg-white/5 rounded-2xl border border-white/5 overflow-hidden">
                <div className="grid grid-cols-4 gap-4 px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-white/5">
                  <span>Certificate ID</span><span className="hidden md:block">Recipient</span><span className="hidden md:block">Template</span><span>Status</span>
                </div>
                {[{id: 'CS-2026-0847', name: 'A. Richardson', tmpl: 'Blockchain', status: 'Valid'}, {id: 'CS-2026-0846', name: 'K. Patel', tmpl: 'Data Science', status: 'Valid'}, {id: 'CS-2026-0845', name: 'M. Chen', tmpl: 'Cloud Arch.', status: 'Revoked'}].map((r, i) => (
                  <div key={i} className="grid grid-cols-4 gap-4 px-6 py-4 border-b border-white/5 last:border-0">
                    <span className="text-xs font-mono text-slate-400">{r.id}</span>
                    <span className="text-xs font-bold text-white/70 hidden md:block">{r.name}</span>
                    <span className="text-xs font-bold text-white/50 hidden md:block">{r.tmpl}</span>
                    <span className={`text-[10px] font-black uppercase tracking-widest ${r.status === 'Valid' ? 'text-emerald-400' : 'text-rose-400'}`}>{r.status}</span>
                  </div>
                ))}
              </div>
              {/* Floating badge */}
              <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 bg-brand-600 text-white px-5 py-3 rounded-xl hidden lg:flex items-center gap-3 shadow-lg shadow-brand-900/50">
                <Zap className="h-4 w-4 fill-white" />
                <span className="text-sm font-bold">Real-time Analytics</span>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
      </div>

      {/* Security Section */}
      <div id="security" className="py-32 relative overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="relative order-2 lg:order-1">
              <div className="w-full aspect-square bg-gradient-to-br from-slate-50 to-brand-50/30 rounded-[4rem] flex items-center justify-center p-12 border border-slate-100">
                <div className="w-full h-full border-4 border-dashed border-slate-200 rounded-[3rem] flex items-center justify-center relative">
                  <Lock className="h-32 w-32 text-slate-200" />
                  <div className="absolute -top-4 -right-4 w-8 h-8 bg-brand-600 rounded-full flex items-center justify-center shadow-lg shadow-brand-100 animate-pulse">
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                </div>
              </div>
              <div className="absolute top-10 right-10 grid grid-cols-4 gap-4 opacity-10">
                {[...Array(16)].map((_, i) => <div key={i} className="w-4 h-4 bg-brand-600 rounded-full"></div>)}
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-slate-100 text-slate-900 font-black text-xs mb-8 uppercase tracking-widest">
                Infrastructure
              </div>
              <h2 className="text-4xl md:text-6xl font-black mb-10 leading-tight tracking-tighter">Bulletproof <br />Architecture.</h2>
              <div className="space-y-8">
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
      <div id="faq" className="bg-slate-50 py-32 border-y border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <HelpCircle className="h-12 w-12 text-brand-600 mx-auto mb-6 opacity-30" />
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tighter">Frequently Asked</h2>
            <p className="text-slate-500 font-medium">Everything you need to know about CertiSafe</p>
          </div>
          <div className="space-y-4">
            {[
              { q: "Is it really fraud-proof?", a: "Yes. Every QR code maps to a unique cryptographic hash. If a single pixel on the certificate is altered, the hash mismatch is instantly flagged by our verification engine." },
              { q: "How fast is deployment?", a: "Zero to live in under 5 minutes. Use our bulk issuance tool or API to start issuing verified credentials instantly." },
              { q: "Pricing for Universities?", a: "We offer special institutional pricing for academic bodies. Contact our partnership team for bulk certification tiers." },
              { q: "Is my data secure?", a: "Absolutely. All data is encrypted at rest with AES-256 and in transit with TLS 1.3. We follow SOC 2 Type II compliance standards." },
            ].map((faq, i) => (
              <div key={i} className="bg-white p-8 md:p-10 rounded-3xl border border-slate-200 shadow-sm transition-all hover:shadow-xl hover:border-brand-200 group">
                <h4 className="text-xl md:text-2xl font-bold text-slate-900 mb-4 flex items-center gap-5">
                  <span className="text-slate-200 font-black text-3xl group-hover:text-brand-600 transition-colors tabular-nums">0{i + 1}</span>
                  {faq.q}
                </h4>
                <p className="text-slate-500 leading-relaxed font-medium pl-14">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="glass-card p-16 md:p-28 rounded-[4rem] bg-gradient-to-br from-brand-600 to-brand-800 text-white shadow-3xl overflow-hidden relative border-4 border-brand-400/30 text-center">
          <div className="relative z-10">
            <h2 className="text-5xl md:text-7xl font-black mb-10 leading-[0.85] tracking-tighter">Future of Trust <br />Starts Here.</h2>
            <p className="text-xl text-brand-100 mb-14 max-w-2xl mx-auto font-medium">
              Join the elite institutions securing their legacy with CertiSafe.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <Link href="/register" className="bg-white text-brand-700 hover:bg-slate-100 font-black px-12 py-5 rounded-2xl transition-all shadow-2xl hover:scale-105 active:scale-95 text-lg">
                Create Free Account
              </Link>
              <Link href="/login" className="bg-transparent border-2 border-white/30 backdrop-blur-md text-white hover:bg-white/10 font-black px-12 py-5 rounded-2xl transition-all text-lg">
                Sign In
              </Link>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-white/10 blur-[200px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-brand-300/10 blur-[150px] rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 bg-brand-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-brand-100">C</div>
                <span className="font-black text-slate-900 tracking-tighter text-lg">CertiSafe</span>
              </div>
              <p className="text-sm text-slate-500 font-medium leading-relaxed mb-6">
                Institutional-grade digital certification infrastructure for the modern world.
              </p>
              <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
                All Systems Operational
              </div>
            </div>
            <div>
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-5">Product</h4>
              <ul className="space-y-3">
                <li><a href="#features" className="text-sm font-bold text-slate-500 hover:text-brand-600 transition-colors">Features</a></li>
                <li><Link href="/verify" className="text-sm font-bold text-slate-500 hover:text-brand-600 transition-colors">Verify Portal</Link></li>
                <li><a href="#showcase" className="text-sm font-bold text-slate-500 hover:text-brand-600 transition-colors">Dashboard</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-5">Security</h4>
              <ul className="space-y-3">
                <li><a href="#security" className="text-sm font-bold text-slate-500 hover:text-brand-600 transition-colors">Architecture</a></li>
                <li><span className="text-sm font-bold text-slate-500">Encryption</span></li>
                <li><span className="text-sm font-bold text-slate-500">Compliance</span></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-5">Account</h4>
              <ul className="space-y-3">
                <li><Link href="/login" className="text-sm font-bold text-slate-500 hover:text-brand-600 transition-colors">Sign In</Link></li>
                <li><Link href="/register" className="text-sm font-bold text-slate-500 hover:text-brand-600 transition-colors">Create Account</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs font-bold text-slate-400">© {new Date().getFullYear()} CertiSafe Protocol. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <span className="text-xs font-bold text-slate-400">Privacy</span>
              <span className="text-xs font-bold text-slate-400">Terms</span>
              <span className="text-xs font-bold text-slate-400">Security</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
