"use client";

import { useState, useRef } from "react";
import { useFormStatus } from "react-dom";
import { logWeight } from "@/app/actions";

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-2xl py-4 text-base font-bold tracking-wide transition-all active:scale-95 disabled:opacity-50"
      style={{ background: "var(--accent)", color: "#000" }}
    >
      {pending ? "Saving…" : "Log weight"}
    </button>
  );
}

export function QuickLog({ lastWeight }: { lastWeight?: number }) {
  const initial = lastWeight ? lastWeight.toFixed(1) : "70.0";
  const [weight, setWeight] = useState(initial);
  const inputRef = useRef<HTMLInputElement>(null);

  const adjust = (delta: number) => {
    setWeight((prev) => {
      const next = Math.max(20, Math.min(999, parseFloat(prev) + delta));
      return next.toFixed(1);
    });
  };

  const handleAction = async (formData: FormData) => {
    await logWeight(formData);
    // reset to logged value after save
    setWeight(parseFloat(formData.get("weight") as string).toFixed(1));
  };

  return (
    <section
      className="rounded-2xl border p-6 mb-6"
      style={{
        background: "var(--glass-bg)",
        borderColor: "var(--glass-border)",
        backdropFilter: "blur(20px)",
      }}
    >
      <p
        className="text-xs font-medium uppercase tracking-widest mb-6"
        style={{ color: "var(--muted)" }}
      >
        Log today&apos;s weight
      </p>

      <form action={handleAction} className="flex flex-col gap-5">
        {/* big number stepper */}
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => adjust(-0.1)}
            className="flex h-14 w-14 items-center justify-center rounded-2xl text-2xl font-light transition-all active:scale-90"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid var(--glass-border)",
              color: "var(--foreground)",
            }}
          >
            −
          </button>

          <div className="flex flex-1 flex-col items-center">
            <input
              ref={inputRef}
              name="weight"
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              step="0.1"
              min="20"
              max="999"
              className="w-full bg-transparent text-center text-6xl font-mono font-bold outline-none tabular-nums"
              style={{ color: "var(--foreground)" }}
            />
            <span
              className="text-sm font-medium mt-1"
              style={{ color: "var(--muted)" }}
            >
              kg
            </span>
          </div>

          <button
            type="button"
            onClick={() => adjust(0.1)}
            className="flex h-14 w-14 items-center justify-center rounded-2xl text-2xl font-light transition-all active:scale-90"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid var(--glass-border)",
              color: "var(--foreground)",
            }}
          >
            +
          </button>
        </div>

        {/* optional note */}
        <input
          name="note"
          type="text"
          placeholder="Note (optional)"
          maxLength={200}
          className="login-input rounded-xl border px-4 py-3 text-sm outline-none transition-all"
          style={{
            background: "rgba(255,255,255,0.03)",
            borderColor: "var(--glass-border)",
            color: "var(--foreground)",
          }}
        />

        <SaveButton />
      </form>
    </section>
  );
}
