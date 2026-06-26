import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { updateProfile } from "./actions";
import { signOut } from "@/app/login/actions";
import { LogOut } from "lucide-react";
import Link from "next/link";
import type { Profile } from "@/types/database";

const FIELD: React.CSSProperties = {
  background: "var(--surface)",
  border: "1px solid var(--border)",
  borderRadius: 10,
  padding: "16px 18px",
};

const BIG_INPUT: React.CSSProperties = {
  marginTop: 6,
  width: "100%",
  background: "transparent",
  border: "none",
  fontWeight: 800,
  fontSize: 40,
  letterSpacing: "-.03em",
  outline: "none",
};

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
    .select("goal_weight, height_cm, target_date")
    .eq("id", user.id)
    .maybeSingle();

  const profile = profileRaw as (Pick<Profile, "goal_weight" | "height_cm"> & { target_date: string | null }) | null;
  const isOnboarding = !profile?.height_cm || !profile?.goal_weight;

  return (
    <main style={{ width: 430, maxWidth: "100%", margin: "0 auto", padding: "0 18px", minHeight: "100vh" }}>
      <div className="flex flex-col justify-center" style={{ minHeight: "100vh", animation: "rise .5s ease both", paddingTop: 40, paddingBottom: 40 }}>
        <div className="flex items-center justify-between">
          <span className="font-mono" style={{ fontSize: 10, letterSpacing: ".28em", color: "var(--muted-2)" }}>
            {isOnboarding ? "STEP 01 / 01 — FIRST RUN" : "PROFILE SETTINGS"}
          </span>
          {!isOnboarding && (
            <Link href="/" className="font-mono transition-opacity hover:opacity-70" style={{ fontSize: 10, color: "var(--muted)", letterSpacing: ".1em" }}>
              ← BACK
            </Link>
          )}
        </div>

        <h1 className="font-black" style={{ fontSize: 46, lineHeight: 0.95, letterSpacing: "-.035em", marginTop: 12 }}>
          {isOnboarding ? (<>Set your<br />baseline.</>) : (<>Your<br />numbers.</>)}
        </h1>
        <p style={{ fontSize: 15, color: "var(--muted)", marginTop: 14, maxWidth: 300, lineHeight: 1.4 }}>
          A few numbers so we can chart your trend and project your goal date.
        </p>

        {pageError && (
          <div
            className="flex items-center gap-2.5"
            style={{ marginTop: 20, background: "rgba(255,91,69,0.08)", border: "1px solid rgba(255,91,69,0.3)", borderRadius: 8, padding: "11px 13px" }}
          >
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--danger)" }} />
            <span style={{ fontSize: 13, color: "#FF8A78" }}>{pageError}</span>
          </div>
        )}

        <form action={updateProfile} className="flex flex-col gap-3.5" style={{ marginTop: 32 }}>
          <div style={FIELD}>
            <div className="flex items-center justify-between">
              <label htmlFor="height_cm" className="font-mono" style={{ fontSize: 10, letterSpacing: ".16em", color: "var(--muted-2)" }}>HEIGHT</label>
              <span className="font-mono" style={{ fontSize: 11, color: "var(--muted-2)" }}>CM</span>
            </div>
            <input
              id="height_cm" name="height_cm" type="number" inputMode="decimal"
              step="0.1" min="50" max="300" required
              defaultValue={profile?.height_cm ?? ""} placeholder="178"
              style={{ ...BIG_INPUT, color: "var(--foreground)" }}
            />
          </div>

          <div style={FIELD}>
            <div className="flex items-center justify-between">
              <label htmlFor="goal_weight" className="font-mono" style={{ fontSize: 10, letterSpacing: ".16em", color: "var(--accent)" }}>GOAL WEIGHT</label>
              <span className="font-mono" style={{ fontSize: 11, color: "var(--muted-2)" }}>KG</span>
            </div>
            <input
              id="goal_weight" name="goal_weight" type="number" inputMode="decimal"
              step="0.1" min="20" max="999" required
              defaultValue={profile?.goal_weight ?? ""} placeholder="78"
              style={{ ...BIG_INPUT, color: "var(--accent)" }}
            />
          </div>

          <div style={FIELD}>
            <div className="flex items-center justify-between">
              <label htmlFor="target_date" className="font-mono" style={{ fontSize: 10, letterSpacing: ".16em", color: "var(--muted-2)" }}>TARGET DATE</label>
              <span className="font-mono" style={{ fontSize: 11, color: "var(--muted-3)" }}>OPTIONAL</span>
            </div>
            <input
              id="target_date" name="target_date" type="date"
              defaultValue={profile?.target_date ?? ""}
              className="font-mono"
              style={{ marginTop: 8, width: "100%", background: "transparent", border: "none", outline: "none", color: "var(--foreground)", fontWeight: 700, fontSize: 20, colorScheme: "dark" }}
            />
          </div>

          <button
            type="submit"
            className="flex items-center justify-between font-extrabold transition-all active:scale-[0.99]"
            style={{ marginTop: 10, background: "var(--accent)", color: "#0b0d09", height: 56, borderRadius: 9, padding: "0 22px", fontSize: 16, letterSpacing: "-.01em", boxShadow: "0 10px 34px var(--accent-soft)" }}
          >
            <span>{isOnboarding ? "Start tracking" : "Save changes"}</span>
            <span style={{ fontSize: 22 }}>→</span>
          </button>
        </form>

        <div className="flex items-center justify-between" style={{ marginTop: 24, borderTop: "1px solid var(--border)", paddingTop: 16 }}>
          <span className="font-mono" style={{ fontSize: 10, color: "var(--muted-2)", letterSpacing: ".04em" }}>{user.email}</span>
          <form action={signOut}>
            <button type="submit" className="flex items-center gap-1.5 font-mono transition-opacity hover:opacity-70" style={{ fontSize: 10, color: "var(--muted)", letterSpacing: ".1em" }}>
              <LogOut size={12} /> SIGN OUT
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
