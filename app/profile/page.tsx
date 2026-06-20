import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { updateProfile } from "./actions";
import { signOut } from "@/app/login/actions";
import { LogOut, User } from "lucide-react";
import Link from "next/link";
import type { Profile } from "@/types/database";

export default async function ProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { error: pageError } = await searchParams;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: profileRaw } = await (supabase as any)
    .from("profiles")
    .select("goal_weight, height_cm")
    .eq("id", user.id)
    .maybeSingle();

  const profile = profileRaw as Pick<Profile, "goal_weight" | "height_cm"> | null;
  const isOnboarding = !profile?.height_cm || !profile?.goal_weight;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4">
      <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
        <div
          className="absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full blur-3xl opacity-20"
          style={{ background: "var(--accent)" }}
        />
        <div
          className="absolute bottom-0 right-0 h-72 w-72 rounded-full blur-3xl opacity-10"
          style={{ background: "var(--accent)" }}
        />
      </div>

      <div
        className="relative w-full max-w-sm rounded-2xl border p-8 shadow-2xl"
        style={{
          background: "var(--glass-bg)",
          borderColor: "var(--glass-border)",
          backdropFilter: "blur(20px)",
        }}
      >
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <User size={16} style={{ color: "var(--accent)" }} />
            <span className="text-lg font-bold tracking-tight" style={{ color: "var(--accent)" }}>
              {isOnboarding ? "Set up your profile" : "Profile settings"}
            </span>
          </div>
          {!isOnboarding && (
            <Link href="/" className="text-xs transition-opacity hover:opacity-70" style={{ color: "var(--muted)" }}>
              ← Back
            </Link>
          )}
        </div>

        {isOnboarding && (
          <p className="text-sm mb-6" style={{ color: "var(--muted)" }}>
            Just a few quick details and you&apos;re ready to start tracking.
          </p>
        )}

        {pageError && (
          <div
            className="mb-5 rounded-xl border px-4 py-3 text-sm"
            style={{ borderColor: "#ef4444", background: "rgba(239,68,68,0.08)", color: "#ef4444" }}
          >
            {pageError}
          </div>
        )}

        <form action={updateProfile} className="flex flex-col gap-5">
          {/* height */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="height_cm" className="text-xs font-medium uppercase tracking-widest" style={{ color: "var(--muted)" }}>
              Height (cm)
            </label>
            <input
              id="height_cm" name="height_cm" type="number"
              step="0.1" min="50" max="300"
              defaultValue={profile?.height_cm ?? ""}
              placeholder="e.g. 175" required
              className="login-input rounded-xl border px-3 py-3 text-sm outline-none"
              style={{ background: "rgba(255,255,255,0.04)", borderColor: "var(--glass-border)", color: "var(--foreground)" }}
            />
          </div>

          {/* goal weight */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="goal_weight" className="text-xs font-medium uppercase tracking-widest" style={{ color: "var(--muted)" }}>
              Goal weight (kg)
            </label>
            <input
              id="goal_weight" name="goal_weight" type="number"
              step="0.1" min="20" max="999"
              defaultValue={profile?.goal_weight ?? ""}
              placeholder="e.g. 70" required
              className="login-input rounded-xl border px-3 py-3 text-sm outline-none"
              style={{ background: "rgba(255,255,255,0.04)", borderColor: "var(--glass-border)", color: "var(--foreground)" }}
            />
          </div>

          {/* target date */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="target_date" className="text-xs font-medium uppercase tracking-widest" style={{ color: "var(--muted)" }}>
              Target date{" "}
              <span className="normal-case font-normal">(optional)</span>
            </label>
            <input
              id="target_date" name="target_date" type="date"
              defaultValue={profile?.target_date ?? ""}
              className="login-input rounded-xl border px-3 py-3 text-sm outline-none"
              style={{ background: "rgba(255,255,255,0.04)", borderColor: "var(--glass-border)", color: "var(--foreground)", colorScheme: "dark" }}
            />
            <p className="text-xs" style={{ color: "var(--muted)" }}>
              The date you want to hit your goal by. Leave blank to use the calculated projection.
            </p>
          </div>

          <button
            type="submit"
            className="mt-2 w-full rounded-xl py-3 text-sm font-semibold transition-all active:scale-95"
            style={{ background: "var(--accent)", color: "#000" }}
          >
            {isOnboarding ? "Get started" : "Save changes"}
          </button>
        </form>

        <div className="mt-6 border-t pt-4" style={{ borderColor: "var(--glass-border)" }}>
          <p className="text-xs mb-3" style={{ color: "var(--muted)" }}>{user.email}</p>
          <form action={signOut}>
            <button type="submit" className="flex items-center gap-1.5 text-xs transition-opacity hover:opacity-70" style={{ color: "var(--muted)" }}>
              <LogOut size={12} />
              Sign out
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
