<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Default Skills & Communication Rules
- **Ponytail & Caveman Skills**: Always communicate concisely, directly, and without unnecessary fluff. Cut straight to the code and solution.
- **Understand Anything & Mindmap**: Always review `mindmap.md` at the start of any new chat to understand the project architecture, components, and flow without wasting tokens on redundant file reading. Whenever making architectural or structural changes to the project, update `mindmap.md` accordingly.

# Job Scraping & Data Pushing Instructions
- **What to Scrape**:
  1. Target **Remote Product Manager** roles matching the user's profile (~2-5 years experience, Revenue Growth, Retention, AI-led Automation, Consumer/Retail/DevTools/B2B SaaS).
  2. **Exact URLs Only**: Scrape specific job application links (e.g., exact Lever UUID, Ashby posting ID, or Greenhouse job ID). NEVER add generic career board homepages.
  3. **Verification**: Ensure every job URL returns HTTP 200 and was posted within the last 30 days.
  4. Extract full description, clear requirements, salary bounds, and relevant tags.

- **What to Push (Data Schema)**: Ensure every job conforms exactly to the `Job` interface:
  - Required fields: `id`, `title`, `company`, `salaryMin`, `salaryMax`, `salaryText`, `experience`, `workMode: 'Remote'`, `location`, `country`, `city`, `platform`, `source`, `jobUrl`, `description`, `requirements`, `status: 'New'`, `favorite: false`, `datePosted`, `tags`.

- **How to Push Data**:
  1. Add new jobs to `INITIAL_JOBS` in `src/lib/jobService.ts` and increment the localStorage cache version key (e.g., `get_me_a_job_cache_v11`).
  2. Push all jobs directly to live Cloud Firestore using terminal command:
     ```bash
     npx -y tsx -e "import { INITIAL_JOBS } from './src/lib/jobService'; import { db } from './src/lib/firebase'; import { doc, setDoc } from 'firebase/firestore'; (async () => { for (const j of INITIAL_JOBS) { await setDoc(doc(db, 'jobs', j.id), j); } process.exit(0); })();"
     ```
  3. Update `mindmap.md` with the new job count and cache version.
