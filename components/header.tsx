import { signOut } from "@/app/login/actions";
import { LogOut, Settings } from "lucide-react";
import Link from "next/link";

export function Header({ email }: { email: string }) {
  return (
    <header className="flex items-center justify-between mb-8">
      <span
        className="text-lg font-bold tracking-tight"
        style={{ color: "var(--accent)" }}
      >
        Weight Loss Monitor
      </span>
      <div className="flex items-center gap-2">
        <Link
          href="/profile"
          aria-label="Profile settings"
          className="flex items-center justify-center rounded-xl p-1.5 transition-all active:scale-95"
          style={{
            background: "var(--glass-bg)",
            border: "1px solid var(--glass-border)",
            color: "var(--muted)",
          }}
        >
          <Settings size={13} />
        </Link>
        <form action={signOut}>
          <button
            type="submit"
            className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs transition-all active:scale-95"
            style={{
              background: "var(--glass-bg)",
              border: "1px solid var(--glass-border)",
              color: "var(--muted)",
            }}
          >
            <LogOut size={13} />
            Sign out
          </button>
        </form>
      </div>
    </header>
  );
}
