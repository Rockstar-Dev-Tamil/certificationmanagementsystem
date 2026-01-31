'use client';

import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Award, 
  CheckCircle, 
  Search, 
  Plus, 
  Download, 
  User, 
  LogOut, 
  Menu, 
  X,
  QrCode,
  ShieldCheck,
  Clock,
  ArrowLeft
} from 'lucide-react';
import CertificatePreview from './components/CertificatePreview';

export default function Home() {
  const [view, setView] = useState<'landing' | 'admin' | 'user' | 'verify' | 'preview'>('landing');
  const [selectedCert, setSelectedCert] = useState<any>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const Nav = () => (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center cursor-pointer" onClick={() => setView('landing')}>
            <Award className="h-8 w-8 text-blue-600" />
            <span className="ml-2 text-xl font-bold text-slate-900">CertiSafe</span>
          </div>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            <button onClick={() => setView('verify')} className="text-slate-600 hover:text-blue-600 font-medium">Verify</button>
            <button onClick={() => setView('user')} className="text-slate-600 hover:text-blue-600 font-medium">My Certificates</button>
            <button onClick={() => setView('admin')} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">Admin Portal</button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-slate-600">
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-2">
          <button onClick={() => { setView('verify'); setIsMenuOpen(false); }} className="block w-full text-left px-3 py-2 text-slate-600 font-medium">Verify</button>
          <button onClick={() => { setView('user'); setIsMenuOpen(false); }} className="block w-full text-left px-3 py-2 text-slate-600 font-medium">My Certificates</button>
          <button onClick={() => { setView('admin'); setIsMenuOpen(false); }} className="block w-full text-left px-3 py-2 text-blue-600 font-bold">Admin Portal</button>
        </div>
      )}
    </nav>
  );

  const LandingPage = () => (
    <div className="bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-5xl font-extrabold text-slate-900 tracking-tight mb-6">
            Secure Digital <span className="text-blue-600">Certification</span> Management
          </h1>
          <p className="text-xl text-slate-600 mb-10">
            Issue, manage, and verify professional certificates with ease. Prevent fraud and automate your entire certification lifecycle.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button onClick={() => setView('admin')} className="px-8 py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all">
              Get Started as Admin
            </button>
            <button onClick={() => setView('verify')} className="px-8 py-4 bg-white text-slate-900 border border-slate-200 rounded-xl font-bold text-lg hover:bg-slate-50 transition-all">
              Verify a Certificate
            </button>
          </div>
        </div>

        <div className="mt-24 grid md:grid-cols-3 gap-8">
          {[
            { icon: ShieldCheck, title: "Fraud Proof", desc: "QR-based instant verification ensures authenticity." },
            { icon: Clock, title: "Expiry Tracking", desc: "Automated alerts for certificate renewals and expirations." },
            { icon: LayoutDashboard, title: "Centralized Hub", desc: "Manage all your templates and issuances in one place." }
          ].map((feature, i) => (
            <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-6">
                <feature.icon className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
              <p className="text-slate-600">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const AdminDashboard = () => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Admin Dashboard</h2>
          <p className="text-slate-500">Manage your certification programs</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700">
          <Plus className="h-4 w-4" /> Issue New Certificate
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        {[
          { label: "Total Issued", value: "1,284", color: "blue" },
          { label: "Active Templates", value: "12", color: "indigo" },
          { label: "Pending Renewal", value: "45", color: "amber" },
          { label: "Verified Today", value: "89", color: "emerald" }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-sm font-medium text-slate-500 mb-1">{stat.label}</p>
            <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
          <h3 className="font-bold text-slate-900">Recent Issuances</h3>
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="Search certificates..." className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
            <tr>
              <th className="px-6 py-3">Recipient</th>
              <th className="px-6 py-3">Template</th>
              <th className="px-6 py-3">Issue Date</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {[
              { name: "John Doe", template: "Web Dev Bootcamp", date: "Oct 12, 2023", status: "Active" },
              { name: "Jane Smith", template: "UI/UX Design", date: "Oct 10, 2023", status: "Active" },
              { name: "Mike Ross", template: "Data Science", date: "Sep 28, 2023", status: "Expired" }
            ].map((row, i) => (
              <tr key={i} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-900">{row.name}</td>
                <td className="px-6 py-4 text-slate-600">{row.template}</td>
                <td className="px-6 py-4 text-slate-600">{row.date}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${row.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                    {row.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-blue-600 hover:underline text-sm font-medium">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const UserPortal = () => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900">My Certificates</h2>
        <p className="text-slate-500">View and download your earned credentials</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { title: "Full Stack Development", id: "CERT-2023-001", date: "Jan 15, 2023", expiry: "Jan 15, 2025", recipient: "John Doe" },
          { title: "Advanced React Patterns", id: "CERT-2023-042", date: "Mar 22, 2023", expiry: "Mar 22, 2025", recipient: "John Doe" }
        ].map((cert, i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden group hover:shadow-md transition-all">
            <div className="h-40 bg-slate-100 flex items-center justify-center border-b border-slate-100 relative">
              <Award className="h-16 w-16 text-slate-300" />
              <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/5 transition-colors" />
            </div>
            <div className="p-6">
              <h3 className="font-bold text-slate-900 text-lg mb-1">{cert.title}</h3>
              <p className="text-xs text-slate-400 mb-4">ID: {cert.id}</p>
              <div className="flex justify-between text-sm mb-6">
                <div>
                  <p className="text-slate-400 text-xs uppercase font-semibold">Issued</p>
                  <p className="text-slate-700 font-medium">{cert.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-slate-400 text-xs uppercase font-semibold">Expires</p>
                  <p className="text-slate-700 font-medium">{cert.expiry}</p>
                </div>
              </div>
              <button 
                onClick={() => {
                  setSelectedCert(cert);
                  setView('preview');
                }}
                className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white py-2.5 rounded-xl font-medium hover:bg-slate-800 transition-colors"
              >
                <Download className="h-4 w-4" /> View & Download
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const PreviewView = () => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button 
        onClick={() => setView('user')}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-8 font-medium transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Certificates
      </button>
      
      <div className="flex flex-col items-center">
        <CertificatePreview 
          recipientName={selectedCert?.recipient || "Recipient Name"}
          courseTitle={selectedCert?.title || "Course Title"}
          certificateId={selectedCert?.id || "CERT-ID"}
          issueDate={selectedCert?.date || "Date"}
          expiryDate={selectedCert?.expiry}
        />
      </div>
    </div>
  );

  const VerificationModule = () => (
    <div className="max-w-2xl mx-auto px-4 py-20">
      <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 md:p-12 text-center">
        <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-8">
          <QrCode className="h-10 w-10 text-blue-600" />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 mb-4">Verify Certificate</h2>
        <p className="text-slate-500 mb-10">Enter the unique certificate ID or scan the QR code to verify authenticity.</p>
        
        <div className="space-y-4">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Enter Certificate ID (e.g. CERT-2023-001)" 
              className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
            />
          </div>
          <button className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all">
            Verify Now
          </button>
        </div>

        <div className="mt-10 pt-10 border-t border-slate-100">
          <p className="text-sm text-slate-400">
            Need help? <a href="#" className="text-blue-600 font-medium hover:underline">Contact support</a>
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Nav />
      <main>
        {view === 'landing' && <LandingPage />}
        {view === 'admin' && <AdminDashboard />}
        {view === 'user' && <UserPortal />}
        {view === 'verify' && <VerificationModule />}
        {view === 'preview' && <PreviewView />}
      </main>
    </div>
  );
}
