"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import type { WeightEntryInsert } from "@/types/database";

export async function logWeight(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const weight = parseFloat(formData.get("weight") as string);
  const note = (formData.get("note") as string).trim() || null;

  if (isNaN(weight) || weight < 20 || weight > 999) return;

  const entry: WeightEntryInsert = {
    user_id: user.id,
    weight,
    note,
    logged_at: new Date().toISOString(),
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any).from("weight_entries").insert(entry);
  if (error) throw error;
  revalidatePath("/");
}

export async function deleteEntry(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from("weight_entries")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw error;
  revalidatePath("/");
}
