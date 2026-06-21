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
- Spotify now playing widget + weekly top tracks on the about page
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

### 4. Set up Spotify (optional)

The about page shows your weekly top tracks and a now playing widget powered by the Spotify API.

1. Go to [developer.spotify.com/dashboard](https://developer.spotify.com/dashboard) and create an app
2. Add `https://oauth.pstmn.io/v1/callback` as a redirect URI in the app settings
3. Visit the authorization URL below (replace `YOUR_CLIENT_ID`):

```txt
https://accounts.spotify.com/authorize?client_id=YOUR_CLIENT_ID&response_type=code&redirect_uri=https%3A%2F%2Foauth.pstmn.io%2Fv1%2Fcallback&scope=user-top-read%20user-read-currently-playing%20user-read-playback-state
```

4. After authorizing, copy the `code` from the redirect URL and exchange it for a refresh token:

```bash
curl -X POST "https://accounts.spotify.com/api/token" \
  -H "Authorization: Basic $(echo -n 'CLIENT_ID:CLIENT_SECRET' | base64)" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=authorization_code&code=YOUR_CODE&redirect_uri=https%3A%2F%2Foauth.pstmn.io%2Fv1%2Fcallback"
```

5. Copy the `refresh_token` from the response and add it to `.env.local` along with your client ID and secret

6. Set the same three values as Convex environment variables:

```bash
npx convex env set SPOTIFY_CLIENT_ID your_client_id
npx convex env set SPOTIFY_CLIENT_SECRET your_client_secret
npx convex env set SPOTIFY_REFRESH_TOKEN your_refresh_token
```

7. Trigger the first snapshot manually:

```bash
npx convex run spotify:refresh
```

### 5. Run the dev server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the portfolio and [http://localhost:3000/admin](http://localhost:3000/admin) for the admin panel.

## Admin Panel

Visit `/admin` to manage your portfolio content — profile, about sections, projects, and contact info. Protected by a password set in `ADMIN_PASSWORD`.

## Deployment

Deploy to Vercel and set up a production Convex deployment:

1. Push to GitHub and import the repo on [Vercel](https://vercel.com)
1. Add all environment variables from `.env.example` in the Vercel dashboard
1. Run `npx convex deploy` to deploy your Convex functions to production
1. Push Spotify env vars to the production Convex deployment:

```bash
npx convex env set SPOTIFY_CLIENT_ID your_client_id --prod
npx convex env set SPOTIFY_CLIENT_SECRET your_client_secret --prod
npx convex env set SPOTIFY_REFRESH_TOKEN your_refresh_token --prod
npx convex run spotify:refresh --prod
```
