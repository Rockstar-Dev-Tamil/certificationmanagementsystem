import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';

import { getAuthUser } from '@/lib/security';

export async function GET(req: Request) {
    const user = await getAuthUser();
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        // If user is admin, they can see all or filter. If not, they only see their own.
        const url = new URL(req.url);
        const userId = user.role === 'admin' ? url.searchParams.get('userId') : user.userId;

        let query = `
      SELECT c.certificate_id, c.issue_date, c.expiry_date, c.status, t.title
      FROM certificates c
      LEFT JOIN templates t ON c.template_id = t.id
    `;
        const params: any[] = [];

        if (userId) {
            query += ' WHERE c.user_id = ?';
            params.push(userId);
        }

        query += ' ORDER BY c.issue_date DESC';

        const [rows] = await pool.query<RowDataPacket[]>(query, params);

        // Transform for frontend
        const certificates = rows.map((row) => ({
            id: row.certificate_id,
            title: row.title || 'Certificate',
            date: new Date(row.issue_date).toLocaleDateString(),
            expiry: row.expiry_date ? new Date(row.expiry_date).toLocaleDateString() : 'N/A',
            recipient: 'You', // Placeholder since auth is removed
        }));

        return NextResponse.json(certificates);
    } catch (err: any) {
        console.error('Certificates error:', err);
        return NextResponse.json({ error: 'Failed to fetch certificates' }, { status: 500 });
    }
}
