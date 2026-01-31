import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { ResultSetHeader } from 'mysql2';

export async function POST(req: Request) {
    try {
        const { certificateId, reason } = await req.json();

        if (!certificateId) {
            return NextResponse.json({ error: 'Missing certificateId' }, { status: 400 });
        }

        const [result] = await pool.query<ResultSetHeader>(
            `UPDATE certificates 
             SET status = 'revoked', revocation_reason = ? 
             WHERE certificate_id = ?`,
            [reason || 'No reason provided', certificateId]
        );

        if (result.affectedRows === 0) {
            return NextResponse.json({ error: 'Certificate not found' }, { status: 404 });
        }

        // Log the action
        await pool.query(
            'INSERT INTO audit_logs (action, target_id, details) VALUES (?, ?, ?)',
            ['REVOKE_CERTIFICATE', certificateId, reason]
        );

        return NextResponse.json({ success: true, message: 'Certificate revoked successfully' });

    } catch (err: any) {
        console.error('Revocation error:', err);
        return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
    }
}
