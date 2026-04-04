# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

GCMS (Greenville Chamber Music Society) is a monorepo with two independent applications:

- **symphony-portal/** — Next.js 15 frontend for concert listings, ticket sales, musician/student portals
- **gcms-data-platform/** — ELT data pipeline (Supabase → Snowflake) with dbt transformations, Airflow orchestration, and Streamlit dashboards

There is no monorepo tooling (no nx/turborepo/lerna). Each application is managed independently.

## Common Commands

### Symphony Portal (Next.js)

```bash
cd symphony-portal
npm install
npm run dev          # Start dev server (http://localhost:3000)
npm run build        # Production build (static export for GitHub Pages)
npm run lint         # ESLint
```

Requires `.env.local` with Supabase, Stripe, and NextAuth credentials.

Production builds output static HTML to `out/` with basePath `/GCMS` for GitHub Pages subdirectory hosting (`rsgdata.github.io/GCMS`).

### Data Platform (dbt / Airflow)

```bash
cd gcms-data-platform/dbt
dbt run                          # Run all models
dbt run --select bronze          # Run bronze layer only
dbt run --select silver          # Run silver layer only
dbt run --select gold            # Run gold layer only
dbt run --select model_name      # Run a single model
dbt test                         # Run all data tests
dbt test --select model_name     # Test a single model
dbt compile                      # Compile SQL without executing
```

Infrastructure runs via Docker Compose:
```bash
cd gcms-data-platform
docker-compose up -d             # Start Airflow + Airbyte + supporting services
```

## Architecture

### Symphony Portal

- **App Router** (Next.js 15) with static export — no server-side rendering in production
- **Centralized data files**: `src/lib/concertData.ts` and `src/lib/soloistData.ts` are the source of truth for concert/soloist content. Most concert pages are generated from these via `concertPageMaker.tsx` and `soloistBioPageMaker.tsx`
- **Image paths**: `src/lib/imagePath.ts` handles basePath prefixing (`/GCMS` in production) — use `getImagePath()` for all image references
- **Navigation**: Centralized in `src/lib/navigationConfig.ts`, consumed by `Navigation.tsx` and `Footer.tsx`
- **Auth**: Musician auth uses localStorage-based sessions (`src/lib/auth.ts`), not NextAuth (NextAuth is configured but musician portal uses its own system)
- **Payments**: Stripe integration via `/api/create-payment-intent` and `/api/webhooks/stripe`
- **UI components**: Radix UI primitives + Tailwind CSS 4 + `class-variance-authority`

### Data Platform — Symphony-Themed Layers

The dbt transformation follows a medallion architecture with symphony-themed Snowflake schemas:

| Layer | Schema | Purpose | Materialization |
|-------|--------|---------|-----------------|
| Bronze | MOVEMENT_II | Raw Supabase mirrors + SCD2 history | table / incremental |
| Silver | MOVEMENT_III | Staging (clean) + Intermediate (business rules) | view |
| Gold | FINALE | Facts + Dimensions for analytics | table |

Raw ingestion lands in MOVEMENT_I (managed by Airbyte, not dbt).

**Core principle**: "History is sacred. State is derived." — SCD Type 2 with bi-temporal tracking. Historical records are never overwritten.

**Pipeline flow**: Supabase → Airbyte → Snowflake (MOVEMENT_I) → dbt Bronze → Silver → Gold

**Orchestration**: Airflow DAGs in `airflow/dags/`, primary pipeline runs daily at 1 AM via `full_pipeline.py`.

**Snowflake connection**: Key-pair auth configured in `dbt/profiles.yml`, database `GCMS_DEV`, warehouse `TRANSFORMING`.

## Deployment

- **Symphony Portal**: GitHub Actions (`.github/workflows/deploy.yml`) builds and deploys to GitHub Pages on push to main. Secrets are configured in GitHub repo settings.
- **Data Platform**: Self-hosted via Docker Compose on a single VM. Airflow UI at port 8080.

## Key Conventions

- Concert routes live under `src/app/concerts/` — each concert can be a static route (e.g., `NightAtTheMovies/`) or use the dynamic `[id]/` route
- Soloist routes use `src/app/soloists/[slug]/`
- dbt model naming: `br_` (bronze), `stg_` (staging), `int_` (intermediate), `fct_` (fact), `dim_` (dimension)
- dbt source tables are defined in `dbt/models/sources.yml` (17 Supabase tables)
- ESLint and TypeScript checking are disabled during production builds (`next.config.ts`)
