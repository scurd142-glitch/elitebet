# NiteBet

Kenya's ultimate betting platform — crash games, sports betting, and casino entertainment.

**Owner:** SCURDTECHS PRODUCTION LIMITED (United States of America)

## Repository layout

| Path | Purpose |
|------|---------|
| `frontend/` | Next.js (App Router) + React + TypeScript + Tailwind CSS |
| `backend/` | Node.js + Express + TypeScript + Prisma |
| `shared/` | Shared constants and cross-cutting types (`@nitebet/shared`) |
| `docs/` | Architecture notes and deployment guides |

## Prerequisites

- Node.js **20+** (LTS recommended; CI uses 22 for Docker images)
- npm **10+**
- PostgreSQL **16+** (local or [Neon](https://neon.tech))

## Phase 1 — quick start (local)

### 1. Install dependencies

From the repository root:

```bash
npm install
```

This links workspaces and builds `@nitebet/shared` via `postinstall`.

### 2. Start PostgreSQL (optional)

```bash
docker compose up -d postgres
```

### 3. Backend environment

```bash
copy backend\.env.example backend\.env
```

On macOS/Linux use `cp`. Set `DATABASE_URL` to your PostgreSQL connection string.

### 4. Database schema

```bash
cd backend
npx prisma migrate dev --name init
npm run db:seed
```

### 5. Run services

**API (terminal 1):**

```bash
npm run dev:backend
```

**Web (terminal 2):**

```bash
npm run dev:frontend
```

- Frontend: `http://localhost:3000`
- API health: `http://localhost:4000/health`
- API DB health: `http://localhost:4000/health/db`

### Seeded admin (development only)

After `db:seed`, an administrator exists for local testing:

- Email: `admin@nitebet.local`
- Password: `ChangeMeInProduction!1`

**Rotate or remove this account before any production deployment.**

## NPM scripts (root)

| Script | Description |
|--------|-------------|
| `npm run dev:frontend` | Next.js dev server |
| `npm run dev:backend` | Express API with hot reload (`tsx`) |
| `npm run build:frontend` | Production build of the web app |
| `npm run build:backend` | Compile API to `backend/dist` |
| `npm run db:generate` | `prisma generate` |
| `npm run db:migrate` | `prisma migrate dev` |
| `npm run db:push` | `prisma db push` (prototyping only) |
| `npm run db:seed` | Seed roles, FAQs, admin user, sample job |

## Docker (API image)

From the repository root:

```bash
docker build -f backend/Dockerfile -t nitebet-api:local .
```

Run with `DATABASE_URL` and `PORT` supplied at runtime (see `docs/DEPLOYMENT.md`).

## Documentation

- `DEPLOYMENT_GUIDE.md` — Complete deployment guide for production
- `docs/ARCHITECTURE_PHASE1.md` — Phase 1 architecture
- `docs/DEPLOYMENT.md` — Original deployment overview
- `docs/GIT-GITHUB.md` — Git and GitHub setup

## Roadmap (phases)

1. **Phase 1** — Monorepo, Prisma schema, API skeleton, Docker, docs *(this deliverable)*  
2. **Phase 2** — Auth (JWT, refresh, OTP), registration, login  
3. **Phase 3** — Payments, Paystack, activation  
4. **Phase 4** — Sports betting integration  
5. **Phase 5** — User dashboard UI  
6. **Phase 6** — Admin panel  
7. **Phase 7** — Notifications, referrals, wallet rules  
8. **Phase 8** — Security hardening, performance, production cutover  

---

© SCURDTECHS PRODUCTION LIMITED. All rights reserved.
