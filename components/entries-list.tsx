"use client";

import { useTransition } from "react";
import { Trash2, Download } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { deleteEntry } from "@/app/actions";
import type { WeightEntry } from "@/types/database";

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric", month: "short", year: "numeric",
  }).format(new Date(iso));
}

function DeltaBadge({ delta }: { delta: number }) {
  const loss = delta < 0;
  const color = loss ? "#22c55e" : "#ef4444";
  const bg = loss ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)";
  return (
    <span
      className="rounded-lg px-2 py-0.5 text-xs font-mono font-semibold tabular-nums"
      style={{ background: bg, color }}
    >
      {delta > 0 ? "+" : ""}
      {delta.toFixed(1)}
    </span>
  );
}

function EntryRow({ entry, delta, index }: { entry: WeightEntry; delta: number | null; index: number }) {
  const [pending, startTransition] = useTransition();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: pending ? 0.35 : 1, x: 0 }}
      exit={{ opacity: 0, height: 0, marginBottom: 0, paddingTop: 0, paddingBottom: 0 }}
      transition={{ duration: 0.28, delay: index * 0.04, ease: "easeOut" }}
      className="flex items-center gap-3 rounded-2xl border px-4 py-3"
      style={{ background: "var(--glass-bg)", borderColor: "var(--glass-border)" }}
    >
      <div className="flex-1">
        <p className="text-sm" style={{ color: "var(--foreground)" }}>
          {formatDate(entry.logged_at)}
        </p>
        {entry.note && (
          <p className="mt-0.5 text-xs truncate" style={{ color: "var(--muted)" }}>
            {entry.note}
          </p>
        )}
      </div>

      <span className="font-mono text-xl font-bold tabular-nums" style={{ color: "var(--foreground)" }}>
        {entry.weight.toFixed(1)}
        <span className="ml-1 text-xs font-normal" style={{ color: "var(--muted)" }}>kg</span>
      </span>

      <div className="w-14 text-right">
        {delta !== null && <DeltaBadge delta={delta} />}
      </div>

      <button
        onClick={() => startTransition(() => deleteEntry(entry.id))}
        disabled={pending}
        className="ml-1 rounded-lg p-1.5 transition-all active:scale-90"
        style={{ color: "var(--muted)" }}
        aria-label="Delete entry"
      >
        <Trash2 size={14} />
      </button>
    </motion.div>
  );
}

export function EntriesList({ entries }: { entries: WeightEntry[] }) {
  if (entries.length === 0) {
    return (
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-center text-sm py-8"
        style={{ color: "var(--muted)" }}
      >
        No entries yet — log your first weight above.
      </motion.p>
    );
  }

  return (
    <section className="flex flex-col gap-2">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-medium uppercase tracking-widest" style={{ color: "var(--muted)" }}>
          History
        </p>
        <a
          href="/api/export"
          className="flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs transition-all active:scale-95"
          style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)", color: "var(--muted)" }}
        >
          <Download size={12} />
          Export CSV
        </a>
      </div>
      <AnimatePresence initial={false}>
        {entries.map((entry, i) => {
          const prev = entries[i + 1];
          const delta = prev ? entry.weight - prev.weight : null;
          return <EntryRow key={entry.id} entry={entry} delta={delta} index={i} />;
        })}
      </AnimatePresence>
    </section>
  );
}
