# Sales Command Center

A calm, secure, lightweight sales CRM and personal work operating system for an
ocean-freight / logistics sales role. It is a **personal work command center**,
not a bloated enterprise CRM — built for clarity, speed, and daily usability.

> Internal nickname: _"Ashley's Spreadsheet."_ App title in-product: **Sales Command Center**.

---

## What's inside

**Twelve pages**

Dashboard · Daily Planner · Customer Issues · Prospect Pipeline · Customer Master
List · Market Intelligence · Opportunity Tracker · Meeting & Visit Log · Weekly
Priorities · Reporting Portal · PDF Exports · Settings.

**Highlights**

- Secure login (single fixed user), protected routes, HTTP-only session cookies.
- Seven config-driven CRUD tables with search, filters, sorting, pagination,
  overdue / high-priority / CRM-not-updated row highlighting, and empty states.
- Dashboard with editable Top 3, a live-computed Daily Scorecard, work blocks,
  and "Urgent" / "Waiting On" snapshots.
- Customer Master List with a connected-records drawer (issues, meetings,
  opportunities, and market impact matched by customer name).
- Reporting Portal with Today / Week / Month / Custom ranges and a Weekly
  Executive Summary.
- Branded, private, client-side PDF export for every table and report.
- Settings: change password, export/import JSON backup, delete all data,
  dark mode, compact tables.

---

## Tech stack

- **Next.js 16** (App Router) · **React 19** · **TypeScript**
- **Tailwind CSS v4** (CSS-based theming) — hand-rolled components, no heavy UI lib
- **Prisma 6** ORM → **PostgreSQL** (Vercel Postgres in production)
- **Auth.js (NextAuth v5)** Credentials provider · **bcryptjs** password hashing
- **Zod** validation (shared client + server) · **React Hook Form**
- **jsPDF** + **jspdf-autotable** for private, in-browser PDF generation
- **Vitest** + **React Testing Library**

---

## Local setup

```bash
npm install
cp .env.example .env        # then edit values (see below)
npx prisma generate
npx prisma db push          # create tables (or `prisma migrate dev` for migrations)
npm run db:seed             # seed the fixed user + realistic demo data
npm run dev                 # http://localhost:3000
```

Log in with the `AUTH_USERNAME` / `AUTH_PASSWORD` you set in `.env`
(defaults: `ashley` / `command2026`).

### Environment variables

| Variable        | Purpose                                                        |
| --------------- | -------------------------------------------------------------- |
| `DATABASE_URL`  | PostgreSQL connection string                                   |
| `AUTH_SECRET`   | Auth.js session secret — `openssl rand -base64 32`             |
| `AUTH_USERNAME` | Fixed login username (hashed into the User row on seed)        |
| `AUTH_PASSWORD` | Fixed login password (hashed with bcrypt on seed)              |
| `APP_URL`       | Public app URL (Auth.js callbacks in production)               |

`.env` is git-ignored. Never commit secrets. Password changes made in **Settings**
update the hashed password stored in the database.

---

## Scripts

```bash
npm run dev        # start dev server
npm run build      # prisma generate + next build (must pass before shipping)
npm run start      # run the production build
npm run lint       # ESLint
npm run test       # Vitest (unit + component)
npm run db:push    # push schema to the database
npm run db:seed    # seed user + demo data
npm run db:studio  # open Prisma Studio
```

---

## Database

Prisma models: `User`, `DailyPlan`, `CustomerIssue`, `Prospect`, `Customer`,
`MarketIntelligence`, `Opportunity`, `MeetingLog`, `WeeklyPriority`,
`MarketTheme`, `ReportExportLog`. Every business record carries `id`, `userId`,
`createdAt`, `updatedAt`.

- **Prototype / quick start:** `npx prisma db push`
- **Tracked migrations:** `npx prisma migrate dev --name init`
- **Reseed:** `npm run db:seed` (clears and re-inserts this user's demo data)

---

## Deploying to Vercel

1. Push this repo to GitHub and import it into Vercel.
2. Create a **Vercel Postgres** database (Storage tab) — it injects a
   `DATABASE_URL`. Copy the **Prisma / pooled** connection string.
3. Add environment variables in Vercel: `DATABASE_URL`, `AUTH_SECRET`,
   `AUTH_USERNAME`, `AUTH_PASSWORD`, `APP_URL` (your production URL).
4. Apply the schema against the production DB, then seed the single user:
   ```bash
   DATABASE_URL="<vercel-postgres-url>" npx prisma migrate deploy   # or db push
   DATABASE_URL="<vercel-postgres-url>" AUTH_USERNAME=... AUTH_PASSWORD=... npm run db:seed
   ```
   `postinstall` runs `prisma generate` automatically during the Vercel build.
5. Deploy. Log in with your credentials.

---

## Security notes

- Passwords are **bcrypt-hashed** (cost 12) and never stored in plaintext.
- All data access is **server-side** (Server Actions + Server Components); the
  database URL is never exposed to the client.
- Every route under `(app)` is protected by proxy/middleware **and** a
  server-side `requireUserId()` check (defence in depth).
- All writes are validated with **Zod on the server** before touching the DB,
  and scoped by `userId` so records can only be edited by their owner.
- **PDFs are generated entirely in the browser** — no CRM/customer data is ever
  sent to a third-party service.
- Sessions use HTTP-only cookies; CSRF is handled by Auth.js.

---

## Future enhancements (structured for, not yet built)

Outlook / Microsoft Graph sync · calendar integration · AI email drafting · AI
market-announcement parsing · multi-user teams & role-based access · file
attachments · reminders/notifications · CSV/Excel export · scheduled weekly PDF
reports · mobile layout.

The single-user model is already keyed by `userId`, so multi-user support is an
additive change rather than a rewrite.
