# LearnHub - Learning Management System (LMS)

A full-featured Learning Management System built with **Next.js 15**, **TypeScript**, and **Tailwind CSS**.

## Features

- **Homepage** – Hero section, stats, featured courses, category browser, testimonials
- **Course Catalog** (`/courses`) – Search, filter by category/level, sort by popularity/rating/price
- **Course Detail** (`/courses/[id]`) – Accordion curriculum, enrollment, instructor profile
- **Student Dashboard** (`/dashboard`) – Enrolled courses with progress tracking, activity feed
- **Authentication** – Login (`/login`) and Register (`/register`) pages with form validation
- **Admin Panel** (`/admin`) – Course management with add/edit/delete and platform stats

## Tech Stack

- [Next.js 15](https://nextjs.org/) (App Router)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- Static mock data (no backend required)

## Prerequisites

Before you begin, make sure you have the following installed:

- **Node.js** v18 or higher — [download](https://nodejs.org/)
- **npm** v9 or higher (bundled with Node.js)

Verify your versions:

```bash
node --version   # should print v18.x.x or higher
npm --version    # should print 9.x.x or higher
```

> **Tip:** If you use [nvm](https://github.com/nvm-sh/nvm), run `nvm use` inside the project folder to automatically switch to the correct Node.js version.

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. The page hot-reloads whenever you edit a source file.

## Running in Production

### 1. Build an optimized production bundle

```bash
npm run build
```

### 2. Start the production server

```bash
npm start
```

The server listens on [http://localhost:3000](http://localhost:3000) by default.  
To change the port: `npm start -- -p 8080`

## Available Scripts

| Script | Command | Description |
|--------|---------|-------------|
| Development | `npm run dev` | Starts the Next.js dev server with hot reload |
| Build | `npm run build` | Creates an optimized production build |
| Start | `npm start` | Serves the production build |
| Lint | `npm run lint` | Runs ESLint across all source files |

## Application Pages

| URL | Page |
|-----|------|
| `/` | Homepage |
| `/courses` | Browse all courses |
| `/courses/1` | Course detail (replace `1` with any course id 1–8) |
| `/dashboard` | Student dashboard |
| `/login` | Login |
| `/register` | Register |
| `/admin` | Admin panel |

## Project Structure

```
src/
├── app/
│   ├── admin/          # Admin panel
│   ├── courses/        # Course listing + detail pages
│   ├── dashboard/      # Student dashboard
│   ├── login/          # Login page
│   ├── register/       # Registration page
│   ├── layout.tsx      # Root layout with Navbar & Footer
│   └── page.tsx        # Homepage
├── components/
│   ├── CourseCard.tsx
│   ├── Footer.tsx
│   ├── Hero.tsx
│   ├── Navbar.tsx
│   ├── ProgressBar.tsx
│   └── SearchBar.tsx
└── lib/
    └── data.ts         # Mock data (courses, testimonials, etc.)
```

