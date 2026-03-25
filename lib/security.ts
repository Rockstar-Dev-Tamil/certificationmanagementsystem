import { supabase } from '@/lib/supabase';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { serialize } from 'cookie';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-dev-only';

export interface AuthTokenPayload {
    userId: string;
    email: string;
    role: string;
}

export function createAuthToken(payload: AuthTokenPayload) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function buildAuthCookie(token: string) {
    return serialize('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
    });
}

export function buildLogoutCookie() {
    return serialize('token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 0,
        path: '/',
    });
}

export function getBaseUrl() {
    return (
        process.env.NEXT_PUBLIC_BASE_URL ||
        process.env.NEXT_PUBLIC_APP_URL ||
        'http://localhost:3000'
    ).replace(/\/$/, '');
}

/**
 * RBAC Helper: Checks if a user has the required role
 */
export async function checkRole(userId: string, allowedRoles: string[]) {
    try {
        const { data, error } = await supabase
            .from('users')
            .select('role')
            .eq('id', userId)
            .single();

        if (error || !data) return false;
        return allowedRoles.includes(data.role);
    } catch (err) {
        console.error('RBAC Error:', err);
        return false;
    }
}

/**
 * Blockchain Simulation: Signs a certificate hash and records it in the 'ledger'
 * In a real V3, this would push to Polygon/Ethereum
 */
export async function signAndCommitToChain(certificateId: string, dataHash: string) {
    try {
        const privateKey = process.env.BLOCKCHAIN_SIM_KEY || 'certisafe-v2-dev-signing-key';
        const signature = crypto
            .createHmac('sha256', privateKey)
            .update(dataHash)
            .digest('hex');

        // Record in the audit ledger
        const { error } = await supabase
            .from('audit_logs')
            .insert([{
                action: 'BLOCKCHAIN_COMMIT_SIM',
                target_id: certificateId,
                details: JSON.stringify({
                    tx_hash: crypto.randomBytes(32).toString('hex'),
                    signing_signature: signature,
                    network: 'CertiSafe-L2-Simulated'
                })
            }]);

        if (error) throw error;

        return signature;
    } catch (err) {
        console.error('Blockchain Sim Error:', err);
        throw err;
    }
}

export async function getProfileByUserId(userId: string) {
    const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, email, is_blocked')
        .eq('user_id', userId)
        .single();

    if (error) {
        return null;
    }

    return data;
}

export async function getSettingsMap(keys?: string[]) {
    let query = supabase.from('settings').select('key,value');
    if (keys && keys.length > 0) {
        query = query.in('key', keys);
    }

    const { data, error } = await query;
    if (error) {
        return {};
    }

    return Object.fromEntries((data ?? []).map((row) => [row.key, row.value])) as Record<string, string | null>;
}

export async function logAudit(action: string, options?: { performedBy?: string | null; targetId?: string | null; details?: unknown }) {
    const payload = {
        action,
        performed_by: options?.performedBy ?? null,
        target_id: options?.targetId ?? null,
        details:
            typeof options?.details === 'string'
                ? options.details
                : options?.details === undefined
                  ? null
                  : JSON.stringify(options.details),
    };

    const { error } = await supabase.from('audit_logs').insert([payload]);
    if (error) {
        throw error;
    }
}

/**
 * Auth Helper: Verifies the JWT token from cookies and returns the user payload
 */
export async function getAuthUser() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) return null;

        return jwt.verify(token, JWT_SECRET) as AuthTokenPayload;
    } catch {
        return null;
    }
}
