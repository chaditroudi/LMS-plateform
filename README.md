# LearnHub - Learning Management System (LMS)

A full-featured Learning Management System built with **Next.js 14**, **TypeScript**, and **Tailwind CSS**.

## Features

- **Homepage** – Hero section, stats, featured courses, category browser, testimonials
- **Course Catalog** (`/courses`) – Search, filter by category/level, sort by popularity/rating/price
- **Course Detail** (`/courses/[id]`) – Accordion curriculum, enrollment, instructor profile
- **Student Dashboard** (`/dashboard`) – Enrolled courses with progress tracking, activity feed
- **Authentication** – Login (`/login`) and Register (`/register`) pages with form validation
- **Admin Panel** (`/admin`) – Course management with add/edit/delete and platform stats

## Tech Stack

- [Next.js 14](https://nextjs.org/) (App Router)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- Static mock data (no backend required)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

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

## Build

```bash
npm run build
```
