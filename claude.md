# Project: Weight Monitoring App

## What we're building
A personal weight tracking web app. Users log their weight over time and see
trends, projections, and progress toward a goal. It must look premium and feel
alive — not like a scaffolded SaaS template.

## Stack (non-negotiable unless I say otherwise)
- Next.js (App Router) + TypeScript
- Tailwind CSS
- Supabase (Postgres + Auth + Realtime + Storage) — free tier only
- Recharts for charts
- Framer Motion for animation
- shadcn/ui for base components, Lucide for icons
- Deploy target: Vercel free tier

## Design philosophy
Commit hard to ONE aesthetic: dark glassmorphism. Deep near-black background,
frosted glass cards, a single electric accent color (default: lime/cyan — make
it a CSS variable so it's swappable). No mixing styles. Restraint over clutter.

Core principles:
- The chart is the hero. It should look expensive.
- Numbers feel alive: big hero figures, count-up animations, color-coded deltas,
  tabular/mono font so digits don't jiggle.
- Micro-interactions everywhere: spring physics on tap, satisfying log toasts,
  skeleton loaders (never spinners), milestone celebrations.
- Generous whitespace, consistent radius (rounded-2xl), 4/8px spacing rhythm.
- Dark mode is the default and must look intentional, not inverted.
- Respect prefers-reduced-motion — degrade animations gracefully.

## Chart requirements specifically
- 7-day moving average as the bold line; raw daily entries as faint dots behind.
- Gradient fill under the line fading to transparent.
- Smooth monotone curve, not jagged segments.
- Dashed goal line with a small flag label.
- Animated draw-in on load.
- Tap/hover scrubber with a floating tooltip showing weight + delta from prev.

## Data model
- profiles: id (fk auth.users), height_cm, goal_weight, unit_pref, accent_color
- weight_entries: id, user_id (fk), weight, logged_at, note, body_fat (nullable)
- Row Level Security ON — every user only ever sees their own rows.
  Always write RLS policies alongside any new table.

## Features (build in this order)
1. Auth (Supabase email magic link) + protected routes
2. Schema + RLS policies
3. Quick-log flow (big number input, one-tap save) + entries list
4. Hero chart (moving average + goal line per spec above)
5. Stats bento grid: current weight, weekly rate, BMI, streak, days-to-goal
6. Insights: linear regression projection — "on pace to hit goal by <date>"
7. Polish pass: streak flame, milestone confetti, dark-mode glass, animations
8. CSV export/import
9. Deploy to Vercel

## Engineering rules
- TypeScript strict. No `any` unless justified in a comment.
- Keep secrets in env vars; never hardcode Supabase keys. Use the anon key
  client-side, service role only in server code.
- Prefer Server Components; use Client Components only where interactivity needs it.
- Small, composable components. Co-locate, don't build a monolith page.
- Validate user input before writing to the DB.
- Stay within Supabase free-tier limits — no design that assumes paid features.

## How to work with me
- Be direct, no hedging. If an approach is bad, say so and propose better.
- Show the schema/RLS before generating dependent code.
- Build incrementally and keep the app runnable at each step.
- When a design choice is ambiguous, pick the option that looks more premium
  and tell me what you chose.