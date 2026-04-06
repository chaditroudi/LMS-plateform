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
          <footer className="border-t bg-gradient-to-b from-muted/50 to-muted/80">
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
                <div>
                  <h3 className="mb-3 text-sm font-semibold tracking-wider uppercase text-foreground">Platform</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li><a href="/courses" className="transition-colors hover:text-primary">Browse Courses</a></li>
                    <li><a href="/dashboard" className="transition-colors hover:text-primary">Dashboard</a></li>
                  </ul>
                </div>
                <div>
                  <h3 className="mb-3 text-sm font-semibold tracking-wider uppercase text-foreground">Resources</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li><a href="/auth/register" className="transition-colors hover:text-primary">Get Started</a></li>
                    <li><a href="/auth/login" className="transition-colors hover:text-primary">Sign In</a></li>
                  </ul>
                </div>
                <div>
                  <h3 className="mb-3 text-sm font-semibold tracking-wider uppercase text-foreground">About</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    AI-powered learning platform built with microservices architecture. Master DevOps & Cloud - M1.
                  </p>
                </div>
              </div>
              <div className="mt-8 border-t pt-6 text-center text-sm text-muted-foreground">
                &copy; {new Date().getFullYear()} LMS Platform. All rights reserved.
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
