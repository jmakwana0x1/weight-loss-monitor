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

  const patch: Record<string, number | string | null> = {
    updated_at: new Date().toISOString(),
  };

  if (!isNaN(heightCm) && heightCm > 50 && heightCm < 300)     patch.height_cm   = heightCm;
  if (!isNaN(goalWeight) && goalWeight > 20 && goalWeight < 999) patch.goal_weight = goalWeight;
  if (targetDate) patch.target_date = targetDate;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (supabase as any)
    .from("profiles")
    .upsert({ id: user.id, ...patch });

  revalidatePath("/");
  redirect("/");
}
