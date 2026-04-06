/**
 * Dashboard Page — /dashboard
 *
 * Client component that serves as the personalised learner home screen.
 * Redirects to /auth/login when no authenticated user is found in localStorage.
 *
 * Sections rendered:
 *   1. Stat cards  — Enrolled courses, hours learned, completed courses,
 *                     and the platform-wide completion rate.
 *   2. My Courses  — For each enrollment the course title and a progress
 *                     bar (completed lessons / total lessons) are shown.
 *   3. Platform Analytics — Popular courses and monthly enrollment trends
 *                            sourced from the analytics service.
 *   4. AI Recommendations — Personalised course suggestions from the
 *                            AI tutor service.
 *
 * Data fetching strategy:
 *   - Platform stats and enrollments are fetched in parallel on mount.
 *   - Per-enrolment course detail and progress are fetched concurrently
 *     inside Promise.all after the enrollment list is available.
 *   - AI recommendations are attempted last and failures are silently
 *     ignored to keep the dashboard functional if the AI service is down.
 */

"use client";

import React, { useState, useEffect } from "react";
import { BookOpen, Clock, Award, TrendingUp, BarChart3, ArrowRight, Sparkles } from "lucide-react";
import {
  fetchDashboardStats, getUserEnrollments, fetchCourse, getUserProgress, getRecommendations, getProfile, LearningPreferences,
} from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Enrollment { id: number; user_id: string; course_id: number; enrolled_at: string; }
interface CourseInfo { id: number; title: string; lessons: { id: number }[]; }
interface ProgressItem { lesson_id: number; completed: boolean; }
interface DashboardStats {
  total_views: number; total_enrollments: number; active_users: number; completion_rate: number;
  popular_courses: { label: string; value: number }[];
  enrollment_trends: { label: string; value: number }[];
}
interface Recommendation { course_id: number; title: string; reason: string; score: number; }
interface UserProfileResponse { _id: string; learning_preferences?: LearningPreferences; }

function hasMeaningfulPreferences(preferences?: LearningPreferences) {
  return Boolean(
    preferences?.interests?.some((item) => item.trim()) ||
    preferences?.learning_goal?.trim()
  );
}

