"use client";

import { useState, useRef } from "react";
import { useFormStatus } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Pencil } from "lucide-react";
import { logWeight } from "@/app/actions";

const MON = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

type Toast = { icon: string; text: string; win: boolean };

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <motion.button
      type="submit"
      disabled={pending}
      whileTap={{ scale: 0.97 }}
      className="font-mono font-extrabold tracking-wide disabled:opacity-60"
      style={{
        flex: 1,
        height: 48,
        borderRadius: 9,
        background: "var(--accent)",
        color: "#0b0d09",
        fontSize: 15,
        letterSpacing: ".06em",
        boxShadow: "0 8px 24px var(--accent-soft)",
      }}
    >
      {pending ? "SAVING…" : "LOG WEIGH-IN"}
    </motion.button>
  );
}

function Confetti() {
  const colors = ["var(--accent)", "#FFB23E", "#FF5B45", "#F3F5EC", "var(--accent-deep)"];
  const pieces = Array.from({ length: 30 }, (_, i) => {
    const dx = (Math.random() - 0.5) * 240;
    return (
      <span
        key={i}
        style={{
          position: "absolute",
          top: 0,
          left: `${12 + Math.random() * 76}%`,
          width: 5 + Math.random() * 6,
          height: 9 + Math.random() * 12,
          background: colors[i % colors.length],
          borderRadius: 1,
          ["--dx" as string]: `${dx}px`,
          ["--rot" as string]: `${Math.random() * 720 - 360}deg`,
          animation: "confettiFall 1.4s cubic-bezier(.2,.6,.3,1) forwards",
          animationDelay: `${Math.random() * 140}ms`,
        }}
      />
    );
  });
  return (
    <div
      className="pointer-events-none fixed left-1/2 -translate-x-1/2 z-[80]"
      style={{ top: 120, width: 430, maxWidth: "100%", height: 0 }}
    >
      {pieces}
    </div>
  );
}

export function QuickLog({
  lastWeight,
  goalWeight,
  minWeight,
}: {
  lastWeight?: number;
  goalWeight?: number | null;
  minWeight?: number | null;
}) {
  const initial = lastWeight ? lastWeight.toFixed(1) : "70.0";
  const [weight, setWeight] = useState(initial);
  const [noteOpen, setNoteOpen] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);
  const [confetti, setConfetti] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const today = new Date();
  const todayLabel = `${MON[today.getMonth()]} ${today.getDate()}`;

  const adjust = (delta: number) => {
    setWeight((prev) => {
      const next = Math.max(20, Math.min(999, parseFloat(prev || "0") + delta));
      return next.toFixed(1);
    });
  };

  const handleAction = async (formData: FormData) => {
    const v = parseFloat(formData.get("weight") as string);
    await logWeight(formData);
    setWeight(v.toFixed(1));
    setNoteOpen(false);

    let next: Toast = { icon: "✓", text: "WEIGH-IN LOGGED", win: false };
    let celebrate = false;
    if (goalWeight != null && v <= goalWeight) {
      next = { icon: "◎", text: "GOAL REACHED", win: true };
      celebrate = true;
    } else if (minWeight != null && v < minWeight) {
      next = { icon: "▼", text: `NEW LOW · ${v.toFixed(1)} KG`, win: true };
      celebrate = true;
    }
    setToast(next);
    if (celebrate) {
      setConfetti(true);
      setTimeout(() => setConfetti(false), 1700);
    }
    setTimeout(() => setToast(null), 2600);
  };

  return (
    <motion.section
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="relative overflow-hidden mb-2.5"
      style={{
        background: "linear-gradient(180deg,#15180f,#101309)",
        border: "1px solid #2b3122",
        borderRadius: 14,
        padding: "18px 18px 20px",
      }}
    >
      <div
        className="pointer-events-none absolute"
        style={{
          right: -30,
          top: -40,
          width: 160,
          height: 160,
          background: "radial-gradient(circle, var(--accent-soft), transparent 70%)",
        }}
      />

      <div className="relative flex items-center justify-between">
        <span className="font-mono" style={{ fontSize: 10, letterSpacing: ".18em", color: "var(--accent)" }}>
          LOG TODAY
        </span>
        <span className="font-mono" style={{ fontSize: 10, letterSpacing: ".1em", color: "var(--muted-2)" }}>
          {todayLabel}
        </span>
      </div>

      <form action={handleAction}>
        <div className="flex items-center justify-center gap-3.5" style={{ marginTop: 8 }}>
          <motion.button
            type="button"
            onClick={() => adjust(-0.1)}
            whileTap={{ scale: 0.88 }}
            aria-label="Decrease"
            className="flex items-center justify-center rounded-full"
            style={{ width: 44, height: 44, flex: "none", border: "1px solid #2b3122", fontSize: 26, color: "var(--muted)" }}
          >
            −
          </motion.button>

          <div className="flex items-end gap-1.5">
            <input
              ref={inputRef}
              name="weight"
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              step="0.1"
              min="20"
              max="999"
              className="bg-transparent text-center font-black outline-none tabular-nums"
              style={{ width: 170, fontSize: 66, letterSpacing: "-.05em", lineHeight: 1, color: "var(--foreground)" }}
            />
            <span className="font-mono" style={{ fontSize: 14, color: "var(--muted-2)", marginBottom: 14 }}>
              kg
            </span>
          </div>

          <motion.button
            type="button"
            onClick={() => adjust(0.1)}
            whileTap={{ scale: 0.88 }}
            aria-label="Increase"
            className="flex items-center justify-center rounded-full"
            style={{ width: 44, height: 44, flex: "none", border: "1px solid #2b3122", fontSize: 24, color: "var(--muted)" }}
          >
            +
          </motion.button>
        </div>

        <AnimatePresence>
          {noteOpen && (
            <motion.input
              key="note"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              name="note"
              type="text"
              placeholder="add a note…"
              maxLength={200}
              autoFocus
              className="w-full outline-none"
              style={{
                marginTop: 4,
                background: "#0d100a",
                border: "1px solid var(--border)",
                borderRadius: 8,
                padding: "10px 12px",
                color: "var(--foreground)",
                fontSize: 13,
              }}
            />
          )}
        </AnimatePresence>
        {!noteOpen && <input type="hidden" name="note" value="" />}

        <div className="flex gap-2.5" style={{ marginTop: 14 }}>
          <SaveButton />
          <motion.button
            type="button"
            onClick={() => setNoteOpen((o) => !o)}
            whileTap={{ scale: 0.92 }}
            aria-label="Toggle note"
            className="flex items-center justify-center"
            style={{ width: 48, height: 48, flex: "none", border: "1px solid #2b3122", borderRadius: 9, color: "var(--muted)" }}
          >
            <Pencil size={18} />
          </motion.button>
        </div>
      </form>

      {confetti && <Confetti />}

      <AnimatePresence>
        {toast && (
          <div
            className="fixed left-1/2 z-[90] flex items-center gap-2.5 font-mono font-bold"
            style={{
              bottom: 28,
              fontSize: 12,
              letterSpacing: ".08em",
              padding: "11px 18px",
              borderRadius: 999,
              background: toast.win ? "var(--accent)" : "#1a1e14",
              border: `1px solid ${toast.win ? "var(--accent)" : "#313829"}`,
              color: toast.win ? "#0b0d09" : "var(--foreground)",
              animation: "toastIn 2.6s ease forwards",
              boxShadow: "0 12px 36px rgba(0,0,0,.5)",
            }}
          >
            <span>{toast.icon}</span>
            {toast.text}
          </div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
