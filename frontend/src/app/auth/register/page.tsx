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
    <div className="flex min-h-[85vh] items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
            <UserPlus className="h-6 w-6 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Create your account</h1>
          <p className="mt-1 text-sm text-muted-foreground">Start your learning journey today</p>
        </div>
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Sign Up</CardTitle>
            <CardDescription>Fill in your details to create a new account</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">
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
                    className="pl-10"
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
                    className="pl-10"
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
                    className="pl-10"
                    required
                    minLength={6}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <div className="relative">
                  <GraduationCap className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <select
                    id="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="student">Student</option>
                    <option value="instructor">Instructor</option>
                  </select>
                </div>
              </div>
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="justify-center border-t py-4">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <a href="/auth/login" className="font-medium text-primary hover:underline">
                Sign In
              </a>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
