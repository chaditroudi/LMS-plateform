"use client";

import React, { useState, useEffect } from "react";
import {
  Users, BookOpen, TrendingUp, BarChart3, Eye, ArrowUpDown,
  Shield, GraduationCap, UserCheck, Activity,
} from "lucide-react";
import {
  fetchUsers, fetchCourses, fetchDashboardStats, fetchEvents,
} from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

interface UserItem {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

interface CourseItem {
  id: number;
  title: string;
  category: string | null;
  instructor_id: string;
  is_free: boolean;
  price: number;
  created_at: string;
}

interface DashboardStats {
  total_views: number;
  total_enrollments: number;
  active_users: number;
  completion_rate: number;
  popular_courses: { label: string; value: number }[];
  enrollment_trends: { label: string; value: number }[];
}

interface EventItem {
  id: number;
  event_type: string;
  user_id: string | null;
  course_id: number | null;
  created_at: string;
}

export default function AdminDashboard() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [userPage, setUserPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) { window.location.href = "/auth/login"; return; }
    const u = JSON.parse(stored);
    if (u.role !== "admin") { window.location.href = "/dashboard"; return; }
    loadData();
  }, []);

  async function loadData() {
    try {
      const [usersData, coursesData, statsData, eventsData] = await Promise.all([
        fetchUsers(1, 50),
        fetchCourses(),
        fetchDashboardStats(),
        fetchEvents({ limit: 50 }),
      ]);
      setUsers(usersData.users || []);
      setTotalUsers(usersData.pagination?.total || 0);
      setTotalPages(usersData.pagination?.pages || 1);
      setCourses(coursesData || []);
      setStats(statsData);
      setEvents(eventsData || []);
    } catch { /* ignore */ } finally { setLoading(false); }
  }

  async function loadUsers(page: number) {
    try {
      const data = await fetchUsers(page, 50);
      setUsers(data.users || []);
      setUserPage(page);
      setTotalPages(data.pagination?.pages || 1);
    } catch { /* ignore */ }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center text-muted-foreground">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="mt-4">Loading admin dashboard...</p>
      </div>
    );
  }

  const studentCount = users.filter((u) => u.role === "student").length;
  const instructorCount = users.filter((u) => u.role === "instructor").length;
  const adminCount = users.filter((u) => u.role === "admin").length;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 animate-fade-in">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Admin Dashboard</h1>
        <p className="mt-2 text-lg text-muted-foreground">Platform overview and user management</p>
      </div>

      {/* Stats Grid */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="animate-fade-in-up stagger-1 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 to-blue-100">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Users</p>
              <p className="text-2xl font-bold tracking-tight">{totalUsers}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="animate-fade-in-up stagger-2 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100">
              <BookOpen className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Courses</p>
              <p className="text-2xl font-bold tracking-tight">{courses.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="animate-fade-in-up stagger-3 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-50 to-amber-100">
              <TrendingUp className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Enrollments</p>
              <p className="text-2xl font-bold tracking-tight">{stats?.total_enrollments.toLocaleString() || 0}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="animate-fade-in-up stagger-4 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-50 to-purple-100">
              <Activity className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Completion Rate</p>
              <p className="text-2xl font-bold tracking-tight">{stats?.completion_rate || 0}%</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="users" className="space-y-6">
        <TabsList>
          <TabsTrigger value="users">Users ({totalUsers})</TabsTrigger>
          <TabsTrigger value="courses">Courses ({courses.length})</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
        </TabsList>

        {/* === Users Tab === */}
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>All Users</CardTitle>
              <CardDescription>
                {studentCount} students, {instructorCount} instructors, {adminCount} admins
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left text-muted-foreground">
                      <th className="pb-3 pr-4 font-medium">Name</th>
                      <th className="pb-3 pr-4 font-medium">Email</th>
                      <th className="pb-3 pr-4 font-medium">Role</th>
                      <th className="pb-3 font-medium">Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u._id} className="border-b last:border-0 transition-colors hover:bg-muted/50">
                        <td className="py-3 pr-4 font-medium">{u.name}</td>
                        <td className="py-3 pr-4 text-muted-foreground">{u.email}</td>
                        <td className="py-3 pr-4">
                          <Badge
                            variant={u.role === "admin" ? "destructive" : u.role === "instructor" ? "default" : "secondary"}
                          >
                            {u.role === "admin" && <Shield className="mr-1 h-3 w-3" />}
                            {u.role === "instructor" && <GraduationCap className="mr-1 h-3 w-3" />}
                            {u.role === "student" && <UserCheck className="mr-1 h-3 w-3" />}
                            {u.role}
                          </Badge>
                        </td>
                        <td className="py-3 text-muted-foreground">
                          {new Date(u.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {totalPages > 1 && (
                <div className="mt-4 flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">Page {userPage} of {totalPages}</p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" disabled={userPage <= 1} onClick={() => loadUsers(userPage - 1)}>
                      Previous
                    </Button>
                    <Button variant="outline" size="sm" disabled={userPage >= totalPages} onClick={() => loadUsers(userPage + 1)}>
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* === Courses Tab === */}
        <TabsContent value="courses">
          <Card>
            <CardHeader>
              <CardTitle>All Courses</CardTitle>
              <CardDescription>Manage all courses on the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left text-muted-foreground">
                      <th className="pb-3 pr-4 font-medium">ID</th>
                      <th className="pb-3 pr-4 font-medium">Title</th>
                      <th className="pb-3 pr-4 font-medium">Category</th>
                      <th className="pb-3 pr-4 font-medium">Price</th>
                      <th className="pb-3 font-medium">Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {courses.map((c) => (
                      <tr key={c.id} className="border-b last:border-0 transition-colors hover:bg-muted/50">
                        <td className="py-3 pr-4 text-muted-foreground">#{c.id}</td>
                        <td className="py-3 pr-4">
                          <a href={`/courses/${c.id}`} className="font-medium text-primary hover:underline">
                            {c.title}
                          </a>
                        </td>
                        <td className="py-3 pr-4">
                          {c.category ? <Badge variant="outline">{c.category}</Badge> : <span className="text-muted-foreground">—</span>}
                        </td>
                        <td className="py-3 pr-4">
                          <Badge variant={c.is_free ? "secondary" : "default"}>
                            {c.is_free ? "Free" : `$${c.price}`}
                          </Badge>
                        </td>
                        <td className="py-3 text-muted-foreground">
                          {new Date(c.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* === Analytics Tab === */}
        <TabsContent value="analytics">
          {stats && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                <Card className="text-center">
                  <CardContent className="py-4">
                    <div className="text-2xl font-bold text-primary">{stats.total_views.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">Total Page Views</div>
                  </CardContent>
                </Card>
                <Card className="text-center">
                  <CardContent className="py-4">
                    <div className="text-2xl font-bold text-emerald-600">{stats.total_enrollments.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">Total Enrollments</div>
                  </CardContent>
                </Card>
                <Card className="text-center">
                  <CardContent className="py-4">
                    <div className="text-2xl font-bold text-amber-600">{stats.active_users.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">Active Users</div>
                  </CardContent>
                </Card>
                <Card className="text-center">
                  <CardContent className="py-4">
                    <div className="text-2xl font-bold text-purple-600">{stats.completion_rate}%</div>
                    <div className="text-xs text-muted-foreground">Completion Rate</div>
                  </CardContent>
                </Card>
              </div>

              {/* Popular Courses */}
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

              {/* Enrollment Trends */}
              <Card>
                <CardHeader><CardTitle className="text-lg">Enrollment Trends</CardTitle></CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {stats.enrollment_trends.map((t, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <span className="w-16 text-sm text-muted-foreground">{t.label}</span>
                        <div className="flex-1">
                          <Progress value={(t.value / Math.max(...stats.enrollment_trends.map((x) => x.value), 1)) * 100} className="h-2" />
                        </div>
                        <span className="w-12 text-right text-sm font-medium">{t.value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        {/* === Activity Tab === */}
        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Recent Events</CardTitle>
              <CardDescription>Latest platform activity</CardDescription>
            </CardHeader>
            <CardContent>
              {events.length === 0 ? (
                <p className="py-8 text-center text-muted-foreground">No activity recorded yet.</p>
              ) : (
                <div className="space-y-3">
                  {events.slice(0, 30).map((ev, i) => (
                    <div key={i} className="flex items-center gap-3 rounded-lg border p-3">
                      <div className={`flex h-8 w-8 items-center justify-center rounded-full ${
                        ev.event_type === "enrollment" ? "bg-emerald-50 text-emerald-600" :
                        ev.event_type === "page_view" ? "bg-blue-50 text-blue-600" :
                        ev.event_type === "lesson_complete" ? "bg-amber-50 text-amber-600" :
                        "bg-purple-50 text-purple-600"
                      }`}>
                        {ev.event_type === "enrollment" ? <UserCheck className="h-4 w-4" /> :
                         ev.event_type === "page_view" ? <Eye className="h-4 w-4" /> :
                         <Activity className="h-4 w-4" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{ev.event_type.replace(/_/g, " ")}</p>
                        <p className="text-xs text-muted-foreground">
                          {ev.user_id && `User: ${ev.user_id.slice(0, 8)}...`}
                          {ev.course_id && ` • Course #${ev.course_id}`}
                        </p>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(ev.created_at).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
