import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getAuthUser } from '@/lib/security';

export async function GET() {
    const user = await getAuthUser();
    if (!user || user.role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { data: audits, error } = await supabase
            .from('audit_logs')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        // Generate CSV
        const headers = ['ID', 'Action', 'Actor', 'Target ID', 'Timestamp', 'Details'];
        const escapeCSV = (val: unknown) => {
            const str = String(val ?? '');
            if (str.includes(',') || str.includes('"') || str.includes('\n')) {
                return `"${str.replace(/"/g, '""')}"`;
            }
            return str;
        };
        const csvRows = audits.map(row => [
            escapeCSV(row.id),
            escapeCSV(row.action),
            escapeCSV(row.performed_by || ''),
            escapeCSV(row.target_id || 'System'),
            escapeCSV(new Date(row.created_at).toISOString()),
            escapeCSV(JSON.stringify(row.details || {}))
        ]);

        const csvContent = [headers, ...csvRows].map(e => e.join(",")).join("\n");

        return new NextResponse(csvContent, {
            headers: {
                'Content-Type': 'text/csv',
                'Content-Disposition': `attachment; filename=certisafe-audit-frame-${new Date().toISOString().split('T')[0]}.csv`
            }
        });
    } catch (err: any) {
        console.error('Audit export error:', err);
        return NextResponse.json({ error: 'Failed to export audit frame' }, { status: 500 });
    }
}
