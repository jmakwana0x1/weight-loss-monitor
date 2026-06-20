import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { Header } from "@/components/header";
import { QuickLog } from "@/components/quick-log";
import { StatsGrid } from "@/components/stats-grid";
import { InsightsCard } from "@/components/insights-card";
import { WeightChartDynamic } from "@/components/weight-chart-dynamic";
import { EntriesList } from "@/components/entries-list";
import { buildChartData } from "@/lib/chart-data";
import { computeStats } from "@/lib/stats";
import { linearRegression } from "@/lib/regression";
import type { WeightEntry, Profile } from "@/types/database";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [{ data: entriesRaw }, { data: profileRaw }] = await Promise.all([
    (supabase as any)
      .from("weight_entries")
      .select("*")
      .order("logged_at", { ascending: false })
      .limit(90),
    (supabase as any)
      .from("profiles")
      .select("goal_weight, height_cm")
      .eq("id", user.id)
      .single(),
  ]);

  const entries: WeightEntry[] = entriesRaw ?? [];
  const profile: Pick<Profile, "goal_weight" | "height_cm"> | null = profileRaw ?? null;

  // First-time users must set up their profile before seeing the dashboard
  if (!profile?.height_cm || !profile?.goal_weight) {
    redirect("/profile");
  }

  const chartData  = buildChartData(entries);
  const stats      = computeStats(entries, profile?.height_cm ?? null, profile?.goal_weight ?? null);
  const projection = linearRegression(entries, profile?.goal_weight ?? null);

  return (
    <main className="min-h-screen px-4 py-8" style={{ maxWidth: 480, margin: "0 auto" }}>
      <Header email={user.email ?? ""} />
      <QuickLog lastWeight={stats.currentWeight ?? undefined} />
      <StatsGrid stats={stats} />
      {projection && (
        <InsightsCard
          projection={projection}
          goalWeight={profile?.goal_weight ?? null}
          currentWeight={stats.currentWeight}
        />
      )}
      <WeightChartDynamic data={chartData} goalWeight={profile?.goal_weight} />
      <EntriesList entries={entries.slice(0, 30)} />
    </main>
  );
}
