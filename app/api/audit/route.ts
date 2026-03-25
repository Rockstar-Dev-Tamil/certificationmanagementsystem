import { NextResponse } from "next/server";

import { supabase } from "@/lib/supabase";
import { getAuthUser } from "@/lib/security";

export async function GET(req: Request) {
  const user = await getAuthUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const url = new URL(req.url);
    const q = url.searchParams.get("q")?.trim() ?? "";
    const action = url.searchParams.get("action")?.trim() ?? "";
    const from = url.searchParams.get("from")?.trim() ?? "";
    const to = url.searchParams.get("to")?.trim() ?? "";
    const limit = Math.min(Number(url.searchParams.get("limit") ?? 200), 500);

    let query = supabase.from("audit_logs").select("*").order("created_at", { ascending: false }).limit(limit);

    if (action) query = query.eq("action", action);
    if (from) query = query.gte("created_at", new Date(from).toISOString());
    if (to) query = query.lte("created_at", new Date(to).toISOString());
    if (q) query = query.or(`action.ilike.%${q}%,target_id.ilike.%${q}%,details.ilike.%${q}%`);

    const { data, error } = await query;
    if (error) throw error;

    return NextResponse.json({ success: true, audits: data ?? [] });
  } catch (err: any) {
    console.error("Audit list error:", err);
    return NextResponse.json({ error: "Failed to fetch audit logs" }, { status: 500 });
  }
}

