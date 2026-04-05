/**
 * Root Layout — Next.js App Router
 *
 * Wraps every page in the application with the shared Chrome:
 *   - <Navbar />  — Top navigation bar with auth-aware links.
 *   - <main>      — Page content outlet.
 *   - <footer>    — Site-wide footer.
 *
 * Global CSS (Tailwind base styles) is imported here so it applies
 * to all routes without each page needing to import it separately.
 *
 * Metadata exported from this file sets the default <title> and
 * <meta name="description"> for every page unless overridden.
 */

import type { Metadata } from "next";
import React from "react";
import Navbar from "./components/Navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "LMS Platform - Learning Portal",
  description: "Discover, enroll, and learn from our extensive course catalog",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans">
        <div className="relative flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1">{children}</main>
          <footer className="border-t bg-muted/50">
            <div className="mx-auto max-w-7xl px-4 py-8 text-center text-sm text-muted-foreground">
              &copy; 2026 LMS Platform. Master DevOps &amp; Cloud - M1.
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
