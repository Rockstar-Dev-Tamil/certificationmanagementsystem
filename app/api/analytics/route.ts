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

        // 1b. Status counts
        const [{ count: validCount, error: validError }, { count: revokedCount, error: revokedError }, { count: expiredCount, error: expiredError }] =
          await Promise.all([
            supabase.from('certificates').select('*', { count: 'exact', head: true }).eq('status', 'valid'),
            supabase.from('certificates').select('*', { count: 'exact', head: true }).eq('status', 'revoked'),
            supabase.from('certificates').select('*', { count: 'exact', head: true }).eq('status', 'expired'),
          ]);

        if (validError) throw validError;
        if (revokedError) throw revokedError;
        if (expiredError) throw expiredError;

        // 1c. Expiring soon (next 30 days)
        const now = new Date();
        const soon = new Date();
        soon.setDate(soon.getDate() + 30);
        const { count: expiringSoon, error: expSoonError } = await supabase
          .from('certificates')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'valid')
          .not('expiry_date', 'is', null)
          .gte('expiry_date', now.toISOString())
          .lte('expiry_date', soon.toISOString());

        if (expSoonError) throw expSoonError;

        // 2. Issued today
        const today = new Date().toISOString().split('T')[0];
        const { count: todayCount, error: todayError } = await supabase
            .from('certificates')
            .select('*', { count: 'exact', head: true })
            .gte('issue_date', today);

        if (todayError) throw todayError;

        // 3. Template count
        const { count: templateCount, error: templateError } = await supabase
            .from('templates')
            .select('*', { count: 'exact', head: true });

        if (templateError) throw templateError;

        // 4. Institutional Profile count
        const { count: profileCount, error: profileError } = await supabase
            .from('profiles')
            .select('*', { count: 'exact', head: true });

        if (profileError) throw profileError;

        // 5. Recent 5 certificates
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

        // 6. Trend Data
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

        // 6b. Monthly aggregates (last 12 months)
        const monthsAgo = new Date();
        monthsAgo.setMonth(monthsAgo.getMonth() - 12);
        const { data: yearData, error: yearError } = await supabase
          .from('certificates')
          .select('issue_date,status')
          .gte('issue_date', monthsAgo.toISOString());
        if (yearError) throw yearError;

        const monthKey = (iso: string) => {
          const d = new Date(iso);
          return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        };
        const monthAgg: Record<string, { month: string; issue: number; revoke: number; expire: number }> = {};
        yearData.forEach((row: any) => {
          const m = monthKey(row.issue_date);
          monthAgg[m] ||= { month: m, issue: 0, revoke: 0, expire: 0 };
          monthAgg[m].issue += 1;
          if (row.status === 'revoked') monthAgg[m].revoke += 1;
          if (row.status === 'expired') monthAgg[m].expire += 1;
        });
        const monthly = Object.values(monthAgg).sort((a, b) => (a.month < b.month ? -1 : 1));

        const statusDistribution = [
          { name: 'Active', value: validCount || 0 },
          { name: 'Revoked', value: revokedCount || 0 },
          { name: 'Expired', value: expiredCount || 0 },
        ];

        // 7. Recent Audit Logs
        const { data: audits, error: auditError } = await supabase
            .from('audit_logs')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(5);

        if (auditError) throw auditError;

        return NextResponse.json({
            total: total || 0,
            active: validCount || 0,
            revoked: revokedCount || 0,
            expired: expiredCount || 0,
            expiringSoon: expiringSoon || 0,
            today: todayCount || 0,
            templates: templateCount || 0,
            profiles: profileCount || 0,
            recent: recent.map(r => ({
                id: r.id,
                certificate_id: r.certificate_id,
                issue_date: r.issue_date,
                status: r.status,
                full_name: r.profiles ? (r.profiles as any).full_name : 'N/A',
                template_name: r.templates ? (r.templates as any).title : 'Standard'
            })),
            trend,
            monthly,
            statusDistribution,
            audits: audits || []
        });
    } catch (err: any) {
        console.error('Analytics error:', err);
        return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
    }
}
