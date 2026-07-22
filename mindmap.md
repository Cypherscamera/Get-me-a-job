# Get Me A Job - Project Mindmap & Architecture

```mermaid
mindmap
  root((Get Me A Job Pipeline))
    Core Frontend
      Next.js 16 App Router
      Tailwind CSS / Lucide Icons
      Main Page UI (page.tsx with auth session)
      Header (With user status and logout option)
    Components
      LoginScreen (Credential validation, Apple aesthetics)
      JobTable (List view, static status badge)
      JobDrawer (Detail view, Description/Requirements, Interactive Status Timeline)
      StatsCards (Metrics overview)
      FilterPanel (Search & multi-filter)
    Data Layer
      Firebase Firestore (db connection, scoped under /users/{username}/jobs)
      jobService.ts (fetchJobs with 1500ms timeout graceful fallback & exact URL filtering)
      INITIAL_JOBS (173 total verified remote PM roles globally, cache v32)
    Skills & Rules
      Ponytail & Caveman (Concise direct communication)
      Understand Anything (Mindmap maintenance for token savings)
```

## System Overview & Architecture
- **Framework**: Next.js 16 (App Router, Turbopack) with TypeScript and Tailwind CSS.
- **Backend & Database**: Firebase Firestore (`users/{username}/jobs` collections). When offline or partially populated, `jobService.ts` auto-merges entries from `INITIAL_JOBS` (for `aryan` only) into localStorage (`get_me_a_job_cache_v32_{username}`) within 1500ms using `Promise.race`, filtering out any unverified/invalid domains or base homepage landing URLs. `ankit` profile data remains empty.
- **Job Flow & Statuses**: Exactly 8 active pipeline stages:
  1. `New`
  2. `Applied`
  3. `Not Applied`
  4. `Rejected`
  5. `Interview`
  6. `Offer`
  7. `Accepted`
  8. `Not Valid`
- **UI Interaction Model**:
  - Clean header without unnecessary Refresh/Add Manual/Settings action buttons.
  - The main table (`JobTable.tsx`) displays clean static pill badges for statuses without inline dropdown clutter.
  - Clicking any opportunity opens the rich slide-over detail view (`JobDrawer.tsx`), which showcases full job descriptions, requirements, recruiter info, and an interactive **Status Timeline & Flow** logging tool with custom progression dates.
  - Every single job link points to the **exact specific job application page** (e.g., specific Lever UUID or Greenhouse posting ID), never a generic career board homepage.
