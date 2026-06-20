import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: entries, error } = await (supabase as any)
    .from("weight_entries")
    .select("logged_at, weight, body_fat, note")
    .eq("user_id", user.id)
    .order("logged_at", { ascending: false });

  if (error || !entries) {
    return new NextResponse("Failed to fetch entries", { status: 500 });
  }

  const escape = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;

  const header = ["Date", "Weight (kg)", "Body Fat (%)", "Note"].map(escape).join(",");
  const rows = (entries as Array<{ logged_at: string; weight: number; body_fat: number | null; note: string | null }>)
    .map((e) => [
      new Date(e.logged_at).toISOString().slice(0, 10),
      e.weight.toFixed(1),
      e.body_fat != null ? e.body_fat.toFixed(1) : "",
      e.note ?? "",
    ].map(escape).join(","));

  const csv = [header, ...rows].join("\n");
  const filename = `weight-log-${new Date().toISOString().slice(0, 10)}.csv`;

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
