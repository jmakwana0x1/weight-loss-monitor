"use client";

import { useState, useRef } from "react";
import { useFormStatus } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { logWeight } from "@/app/actions";

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <motion.button
      type="submit"
      disabled={pending}
      whileTap={{ scale: 0.97 }}
      className="w-full rounded-2xl py-4 text-base font-bold tracking-wide transition-colors disabled:opacity-50"
      style={{ background: "var(--accent)", color: "#000" }}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={pending ? "saving" : "log"}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.15 }}
          className="block"
        >
          {pending ? "Saving…" : "Log weight"}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
}

export function QuickLog({ lastWeight }: { lastWeight?: number }) {
  const initial = lastWeight ? lastWeight.toFixed(1) : "70.0";
  const [weight, setWeight] = useState(initial);
  const [saved, setSaved] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const adjust = (delta: number) => {
    setWeight((prev) => {
      const next = Math.max(20, Math.min(999, parseFloat(prev) + delta));
      return next.toFixed(1);
    });
  };

  const handleAction = async (formData: FormData) => {
    await logWeight(formData);
    setWeight(parseFloat(formData.get("weight") as string).toFixed(1));
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  return (
    <motion.section
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="rounded-2xl border p-6 mb-6"
      style={{
        background: "var(--glass-bg)",
        borderColor: "var(--glass-border)",
        backdropFilter: "blur(20px)",
      }}
    >
      <div className="flex items-center justify-between mb-6">
        <p className="text-xs font-medium uppercase tracking-widest" style={{ color: "var(--muted)" }}>
          Log today&apos;s weight
        </p>
        <AnimatePresence>
          {saved && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              className="text-xs font-medium"
              style={{ color: "#22c55e" }}
            >
              ✓ Saved
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      <form action={handleAction} className="flex flex-col gap-5">
        <div className="flex items-center justify-between gap-3">
          <motion.button
            type="button"
            onClick={() => adjust(-0.1)}
            whileTap={{ scale: 0.88 }}
            className="flex h-14 w-14 items-center justify-center rounded-2xl text-2xl font-light"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid var(--glass-border)",
              color: "var(--foreground)",
            }}
          >
            −
          </motion.button>

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
            <span className="text-sm font-medium mt-1" style={{ color: "var(--muted)" }}>
              kg
            </span>
          </div>

          <motion.button
            type="button"
            onClick={() => adjust(0.1)}
            whileTap={{ scale: 0.88 }}
            className="flex h-14 w-14 items-center justify-center rounded-2xl text-2xl font-light"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid var(--glass-border)",
              color: "var(--foreground)",
            }}
          >
            +
          </motion.button>
        </div>

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
    </motion.section>
  );
}
