import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';

import { getAuthUser } from '@/lib/security';

export async function GET() {
    const user = await getAuthUser();
    if (!user || user.role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const [totalCertificates] = await pool.query<RowDataPacket[]>('SELECT COUNT(*) as count FROM certificates');
        const [issuedToday] = await pool.query<RowDataPacket[]>('SELECT COUNT(*) as count FROM certificates WHERE DATE(issue_date) = CURDATE()');

        // Recent 5 certificates
        const [recent] = await pool.query<RowDataPacket[]>(
            `SELECT c.id, c.certificate_id, c.issue_date, c.status, p.full_name, t.title as template_name
       FROM certificates c
       LEFT JOIN profiles p ON c.user_id = p.id
       LEFT JOIN templates t ON c.template_id = t.id
       ORDER BY c.created_at DESC LIMIT 5`
        );

        // 4. Fetch Trend Data (Last 7 days)
        const [trend] = await pool.query<RowDataPacket[]>(
            `SELECT DATE(issue_date) as date, COUNT(*) as count 
             FROM certificates 
             WHERE issue_date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY) 
             GROUP BY DATE(issue_date) 
             ORDER BY date ASC`
        );

        return NextResponse.json({
            total: totalCertificates[0].count,
            today: issuedToday[0].count,
            recent,
            trend: trend.map(t => ({
                date: new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                count: t.count
            }))
        });
    } catch (err: any) {
        console.error('Analytics error:', err);
        return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
    }
}
