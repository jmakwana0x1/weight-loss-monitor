import { GoogleSignInButton } from "./login-form";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main style={{ width: 430, maxWidth: "100%", margin: "0 auto", padding: "0 18px", minHeight: "100vh" }}>
      <div
        className="relative flex flex-col justify-center"
        style={{ minHeight: "100vh", animation: "rise .5s ease both" }}
      >
        {/* giant watermark */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div
            className="font-black select-none"
            style={{ fontSize: 300, lineHeight: 1, color: "rgba(255,255,255,0.018)", letterSpacing: "-.06em" }}
          >
            88
          </div>
        </div>

        <div className="relative">
          <div className="font-mono" style={{ fontSize: 10, letterSpacing: ".34em", color: "var(--muted-2)", marginBottom: 18 }}>
            PERSONAL MASS INSTRUMENT
          </div>
          <div className="flex items-end gap-2.5">
            <span className="font-black" style={{ fontSize: 96, lineHeight: 0.82, letterSpacing: "-.05em" }}>TARE</span>
            <span style={{ width: 13, height: 13, background: "var(--accent)", marginBottom: 14, boxShadow: "0 0 22px var(--accent-soft)" }} />
          </div>
          <p className="font-medium" style={{ fontSize: 17, color: "var(--muted)", marginTop: 18, maxWidth: 300, lineHeight: 1.35 }}>
            Track the <span style={{ color: "var(--accent)" }}>trend</span>, not the noise. Weigh in once a day — we draw the line.
          </p>

          <div style={{ marginTop: 46 }}>
            <GoogleSignInButton error={error} />
          </div>
        </div>

        <div
          className="absolute font-mono"
          style={{ bottom: 38, left: 0, fontSize: 10, letterSpacing: ".14em", color: "#3a4035" }}
        >
          SECURE · GOOGLE OAUTH · NO PASSWORDS
        </div>
      </div>
    </main>
  );
}
