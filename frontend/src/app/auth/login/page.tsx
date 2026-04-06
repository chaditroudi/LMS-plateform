/**
 * Login Page — /auth/login
 *
 * Client component that presents an email + password sign-in form.
 * On successful authentication:
 *   1. Stores the JWT in localStorage under the key "token".
 *   2. Stores the user object under the key "user".
 *   3. Redirects the user to /dashboard.
 *
 * Validation errors returned by the API are displayed inline; network
 * or unknown errors are caught and shown as a generic error message.
 */

"use client";

import React, { useState } from "react";
import { LogIn, Mail, Lock } from "lucide-react";
import { login } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await login(email, password);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      const userRole = data.user.role;
      window.location.href = (userRole === "instructor" || userRole === "admin") ? "/dashboard/instructor" : "/dashboard";
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-[85vh] items-center justify-center px-4">
      <div className="w-full max-w-md animate-fade-in-up">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-purple-600 shadow-lg shadow-primary/25">
            <LogIn className="h-7 w-7 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
          <p className="mt-2 text-sm text-muted-foreground">Sign in to continue your learning journey</p>
        </div>
        <Card className="shadow-xl shadow-black/5 border-0 ring-1 ring-border">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Sign In</CardTitle>
            <CardDescription>Enter your credentials to access your account</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive animate-scale-in">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
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
                    placeholder="Enter your password"
                    className="pl-10 transition-shadow focus:shadow-md focus:shadow-primary/10"
                    required
                  />
                </div>
              </div>
              <Button type="submit" disabled={loading} className="w-full shadow-md shadow-primary/25 transition-all hover:shadow-lg hover:shadow-primary/30">
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                    Signing in...
                  </span>
                ) : "Sign In"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="justify-center border-t py-4">
            <p className="text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <a href="/auth/register" className="font-medium text-primary hover:underline underline-offset-4">
                Sign Up
              </a>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