export default function DashboardPage() {
  const [user, setUser] = useState<{ _id: string; name: string } | null>(null);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [courseDetails, setCourseDetails] = useState<Map<number, { title: string; totalLessons: number; completedLessons: number }>>(new Map());
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [hasPreferenceSetup, setHasPreferenceSetup] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const stored = localStorage.getItem("user");
        if (!stored) { window.location.href = "/auth/login"; return; }
        const u = JSON.parse(stored);
        setUser(u);
        const [enrs, dashStats, fullProfile] = await Promise.all([
          getUserEnrollments(u._id),
          fetchDashboardStats(),
          getProfile() as Promise<UserProfileResponse | null>,
        ]);
        setHasPreferenceSetup(hasMeaningfulPreferences(fullProfile?.learning_preferences));
        setEnrollments(enrs); setStats(dashStats);
        const details = new Map<number, { title: string; totalLessons: number; completedLessons: number }>();
        await Promise.all(enrs.map(async (e: Enrollment) => {
          try {
            const [course, progress]: [CourseInfo, ProgressItem[]] = await Promise.all([fetchCourse(e.course_id), getUserProgress(e.course_id, u._id)]);
            details.set(e.course_id, { title: course.title, totalLessons: course.lessons?.length || 0, completedLessons: progress.filter((p) => p.completed).length });
          } catch { /* skip */ }
        }));
        setCourseDetails(details);
        try {
          const recs = await getRecommendations(u._id, undefined, fullProfile?.learning_preferences);
          setRecommendations(recs.recommendations || []);
        } catch { /* ignore */ }
      } catch { /* ignore */ } finally { setLoading(false); }
    }
    load();
  }, []);

  if (loading) return (
    <div className="mx-auto max-w-7xl px-4 py-16 text-center text-muted-foreground">
      <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      <p className="mt-4">Loading dashboard...</p>
    </div>
  );

  const totalCompleted = Array.from(courseDetails.values()).filter((c) => c.totalLessons > 0 && c.completedLessons >= c.totalLessons).length;
  const totalHours = Math.round(Array.from(courseDetails.values()).reduce((s, c) => s + c.completedLessons * 15, 0) / 60);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 animate-fade-in">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Dashboard</h1>
        <p className="mt-2 text-lg text-muted-foreground">Welcome back{user?.name ? `, ${user.name}` : ""}!</p>
      </div>

      {/* Stats Grid */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={<BookOpen className="h-5 w-5 text-primary" />} label="Enrolled Courses" value={String(enrollments.length)} color="bg-gradient-to-br from-primary/10 to-primary/5" delay="stagger-1" />
        <StatCard icon={<Clock className="h-5 w-5 text-amber-600" />} label="Hours Learned" value={String(totalHours)} color="bg-gradient-to-br from-amber-50 to-amber-50/50" delay="stagger-2" />
        <StatCard icon={<Award className="h-5 w-5 text-emerald-600" />} label="Completed" value={String(totalCompleted)} color="bg-gradient-to-br from-emerald-50 to-emerald-50/50" delay="stagger-3" />
        <StatCard icon={<TrendingUp className="h-5 w-5 text-purple-600" />} label="In Progress" value={String(enrollments.length - totalCompleted)} color="bg-gradient-to-br from-purple-50 to-purple-50/50" delay="stagger-4" />
      </div>

      <Tabs defaultValue="courses" className="space-y-6">
        <TabsList>
          <TabsTrigger value="courses">My Courses</TabsTrigger>
          <TabsTrigger value="analytics">Platform Analytics</TabsTrigger>
          <TabsTrigger value="recommendations">Recommended</TabsTrigger>
        </TabsList>

        {/* My Courses */}
        <TabsContent value="courses">
          {enrollments.length === 0 ? (
            <Card className="text-center">
              <CardContent className="py-12">
                <BookOpen className="mx-auto mb-4 h-12 w-12 text-muted-foreground/40" />
                <h3 className="text-lg font-semibold">No courses yet</h3>
                <p className="mt-1 text-sm text-muted-foreground">Start learning by enrolling in a course.</p>
                <Button className="mt-4" asChild><a href="/courses">Browse Courses <ArrowRight className="ml-1 h-4 w-4" /></a></Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {enrollments.map((e) => {
                const info = courseDetails.get(e.course_id);
                const pct = info && info.totalLessons > 0 ? Math.round((info.completedLessons / info.totalLessons) * 100) : 0;
                return (
                  <a key={e.id} href={`/courses/${e.course_id}`} className="block group">
                    <Card className="transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 border-0 ring-1 ring-border hover:ring-primary/20">
                      <CardContent className="p-5">
                        <div className="mb-3 flex items-center justify-between">
                          <h3 className="font-semibold transition-colors group-hover:text-primary">{info?.title || `Course #${e.course_id}`}</h3>
                          <Badge variant={pct >= 100 ? "success" : "secondary"}>
                            {pct >= 100 ? "Completed" : `${info?.completedLessons || 0}/${info?.totalLessons || 0} lessons`}
                          </Badge>
                        </div>
                        <Progress value={pct} className="h-2" />
                        <p className="mt-2 text-right text-xs text-muted-foreground">{pct}% complete</p>
                      </CardContent>
                    </Card>
                  </a>
                );
              })}
            </div>
          )}
        </TabsContent>

        {/* Platform Analytics */}
        <TabsContent value="analytics">
          {stats && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                <Card className="text-center"><CardContent className="py-4">
                  <div className="text-2xl font-bold text-primary">{stats.total_views.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">Total Views</div>
                </CardContent></Card>
                <Card className="text-center"><CardContent className="py-4">
                  <div className="text-2xl font-bold text-emerald-600">{stats.total_enrollments.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">Enrollments</div>
                </CardContent></Card>
                <Card className="text-center"><CardContent className="py-4">
                  <div className="text-2xl font-bold text-amber-600">{stats.active_users.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">Active Users</div>
                </CardContent></Card>
                <Card className="text-center"><CardContent className="py-4">
                  <div className="text-2xl font-bold text-purple-600">{stats.completion_rate}%</div>
                  <div className="text-xs text-muted-foreground">Completion Rate</div>
                </CardContent></Card>
              </div>
              <Card>
                <CardHeader><CardTitle className="text-lg">Popular Courses</CardTitle></CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {stats.popular_courses.map((c, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">{i + 1}</span>
                        <div className="flex-1">
                          <div className="mb-1 flex items-center justify-between">
                            <span className="text-sm font-medium">{c.label}</span>
                            <span className="text-xs text-muted-foreground">{c.value} enrollments</span>
                          </div>
                          <Progress value={(c.value / (stats.popular_courses[0]?.value || 1)) * 100} className="h-1.5" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        {/* Recommendations */}
        <TabsContent value="recommendations">
          {!hasPreferenceSetup ? (
            <Card className="text-center">
              <CardContent className="py-12">
                <Sparkles className="mx-auto mb-4 h-12 w-12 text-amber-500/60" />
                <h3 className="text-lg font-semibold">Set your AI recommendation goal first</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Add a learning goal and a few interests in your profile to unlock personalized AI recommendations.
                </p>
                <Button className="mt-4" asChild>
                  <a href="/dashboard/profile">Open Profile <ArrowRight className="ml-1 h-4 w-4" /></a>
                </Button>
              </CardContent>
            </Card>
          ) : recommendations.length === 0 ? (
            <Card className="text-center">
              <CardContent className="py-12">
                <Sparkles className="mx-auto mb-4 h-12 w-12 text-amber-500/60" />
                <h3 className="text-lg font-semibold">No matching recommendations yet</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Try a clearer goal and simpler interests in your profile, like `become a data analyst` and `python, data science`.
                </p>
                <Button className="mt-4" asChild>
                  <a href="/dashboard/profile">Update Preferences <ArrowRight className="ml-1 h-4 w-4" /></a>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {recommendations.map((r) => (
                <a key={r.course_id} href={`/courses/${r.course_id}`} className="group">
                  <Card className="transition-all hover:shadow-md">
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-amber-500" />
                        <CardTitle className="text-base transition-colors group-hover:text-primary">{r.title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent><CardDescription>{r.reason}</CardDescription></CardContent>
                  </Card>
                </a>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function StatCard({ icon, label, value, color, delay }: { icon: React.ReactNode; label: string; value: string; color: string; delay?: string }) {
  return (
    <Card className={`transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 animate-fade-in-up ${delay || ""}`}>
      <CardContent className="flex items-center gap-4 p-5">
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${color}`}>{icon}</div>
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold tracking-tight">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}
