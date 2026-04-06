"use client";

import React, { useState, useEffect } from "react";
import { User, Mail, Save, BookOpen, Clock, Sparkles } from "lucide-react";
import {
  getProfile,
  updateProfile,
  getUserEnrollments,
  LearningPreferences,
} from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  role: string;
  bio?: string;
  avatar_url?: string;
  learning_preferences?: LearningPreferences;
  createdAt: string;
}

function listToCsv(values?: string[]) {
  return (values || []).join(", ");
}

function csvToList(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [enrollmentCount, setEnrollmentCount] = useState(0);

  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [interests, setInterests] = useState("");
  const [learningGoal, setLearningGoal] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) {
      window.location.href = "/auth/login";
      return;
    }
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      const p = await getProfile();
      if (!p) {
        window.location.href = "/auth/login";
        return;
      }
      setProfile(p);
      setName(p.name || "");
      setBio(p.bio || "");
      setAvatarUrl(p.avatar_url || "");
      setInterests(listToCsv(p.learning_preferences?.interests));
      setLearningGoal(p.learning_preferences?.learning_goal || "");

      try {
        const enrollments = await getUserEnrollments(p._id);
        setEnrollmentCount(enrollments.length);
      } catch {}
    } catch {
      window.location.href = "/auth/login";
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMsg("");
    setError("");
    try {
      const learning_preferences: LearningPreferences = {
        interests: csvToList(interests),
        learning_goal: learningGoal.trim(),
        preferred_categories: [],
        preferred_formats: [],
        weekly_hours: 0,
        learning_style: "mixed",
      };

      const updated = await updateProfile({
        name: name || undefined,
        bio: bio || undefined,
        avatar_url: avatarUrl || undefined,
        learning_preferences,
      });
      setProfile(updated);

      const stored = localStorage.getItem("user");
      if (stored) {
        const user = JSON.parse(stored);
        user.name = updated.name;
        localStorage.setItem("user", JSON.stringify(user));
      }
      setMsg("Profile and learning preferences updated successfully.");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Update failed");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center text-muted-foreground">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="mt-4">Loading profile...</p>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 animate-fade-in">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">My Profile</h1>
        <p className="mt-2 text-lg text-muted-foreground">Manage your account settings and learning preferences</p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <Card className="md:col-span-1 animate-fade-in-up stagger-1 shadow-lg shadow-black/5 border-0 ring-1 ring-border">
          <CardContent className="flex flex-col items-center p-6 text-center">
            <Avatar className="mb-4 h-24 w-24 ring-4 ring-primary/10">
              <AvatarFallback className="bg-gradient-to-br from-primary/20 via-orange-100 to-sky-100 text-primary text-2xl font-bold">
                {profile.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <h2 className="text-lg font-bold">{profile.name}</h2>
            <p className="text-sm text-muted-foreground">{profile.email}</p>
            <Badge className="mt-3" variant={profile.role === "admin" ? "destructive" : profile.role === "instructor" ? "default" : "secondary"}>
              {profile.role}
            </Badge>

            <Separator className="my-4" />

            <div className="w-full space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <BookOpen className="h-4 w-4" /> Enrolled
                </span>
                <span className="font-medium">{enrollmentCount} courses</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4" /> Joined
                </span>
                <span className="font-medium">{new Date(profile.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-start justify-between gap-4">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <Sparkles className="h-4 w-4" /> Goal
                </span>
                <span className="text-right font-medium">{learningGoal || "Not set yet"}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 animate-fade-in-up stagger-2 shadow-lg shadow-black/5 border-0 ring-1 ring-border">
          <CardHeader>
            <CardTitle>Edit Profile</CardTitle>
            <CardDescription>Update your personal details and your AI recommendation goal</CardDescription>
          </CardHeader>
          <CardContent>
            {msg && <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{msg}</div>}
            {error && <div className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</div>}
            <form onSubmit={handleSave} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative mt-1">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="pl-10" placeholder="Your name" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <div className="relative mt-1">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input id="email" value={profile.email} disabled className="pl-10 bg-muted" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <textarea
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell us about yourself..."
                    className="mt-1 flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>
                <div>
                  <Label htmlFor="avatar">Avatar URL</Label>
                  <Input id="avatar" value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} placeholder="https://example.com/photo.jpg" className="mt-1" />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold">AI Recommendation Setup</h3>
                  <p className="text-sm text-muted-foreground">Keep this simple: tell the system what you want to learn and what topics you like.</p>
                </div>
                <div>
                  <Label htmlFor="goal">Learning Goal</Label>
                  <Input id="goal" value={learningGoal} onChange={(e) => setLearningGoal(e.target.value)} placeholder="Become a data analyst" className="mt-1" />
                  <p className="mt-1 text-xs text-muted-foreground">Example: `Become a frontend developer`, `Learn machine learning`, `Prepare for DevOps work`</p>
                </div>
                <div>
                  <Label htmlFor="interests">Interests</Label>
                  <Input id="interests" value={interests} onChange={(e) => setInterests(e.target.value)} placeholder="python, data science, sql" className="mt-1" />
                  <p className="mt-1 text-xs text-muted-foreground">Separate topics with commas. Example: `python, ai, web development`</p>
                </div>
              </div>

              <Button type="submit" disabled={saving}>
                <Save className="mr-2 h-4 w-4" />
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
