import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';

export async function POST(req: Request) {
    try {
        const { certificateId } = await req.json();

        const [rows] = await pool.query<RowDataPacket[]>(
            `SELECT 
        c.certificate_id, 
        c.issue_date, 
        c.expiry_date, 
        c.status, 
        c.revocation_reason,
        c.data_hash,
        c.qr_code,
        p.full_name, 
        p.email,
        t.title as template_name
       FROM certificates c 
       JOIN profiles p ON c.user_id = p.id 
       LEFT JOIN templates t ON c.template_id = t.id
       WHERE c.certificate_id = ?`,
            [certificateId]
        );

        const data = rows[0];

        if (!data) {
            return NextResponse.json({ valid: false, error: 'Certificate not found' });
        }

        return NextResponse.json({
            valid: data.status === 'valid',
            status: data.status,
            revocation_reason: data.revocation_reason,
            data: {
                certificate_id: data.certificate_id,
                issue_date: data.issue_date,
                expiry_date: data.expiry_date,
                qr_code: data.qr_code,
                data_hash: data.data_hash,
                profiles: {
                    full_name: data.full_name,
                    email: data.email
                },
                template_name: data.template_name
            }
        });
    } catch (error) {
        console.error('Verification error:', error);
        return NextResponse.json({ valid: false });
    }
}
