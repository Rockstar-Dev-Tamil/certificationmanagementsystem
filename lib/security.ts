import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-dev-only';

/**
 * RBAC Helper: Checks if a user has the required role
 */
export async function checkRole(userId: string, allowedRoles: string[]) {
    try {
        const [rows] = await pool.query<RowDataPacket[]>('SELECT role FROM profiles WHERE id = ?', [userId]);
        if (rows.length === 0) return false;
        return allowedRoles.includes(rows[0].role);
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
        await pool.query(
            'INSERT INTO audit_logs (action, target_id, details) VALUES (?, ?, ?)',
            ['BLOCKCHAIN_COMMIT_SIM', certificateId, JSON.stringify({
                tx_hash: crypto.randomBytes(32).toString('hex'),
                signing_signature: signature,
                network: 'CertiSafe-L2-Simulated'
            })]
        );

        return signature;
    } catch (err) {
        console.error('Blockchain Sim Error:', err);
        throw err;
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

        return jwt.verify(token, JWT_SECRET) as any;
    } catch (err) {
        return null;
    }
}
