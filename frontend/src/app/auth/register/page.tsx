/**
 * Register Page — /auth/register
 *
 * Client component that presents a new-account registration form.
 * Fields: full name, email, password (min 6 chars), role (student / instructor).
 *
 * On successful registration:
 *   1. Stores the JWT in localStorage under the key "token".
 *   2. Stores the user object under the key "user".
 *   3. Redirects to /dashboard.
 *
 * Note: The backend always stores new self-registered users as "student"
 * regardless of the role submitted, to prevent privilege escalation.
 * The role selector is kept in the UI for future admin-created accounts.
 */

"use client";

import React, { useState } from "react";
import { UserPlus, Mail, Lock, User, GraduationCap } from "lucide-react";
import { register } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await register(name, email, password, role);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      const userRole = data.user.role;
      window.location.href = (userRole === "instructor" || userRole === "admin") ? "/dashboard/instructor" : "/dashboard";
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-[85vh] items-center justify-center px-4 py-8">
      <div className="w-full max-w-md animate-fade-in-up">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-purple-600 shadow-lg shadow-primary/25">
            <UserPlus className="h-7 w-7 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Create your account</h1>
          <p className="mt-2 text-sm text-muted-foreground">Start your learning journey today</p>
        </div>
        <Card className="shadow-xl shadow-black/5 border-0 ring-1 ring-border">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Sign Up</CardTitle>
            <CardDescription>Fill in your details to create a new account</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive animate-scale-in">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="pl-10 transition-shadow focus:shadow-md focus:shadow-primary/10"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="pl-10 transition-shadow focus:shadow-md focus:shadow-primary/10"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min. 6 characters"
                    className="pl-10 transition-shadow focus:shadow-md focus:shadow-primary/10"
                    required
                    minLength={6}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">I want to</Label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole("student")}
                    className={`flex flex-col items-center gap-1.5 rounded-xl border-2 p-4 text-sm font-medium transition-all ${
                      role === "student"
                        ? "border-primary bg-primary/5 text-primary shadow-sm"
                        : "border-border text-muted-foreground hover:border-primary/30 hover:bg-accent"
                    }`}
                  >
                    <GraduationCap className={`h-6 w-6 ${role === "student" ? "text-primary" : "text-muted-foreground"}`} />
                    Learn
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole("instructor")}
                    className={`flex flex-col items-center gap-1.5 rounded-xl border-2 p-4 text-sm font-medium transition-all ${
                      role === "instructor"
                        ? "border-primary bg-primary/5 text-primary shadow-sm"
                        : "border-border text-muted-foreground hover:border-primary/30 hover:bg-accent"
                    }`}
                  >
                    <GraduationCap className={`h-6 w-6 ${role === "instructor" ? "text-primary" : "text-muted-foreground"}`} />
                    Teach
                  </button>
                </div>
              </div>
              <Button type="submit" disabled={loading} className="w-full shadow-md shadow-primary/25 transition-all hover:shadow-lg hover:shadow-primary/30">
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                    Creating Account...
                  </span>
                ) : "Create Account"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="justify-center border-t py-4">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <a href="/auth/login" className="font-medium text-primary hover:underline underline-offset-4">
                Sign In
              </a>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
