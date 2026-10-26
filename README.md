# AI Newsletter SaaS

An email newsletter app that lets signed-in readers choose topics and a delivery
frequency. Inngest coordinates each newsletter run: the app fetches recent
articles, asks Gemini to select and summarize them, then sends the result with
Resend.

## Features

- Supabase email/password authentication, including sign-up confirmation and
  password recovery.
- Newsletter preferences for AI, business, entertainment, health, science,
  sports, and politics.
- Weekly, biweekly, or monthly delivery preferences.
- A dashboard to review preferences and pause or resume newsletter runs.
- Scheduled processing with Inngest, article retrieval from NewsAPI, and
  structured newsletter generation with Gemini.

## How a newsletter run works

1. A signed-in user saves topic and frequency preferences. The preferences are
   stored in Supabase's `user_preferences` table and a
   `newsletter.schedule` event is sent to Inngest.
2. The Inngest function checks whether the user's newsletter is active, then
   requests up to five English articles per topic from NewsAPI's
   `everything` endpoint, published within the previous seven days.
3. Duplicate URLs are removed. Gemini generates a structured newsletter with a
   subject, preview text, introduction, stories, and closing.
4. Resend sends the newsletter. The function schedules another
   `newsletter.schedule` event according to the saved frequency.
5. Pausing a newsletter updates the Supabase row and sends
   `newsletter.schedule.deleted` to cancel a matching scheduled run.

The first event is sent immediately when preferences are saved or a newsletter
is resumed. The selected frequency determines the next run after a successful
send.

## Tech stack

- Next.js App Router, React, and TypeScript
- Supabase Auth and Postgres, using `@supabase/ssr`
- Inngest for background work and scheduling
- NewsAPI for source articles
- Gemini (`gemini-3.6-flash`) for newsletter generation
- Resend for email delivery
- Tailwind CSS, Radix UI, and shadcn-style components

## Prerequisites

- Node.js compatible with the installed Next.js version
- A Supabase project
- API credentials for NewsAPI, Google Gemini, and Resend
- An Inngest account for deployed scheduling; the Inngest Dev Server can be
  used for local development

## Local setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create `.env.local` in the project root and set the credentials:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=YOUR_SUPABASE_PUBLISHABLE_KEY
   NEWS_API_KEY=YOUR_NEWSAPI_KEY
   GEMINI_API_KEY=YOUR_GEMINI_API_KEY
   RESEND_API_KEY=YOUR_RESEND_API_KEY
   ```

   For a deployed Inngest environment, also configure `INNGEST_EVENT_KEY` and
   `INNGEST_SIGNING_KEY` using the values from your Inngest environment.
   Keep secret keys out of source control; `.env.local` is git-ignored.

3. Create the Supabase table described below. Configure Supabase Auth's
   site/redirect URLs for the app (locally, the site URL is usually
   `http://localhost:3000`). The confirmation callback is
   `/auth/confirm`.

4. Start the Next.js app:

   ```bash
   npm run dev
   ```

5. In a second terminal, run the Inngest Dev Server and connect it to the
   local Next.js endpoint:

   ```bash
   npx inngest-cli@latest dev
   ```

   The Inngest handler is served at `/api/inngest`. Keep both processes running
   to test newsletter events locally.

6. Open [http://localhost:3000](http://localhost:3000). The root route sends
   signed-out visitors to `/auth/login` and signed-in users to `/dashboard`.

## Supabase data model

The app reads and writes a `public.user_preferences` table. The following
schema and policies support the signed-in user's preference form and dashboard:

| Column | Suggested type | Purpose |
| --- | --- | --- |
| `user_id` | `uuid` primary key, references `auth.users(id)` | One preference row per user |
| `email` | `text` | Email saved with the preferences |
| `categories` | `text[]` | Selected topic IDs |
| `frequency` | `text` | `weekly`, `biweekly`, or `monthly` |
| `is_active` | `boolean` | Whether future newsletter runs should proceed |
| `created_at` | `timestamptz` | Row creation time; default to `now()` |

Example SQL to run once in the Supabase SQL editor:

```sql
create table public.user_preferences (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  categories text[] not null,
  frequency text not null
    check (frequency in ('weekly', 'biweekly', 'monthly')),
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.user_preferences enable row level security;

create policy "Users can read their own newsletter preferences"
  on public.user_preferences for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can create their own newsletter preferences"
  on public.user_preferences for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Users can update their own newsletter preferences"
  on public.user_preferences for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
```

The Inngest worker also checks `is_active`. Ensure its server-side database
access is authorized under your RLS setup; the user-scoped policies above do
not grant it access. See the implementation notes below before deploying.

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Redirects to the login page or dashboard, depending on authentication |
| `/auth/login` | Sign in |
| `/auth/sign-up` | Create an account |
| `/auth/confirm` | Verify an email confirmation link |
| `/auth/forgot-password` | Request a password reset |
| `/auth/update-password` | Set a new password |
| `/auth/error` | Show an authentication error |
| `/dashboard` | View preferences and pause/resume delivery |
| `/select` | Choose or update newsletter topics and frequency |
| `/api/inngest` | Inngest function endpoint |

## Project structure

```text
app/
  api/inngest/             Inngest HTTP handler
  auth/                    Sign-in, sign-up, and password routes
  dashboard/               Preference summary and activation controls
  select/                  Preference form and save action
  subscribe/               Placeholder page
components/
  auth/                    Authentication forms and controls
  custom/                  Shared navigation and theme switcher
  ui/                      Reusable interface components
context/                   Supabase auth context
lib/
  inngest/                  Inngest client and scheduled function
  supabase/                 Browser, server, and proxy clients
  utils/                    News, prompt, email, and data helpers
types/                     Newsletter content types
```

## Commands

| Command | Description |
| --- | --- |
| `npm run dev` | Start the local Next.js development server |
| `npm run build` | Build the production app |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |

## Current implementation notes

- The email helper currently sends to a hard-coded recipient instead of the
  `email` passed into it, and uses Resend's onboarding sender address. Configure
  a verified sender and route messages to the intended subscriber before
  enabling real delivery.
- The Inngest function creates a Supabase server client and queries
  `user_preferences` while running outside a user's browser request. With
  row-level security enabled, that query needs a trusted server-side
  authorization path; the current helper uses the publishable key and request
  cookies. Do not solve this by exposing a service-role key to the browser.
- The “biweekly” option is implemented as every 14 days. Monthly scheduling is
  implemented as 30 days, and the next run is set to 09:00 in the server's
  local timezone, not the subscriber's timezone.
- `/subscribe` currently renders placeholder text and is not a working
  subscription-management flow.
