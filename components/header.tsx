import { signOut } from "@/app/login/actions";
import { LogOut } from "lucide-react";
import Link from "next/link";

function initials(email: string) {
  const name = email.split("@")[0] ?? "";
  const parts = name.split(/[._-]+/).filter(Boolean);
  const letters = parts.length >= 2 ? parts[0][0] + parts[1][0] : name.slice(0, 2);
  return letters.toUpperCase() || "··";
}

export function Header({ email }: { email: string }) {
  return (
    <header className="flex items-center justify-between" style={{ padding: "2px 0 18px" }}>
      <div className="flex items-center gap-2">
        <span className="font-black tracking-tight" style={{ fontSize: 24, letterSpacing: "-.04em" }}>
          TARE
        </span>
        <span
          style={{ width: 8, height: 8, background: "var(--accent)", boxShadow: "0 0 12px var(--accent-soft)" }}
        />
      </div>

      <div className="flex items-center gap-2">
        <Link
          href="/profile"
          aria-label="Profile settings"
          className="flex items-center gap-2 rounded-full transition-all active:scale-95"
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            padding: "5px 6px 5px 5px",
          }}
        >
          <span
            className="flex items-center justify-center rounded-full font-extrabold"
            style={{ width: 26, height: 26, background: "var(--accent)", color: "#0b0d09", fontSize: 12 }}
          >
            {initials(email)}
          </span>
          <span
            className="font-mono"
            style={{ fontSize: 10, color: "var(--muted)", letterSpacing: ".04em", marginRight: 6 }}
          >
            {email}
          </span>
        </Link>

        <form action={signOut}>
          <button
            type="submit"
            aria-label="Sign out"
            className="flex items-center justify-center rounded-full transition-all active:scale-95"
            style={{
              width: 36,
              height: 36,
              background: "var(--surface)",
              border: "1px solid var(--border)",
              color: "var(--muted)",
            }}
          >
            <LogOut size={14} />
          </button>
        </form>
      </div>
    </header>
  );
}
