'use client';

import React from 'react';
import { CheckCircle2, XCircle, AlertCircle, Calendar, Hash, User, Shield, ArrowRight, Download, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { StatusPill } from '@/components/ui/StatusPill';

interface VerificationResultProps {
    isValid: boolean;
    status?: string;
    data?: {
        certificate_id: string;
        recipient_name: string;
        recipient_email: string;
        template_name: string;
        issue_date: string;
        expiry_date?: string;
        data_hash: string;
    };
    error?: string;
    revocationReason?: string;
}

export function VerificationResult({ isValid, data, error, revocationReason }: VerificationResultProps) {
    if (!isValid) {
        return (
            <div className="animate-fade-up">
                <Card padding="lg" className="border-red-100 bg-red-50/30">
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-red-100 text-red-600 rounded-2xl">
                            <XCircle className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-xl font-bold text-slate-900 tracking-tight mb-1">Verification Failed</h3>
                            <p className="text-slate-600 font-medium mb-6">
                                {revocationReason 
                                    ? `This credential was explicitly revoked: ${revocationReason}`
                                    : error || "The provided certificate ID does not match any current institutional records."}
                            </p>
                            
                            <div className="flex items-center gap-3">
                                <Button variant="outline" size="sm" className="bg-white">Report Discrepancy</Button>
                                <Button variant="ghost" size="sm" className="text-red-600 hover:bg-red-50">View Security Policy</Button>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        );
    }

    if (!data) return null;

    return (
        <div className="animate-fade-up space-y-6">
            <Card padding="lg" className="border-emerald-100 bg-emerald-50/30">
                <div className="flex flex-wrap items-start justify-between gap-6">
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-emerald-100 text-emerald-600 rounded-2xl">
                            <CheckCircle2 className="h-6 w-6" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-1">Authenticity Verified</h3>
                            <p className="text-slate-600 font-medium">This credential is cryptographically secure and recognized by the issuing body.</p>
                        </div>
                    </div>
                    <StatusPill status="valid" />
                </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                <Card className="md:col-span-8 overflow-hidden" padding="none">
                    <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Credential Metadata</h4>
                    </div>
                    <div className="p-8 space-y-8">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-2">Recipient Identity</label>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm">
                                        {data.recipient_name.charAt(0)}
                                    </div>
                                    <div>
                                        <div className="font-bold text-slate-900">{data.recipient_name}</div>
                                        <div className="text-xs text-slate-500 font-medium">{data.recipient_email}</div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-2">Issuance Framework</label>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-brand-50 text-brand-600 rounded-lg">
                                        <Shield className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <div className="font-bold text-slate-900">{data.template_name}</div>
                                        <div className="text-xs text-slate-500 font-medium">Standard Accreditation Verifier</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-8 border-t border-slate-100">
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-2">Identification</label>
                                <div className="font-mono text-xs text-slate-600 font-bold flex items-center gap-2">
                                    <Hash className="h-3 w-3" />
                                    {data.certificate_id}
                                </div>
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-2">Temporal Data</label>
                                <div className="text-xs font-bold text-slate-900 flex items-center gap-4">
                                    <div className="flex items-center gap-1.5">
                                        <Calendar className="h-3 w-3 text-slate-400" />
                                        <span>Issued: {new Date(data.issue_date).toLocaleDateString()}</span>
                                    </div>
                                    {data.expiry_date && (
                                        <div className="flex items-center gap-1.5 text-orange-600">
                                            <Calendar className="h-3 w-3" />
                                            <span>Expires: {new Date(data.expiry_date).toLocaleDateString()}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="pt-8 border-t border-slate-100">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-2">Cryptographic Hash (SHA-256)</label>
                            <div className="bg-slate-900 text-slate-400 p-4 rounded-xl font-mono text-[10px] break-all leading-relaxed border border-slate-800">
                                {data.data_hash}
                            </div>
                        </div>
                    </div>
                </Card>

                <div className="md:col-span-4 space-y-6">
                    <Card padding="lg" className="bg-brand-600 text-white border-transparent shadow-xl shadow-brand-100">
                        <h4 className="text-sm font-black mb-4 uppercase tracking-widest">Public Access</h4>
                        <p className="text-brand-100 text-sm font-medium mb-6 leading-relaxed">This record is publicly accessible and can be shared with verification partners.</p>
                        <div className="space-y-3">
                            <Button variant="outline" className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white" leftIcon={<Share2 className="h-4 w-4" />}>
                                Share Link
                            </Button>
                            <Button variant="outline" className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white" leftIcon={<Download className="h-4 w-4" />}>
                                Export PDF
                            </Button>
                        </div>
                    </Card>

                    <Card padding="lg">
                        <h4 className="text-xs font-black text-slate-400 mb-4 uppercase tracking-widest">Institutional Context</h4>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                                <span className="text-xs font-bold text-slate-700">Audit Status: Syncing</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                                <span className="text-xs font-bold text-slate-700">Network: Mainnet-01</span>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
            
            <div className="flex justify-center pt-8">
                <Button variant="ghost" size="md" className="text-slate-500" leftIcon={<ArrowRight className="h-4 w-4 rotate-180" />}>
                    Verify Another Credential
                </Button>
            </div>
        </div>
    );
}
