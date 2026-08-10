# Habit Tracker
 
A minimalist habit tracker that helps you build consistency, one honest day at a time. Track your habits, mark them done, and watch your streak grow — but only if you actually show up every day.
 
## Description
 
Habit Tracker is a full-stack web app for building and maintaining daily habits. Unlike simple checklist apps, it enforces a strict day-by-day streak system: you can only mark today's habit as done, and missing a single day resets your streak back to zero. This keeps the streak count honest and meaningful — no retroactive edits, no cheating.
 
Each habit shows a weekly view (Mon–Sun) of completed days, a live streak counter, and a visual "goal achieved" state once your streak reaches your target. The app includes full user authentication, so every user has their own private habit list, along with a customizable profile featuring a nickname and uploadable avatar.
 
## Features
 
- **Authentication** — secure registration and login with JWT and hashed passwords
- **User profiles** — editable nickname and uploadable avatar image
- **Daily habit tracking** — mark habits as done, but only for the current day (server-enforced)
- **Streak calculation** — consecutive-day streak counted from today backwards; a missed day resets it to 1
- **Weekly view** — Monday–Sunday circles showing completion history for the current week
- **Goal tracking** — habits glow and display "Goal achieved" once the streak reaches the target number of days
- **Per-user data isolation** — each user only sees and modifies their own habits
- **Custom design system** — Tailwind theme built around a warm, muted color palette
## Tech Stack
 
**Frontend**
- [Next.js](https://nextjs.org/) (App Router) + TypeScript
- Tailwind CSS (with custom `@theme` design tokens)
- Axios (with automatic JWT header injection)
- React Zustand for global auth state

**Backend**
- Node.js + Express + TypeScript
- [Neon](https://neon.tech/) (serverless Postgres)
- JWT (`jsonwebtoken`) for session tokens
- `bcrypt` for password hashing
- `cors`, `dotenv`

