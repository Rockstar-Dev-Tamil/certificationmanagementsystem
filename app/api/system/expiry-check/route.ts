import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { ResultSetHeader } from 'mysql2';

export async function GET() {
    try {
        const [result] = await pool.query<ResultSetHeader>(
            `UPDATE certificates 
             SET status = 'expired' 
             WHERE expiry_date IS NOT NULL 
             AND expiry_date < CURRENT_TIMESTAMP 
             AND status = 'valid'`
        );

        // Log the auto-cleanup
        if (result.affectedRows > 0) {
            console.log(`[Auto-Expiry] ${result.affectedRows} certificates marked as expired.`);
            await pool.query(
                'INSERT INTO audit_logs (action, details) VALUES (?, ?)',
                ['AUTO_EXPIRY_ENGINE', `${result.affectedRows} certificates expired automatically.`]
            );
        }

        return NextResponse.json({
            success: true,
            expired_count: result.affectedRows
        });
    } catch (err: any) {
        console.error('Auto-expiry error:', err);
        return NextResponse.json({ error: 'Failed to run auto-expiry engine' }, { status: 500 });
    }
}
