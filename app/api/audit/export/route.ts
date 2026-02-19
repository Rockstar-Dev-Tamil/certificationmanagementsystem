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
        const headers = ['ID', 'Action', 'Target ID', 'Timestamp', 'Metadata'];
        const csvRows = audits.map(row => [
            row.id,
            row.action,
            row.target_id || 'System',
            new Date(row.created_at).toISOString(),
            JSON.stringify(row.metadata || {}).replace(/"/g, '""') // Escape quotes for CSV
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
