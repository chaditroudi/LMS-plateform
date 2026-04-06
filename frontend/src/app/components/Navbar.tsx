/**
 * Navbar — Site-wide Navigation Bar
 *
 * Client component that reads the authenticated user from localStorage
 * on mount and adapts its content accordingly:
 *   - Unauthenticated : Shows a "Sign In" button linking to /auth/login.
 *   - Authenticated   : Shows the user's name and a Logout button.
 *
 * On logout, both the JWT and the user object are removed from
 * localStorage and the user is redirected to the home page.
 *
 * Navigation links:
 *   /          — Home (LMS Platform logo)
 *   /courses   — Course catalogue
 *   /dashboard — User dashboard
 */

"use client";

import { useState, useEffect } from "react";
import { GraduationCap, BookOpen, LayoutDashboard, LogOut, Menu, X, Settings, Shield, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

export default function Navbar() {
  const [user, setUser] = useState<{ name: string; role?: string } | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");
      if (stored) setUser(JSON.parse(stored));
    } catch {
      // ignore
    }
  }, []);

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  }

  const navLinks = [
    { href: "/courses", label: "Courses", icon: BookOpen },
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    ...((user?.role === "instructor" || user?.role === "admin")
      ? [{ href: "/dashboard/instructor", label: "Course Management", icon: Settings }]
      : []),
    ...(user?.role === "admin"
      ? [{ href: "/dashboard/admin", label: "Admin", icon: Shield }]
      : []),
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-lg supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <a href="/" className="group flex items-center gap-2.5 transition-all hover:opacity-90">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-purple-600 shadow-sm shadow-primary/25 transition-transform group-hover:scale-105">
            <GraduationCap className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">LMS Platform</span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="group/link relative inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-all hover:text-foreground"
            >
              <link.icon className="h-4 w-4 transition-colors group-hover/link:text-primary" />
              {link.label}
              <span className="absolute inset-x-3 -bottom-px h-px scale-x-0 bg-primary transition-transform group-hover/link:scale-x-100" />
            </a>
          ))}
          <Separator orientation="vertical" className="mx-2 h-6" />
          {user ? (
            <div className="flex items-center gap-2">
              <a href="/dashboard/profile" className="group/avatar flex items-center gap-2 rounded-lg px-2.5 py-1.5 transition-all hover:bg-accent">
                <Avatar className="h-8 w-8 ring-2 ring-transparent transition-all group-hover/avatar:ring-primary/20">
                  <AvatarFallback className="bg-gradient-to-br from-primary/20 to-purple-100 text-primary text-xs font-semibold">
                    {user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-medium leading-tight">{user.name}</span>
                  <span className="text-[10px] leading-tight text-muted-foreground capitalize">{user.role || "student"}</span>
                </div>
              </a>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="text-muted-foreground transition-colors hover:text-destructive hover:bg-destructive/10">
                <LogOut className="mr-1 h-4 w-4" />
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild className="text-muted-foreground hover:text-foreground">
                <a href="/auth/login">Sign In</a>
              </Button>
              <Button size="sm" asChild className="shadow-sm shadow-primary/25">
                <a href="/auth/register">Get Started</a>
              </Button>
            </div>
          )}
        </nav>

        {/* Mobile toggle */}
        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="border-t bg-background px-4 pb-4 pt-2 md:hidden">
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </a>
            ))}
            <Separator className="my-2" />
            {user ? (
              <>
                <div className="flex items-center gap-3 px-3 py-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                      {user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">{user.name}</span>
                </div>
                <Button variant="ghost" size="sm" onClick={handleLogout} className="justify-start text-muted-foreground hover:text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </>
            ) : (
              <div className="flex flex-col gap-2 pt-2">
                <Button variant="outline" size="sm" asChild>
                  <a href="/auth/login">Sign In</a>
                </Button>
                <Button size="sm" asChild>
                  <a href="/auth/register">Get Started</a>
                </Button>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
