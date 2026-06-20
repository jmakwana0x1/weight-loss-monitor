import { GoogleSignInButton } from "./login-form";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4">
      <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
        <div
          className="absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full blur-3xl opacity-20"
          style={{ background: "var(--accent)" }}
        />
        <div
          className="absolute bottom-0 right-0 h-72 w-72 rounded-full blur-3xl opacity-10"
          style={{ background: "var(--accent)" }}
        />
      </div>

      <div
        className="relative w-full max-w-sm rounded-2xl border p-8 shadow-2xl"
        style={{
          background: "var(--glass-bg)",
          borderColor: "var(--glass-border)",
          backdropFilter: "blur(20px)",
        }}
      >
        <div className="mb-8 text-center">
          <span
            className="text-2xl font-bold tracking-tight"
            style={{ color: "var(--accent)" }}
          >
            Weight Loss Monitor
          </span>
          <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
            Track your journey, one weigh-in at a time.
          </p>
        </div>

        <GoogleSignInButton error={error} />
      </div>
    </main>
  );
}
