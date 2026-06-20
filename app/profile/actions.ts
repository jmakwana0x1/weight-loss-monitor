"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const heightCm   = parseFloat(formData.get("height_cm") as string);
  const goalWeight = parseFloat(formData.get("goal_weight") as string);
  const targetDate = (formData.get("target_date") as string) || null;

  if (isNaN(heightCm) || heightCm <= 50 || heightCm >= 300) {
    redirect("/profile?error=Height must be between 50 and 300 cm");
  }
  if (isNaN(goalWeight) || goalWeight <= 20 || goalWeight >= 999) {
    redirect("/profile?error=Goal weight must be between 20 and 999 kg");
  }

  const payload: Record<string, string | number | null> = {
    id: user.id,
    height_cm: heightCm,
    goal_weight: goalWeight,
    updated_at: new Date().toISOString(),
  };
  if (targetDate) payload.target_date = targetDate;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from("profiles")
    .upsert(payload, { onConflict: "id" });

  if (error) {
    redirect(`/profile?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/");
  redirect("/");
}
