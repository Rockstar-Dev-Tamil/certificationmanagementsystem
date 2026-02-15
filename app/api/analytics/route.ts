import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getAuthUser } from '@/lib/security';

export async function GET() {
    const user = await getAuthUser();
    if (!user || user.role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        // 1. Total certificates
        const { count: total, error: countError } = await supabase
            .from('certificates')
            .select('*', { count: 'exact', head: true });

        if (countError) throw countError;

        // 2. Issued today
        const today = new Date().toISOString().split('T')[0];
        const { count: todayCount, error: todayError } = await supabase
            .from('certificates')
            .select('*', { count: 'exact', head: true })
            .gte('issue_date', today);

        if (todayError) throw todayError;

        // 3. Recent 5 certificates
        const { data: recent, error: recentError } = await supabase
            .from('certificates')
            .select(`
                id,
                certificate_id,
                issue_date,
                status,
                profiles (
                    full_name
                ),
                templates (
                    title
                )
            `)
            .order('created_at', { ascending: false })
            .limit(5);

        if (recentError) throw recentError;

        // 4. Trend Data (Manual aggregation since Supabase count is per request)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const { data: trendData, error: trendError } = await supabase
            .from('certificates')
            .select('issue_date')
            .gte('issue_date', sevenDaysAgo.toISOString());

        if (trendError) throw trendError;

        const trendMap: Record<string, number> = {};
        trendData.forEach(item => {
            const d = new Date(item.issue_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            trendMap[d] = (trendMap[d] || 0) + 1;
        });

        const trend = Object.keys(trendMap).map(date => ({
            date,
            count: trendMap[date]
        }));

        return NextResponse.json({
            total: total || 0,
            today: todayCount || 0,
            recent: recent.map(r => ({
                id: r.id,
                certificate_id: r.certificate_id,
                issue_date: r.issue_date,
                status: r.status,
                full_name: r.profiles ? (r.profiles as any).full_name : 'N/A',
                template_name: r.templates ? (r.templates as any).title : 'Standard'
            })),
            trend
        });
    } catch (err: any) {
        console.error('Analytics error:', err);
        return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
    }
}
