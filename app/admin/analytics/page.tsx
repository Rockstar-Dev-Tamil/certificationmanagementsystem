"use client";

import * as React from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";

type AnalyticsResponse = {
  trend: Array<{ date: string; count: number }>;
  monthly: Array<{ month: string; issue: number; revoke: number; expire: number }>;
  statusDistribution: Array<{ name: string; value: number }>;
};

export default function AnalyticsPage() {
  const [loading, setLoading] = React.useState(true);
  const [data, setData] = React.useState<AnalyticsResponse | null>(null);

  React.useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const res = await fetch("/api/analytics");
        const json = (await res.json()) as any;
        if (!mounted) return;
        setData({
          trend: Array.isArray(json?.trend) ? json.trend : [],
          monthly: Array.isArray(json?.monthly) ? json.monthly : [],
          statusDistribution: Array.isArray(json?.statusDistribution) ? json.statusDistribution : [],
        });
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const colors = ["#2563EB", "#DC2626", "#D97706"];

  return (
    <div>
      <PageHeader
        title="Analytics"
        subtitle="Trends, distribution, and monthly activity."
      />

      <div className="px-6 py-6">
        {loading || !data ? (
          <div className="grid gap-6 lg:grid-cols-12">
            <Card className="lg:col-span-6">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="mt-6 h-64 w-full" />
            </Card>
            <Card className="lg:col-span-6">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="mt-6 h-64 w-full" />
            </Card>
            <Card className="lg:col-span-4">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="mt-6 h-64 w-full" />
            </Card>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-12">
            <Card className="lg:col-span-6">
              <div className="text-sm font-semibold text-[var(--text-primary)]">
                Certificates issued over time
              </div>
              <div className="mt-6 h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data.trend}>
                    <defs>
                      <linearGradient id="accentFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563EB" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: "#64748B", fontSize: 12 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: "#64748B", fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{
                        borderRadius: 12,
                        border: "1px solid #E2E8F0",
                        boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
                      }}
                    />
                    <Area type="monotone" dataKey="count" stroke="#2563EB" fill="url(#accentFill)" strokeWidth={2.5} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card className="lg:col-span-6">
              <div className="text-sm font-semibold text-[var(--text-primary)]">
                Issue vs revoke vs expire (monthly)
              </div>
              <div className="mt-6 h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.monthly}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#64748B", fontSize: 12 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: "#64748B", fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{
                        borderRadius: 12,
                        border: "1px solid #E2E8F0",
                        boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
                      }}
                    />
                    <Bar dataKey="issue" fill="#2563EB" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="revoke" fill="#DC2626" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="expire" fill="#D97706" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card className="lg:col-span-4">
              <div className="text-sm font-semibold text-[var(--text-primary)]">
                Status distribution
              </div>
              <div className="mt-6 h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Tooltip
                      contentStyle={{
                        borderRadius: 12,
                        border: "1px solid #E2E8F0",
                        boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
                      }}
                    />
                    <Pie
                      data={data.statusDistribution}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={3}
                    >
                      {data.statusDistribution.map((_, idx) => (
                        <Cell key={idx} fill={colors[idx % colors.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

