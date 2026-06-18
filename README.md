# Portfolio

A personal developer portfolio built with Next.js 15, Convex, and Tailwind CSS. Includes a CMS-style admin panel for managing all content without touching code.

## Tech Stack

- **Framework** — Next.js 15 (App Router)
- **Database & backend** — Convex
- **Styling** — Tailwind CSS v4
- **Animations** — Motion (Framer Motion v12)
- **Package manager** — pnpm

## Features

- Home, About, Projects, and Contact pages
- Project detail modals with tech stack, features, and links
- Snake game easter egg on the home page
- Admin panel (`/admin`) to manage all portfolio content
- Skeleton loading states and empty states
- SEO metadata and OG image on every page
- Fully responsive

## Getting Started

### 1. Install dependencies

```bash
pnpm install
```

### 2. Set up environment variables

```bash
cp .env.example .env.local
```

Fill in your values — see `.env.example` for descriptions.

### 3. Set up Convex

```bash
npx convex dev
```

This starts the Convex dev server, generates the client, and keeps your schema in sync. Leave it running alongside the Next.js dev server.

### 4. Run the dev server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the portfolio and [http://localhost:3000/admin](http://localhost:3000/admin) for the admin panel.

## Admin Panel

Visit `/admin` to manage your portfolio content — profile, about sections, projects, and contact info. Protected by a password set in `ADMIN_PASSWORD`.

## Deployment

Deploy to Vercel and set up a production Convex deployment:

1. Push to GitHub and import the repo on [Vercel](https://vercel.com)
2. Add all environment variables from `.env.example` in the Vercel dashboard
3. Run `npx convex deploy` to deploy your Convex functions to production
