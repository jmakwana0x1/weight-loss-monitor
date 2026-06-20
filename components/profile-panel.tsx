"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { Settings, ChevronDown, ChevronUp } from "lucide-react";
import { updateProfile } from "@/app/profile/actions";

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-xl px-4 py-2 text-sm font-semibold transition-all active:scale-95 disabled:opacity-50"
      style={{ background: "var(--accent)", color: "#000" }}
    >
      {pending ? "Saving…" : "Save"}
    </button>
  );
}

interface ProfilePanelProps {
  heightCm: number | null;
  goalWeight: number | null;
}

export function ProfilePanel({ heightCm, goalWeight }: ProfilePanelProps) {
  const [open, setOpen] = useState(!heightCm && !goalWeight);

  return (
    <section className="mb-6">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between rounded-2xl border px-4 py-3 transition-all"
        style={{
          background: "var(--glass-bg)",
          borderColor: "var(--glass-border)",
        }}
      >
        <div className="flex items-center gap-2">
          <Settings size={14} style={{ color: "var(--muted)" }} />
          <span className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
            Profile settings
          </span>
          {(!heightCm || !goalWeight) && (
            <span
              className="rounded-full px-2 py-0.5 text-xs"
              style={{ background: "rgba(163,230,53,0.12)", color: "var(--accent)" }}
            >
              incomplete
            </span>
          )}
        </div>
        {open ? (
          <ChevronUp size={14} style={{ color: "var(--muted)" }} />
        ) : (
          <ChevronDown size={14} style={{ color: "var(--muted)" }} />
        )}
      </button>

      {open && (
        <div
          className="rounded-b-2xl border border-t-0 px-4 pb-4 pt-3"
          style={{
            background: "var(--glass-bg)",
            borderColor: "var(--glass-border)",
          }}
        >
          <form action={updateProfile} className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="height_cm"
                  className="text-xs font-medium uppercase tracking-widest"
                  style={{ color: "var(--muted)" }}
                >
                  Height (cm)
                </label>
                <input
                  id="height_cm"
                  name="height_cm"
                  type="number"
                  step="0.1"
                  min="50"
                  max="300"
                  defaultValue={heightCm ?? ""}
                  placeholder="e.g. 175"
                  className="login-input rounded-xl border px-3 py-2.5 text-sm outline-none"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    borderColor: "var(--glass-border)",
                    color: "var(--foreground)",
                  }}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="goal_weight"
                  className="text-xs font-medium uppercase tracking-widest"
                  style={{ color: "var(--muted)" }}
                >
                  Goal weight (kg)
                </label>
                <input
                  id="goal_weight"
                  name="goal_weight"
                  type="number"
                  step="0.1"
                  min="20"
                  max="999"
                  defaultValue={goalWeight ?? ""}
                  placeholder="e.g. 70"
                  className="login-input rounded-xl border px-3 py-2.5 text-sm outline-none"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    borderColor: "var(--glass-border)",
                    color: "var(--foreground)",
                  }}
                />
              </div>
            </div>

            <div className="flex justify-end">
              <SaveButton />
            </div>
          </form>
        </div>
      )}
    </section>
  );
}
