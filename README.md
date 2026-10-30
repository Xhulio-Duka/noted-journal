# noted

A personal publishing journal for writing, managing, and reading short notes.

## What it does

- Displays a public journal feed with post titles, excerpts, dates, images, and authors
- Lets authenticated users sign up and sign in with email and password
- Lets authenticated users create, edit, and delete their own posts
- Persists posts in Neon Postgres so they remain available after refresh and logout
- Keeps posts public while restricting post mutations to their authors
- Supports searching posts by title and content
- Provides a responsive mobile navigation menu
- Supports light and dark themes with the preference preserved between routes
- Includes an About page describing the journal

## Stack

Next.js 16 + React 19 + TypeScript  
Tailwind CSS 4 + shadcn/ui + Lucide React  
Neon Auth + Neon Postgres + Drizzle ORM  
Vercel Analytics

## Structure

```text
app/page.tsx                         # server-rendered journal page and session loading
components/journal-page.tsx         # journal UI, search, editor, theme, and navigation
app/actions/posts.ts                 # authenticated post queries and mutations
app/api/auth/[...path]/route.ts      # Neon Auth route handler
app/sign-in/page.tsx                 # sign-in and sign-up form
app/about/page.tsx                   # About page
lib/auth/server.ts                   # server-side Neon Auth configuration
lib/auth/client.ts                   # client-side Neon Auth client
lib/db/index.ts                      # Drizzle database client
lib/db/schema.ts                     # journal_post table schema
app/globals.css                      # theme tokens and global styling
```

## Getting started

Configure the Neon integration and its environment variables, then run:

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Production build

```bash
pnpm build
pnpm start
```
