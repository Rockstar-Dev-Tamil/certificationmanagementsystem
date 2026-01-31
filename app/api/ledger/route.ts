import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';

export async function GET() {
    try {
        const [rows] = await pool.query<RowDataPacket[]>(
            `SELECT 
                c.certificate_id, 
                c.issue_date, 
                c.status, 
                c.data_hash,
                p.full_name, 
                t.title as template_name
            FROM certificates c
            JOIN profiles p ON c.user_id = p.id
            JOIN templates t ON c.template_id = t.id
            ORDER BY c.issue_date DESC
            LIMIT 100`
        );

        return NextResponse.json({
            success: true,
            ledger: rows
        });
    } catch (err: any) {
        console.error('Ledger error:', err);
        return NextResponse.json({ error: 'Failed to fetch ledger' }, { status: 500 });
    }
}
