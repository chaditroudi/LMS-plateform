"use client";

import React, { useState, useEffect } from "react";
import {
  Plus, Pencil, Trash2, BookOpen, Layers, Eye, ArrowRight,
} from "lucide-react";
import {
  fetchCourses, createCourse, updateCourse, deleteCourse,
} from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface CourseItem {
  id: number;
  title: string;
  description: string | null;
  category: string | null;
  price: number;
  is_free: boolean;
  thumbnail_url: string | null;
  instructor_id: string;
  created_at: string;
  updated_at: string;
}

interface UserData {
  _id: string;
  name: string;
  role: string;
}

export default function InstructorDashboard() {
  const [user, setUser] = useState<UserData | null>(null);
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState<CourseItem | null>(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("0");
  const [isFree, setIsFree] = useState(true);
  const [thumbnailUrl, setThumbnailUrl] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) {
      window.location.href = "/auth/login";
      return;
    }
    const u = JSON.parse(stored);
    if (u.role !== "instructor" && u.role !== "admin") {
      window.location.href = "/dashboard";
      return;
    }
    setUser(u);
    loadCourses();
  }, []);

  async function loadCourses() {
    try {
      const all = await fetchCourses();
      const stored = localStorage.getItem("user");
      if (stored) {
        const u = JSON.parse(stored);
        // Admin sees all, instructor sees own courses
        if (u.role === "admin") {
          setCourses(all);
        } else {
          setCourses(all.filter((c: CourseItem) => c.instructor_id === u._id));
        }
      }
    } catch {
      setError("Failed to load courses");
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setTitle("");
    setDescription("");
    setCategory("");
    setPrice("0");
    setIsFree(true);
    setThumbnailUrl("");
    setEditingCourse(null);
    setShowForm(false);
    setError("");
  }

  function openEditForm(course: CourseItem) {
    setEditingCourse(course);
    setTitle(course.title);
    setDescription(course.description || "");
    setCategory(course.category || "");
    setPrice(String(course.price));
    setIsFree(course.is_free);
    setThumbnailUrl(course.thumbnail_url || "");
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      setError("Title is required");
      return;
    }
    setSaving(true);
    setError("");
    try {
      if (editingCourse) {
        await updateCourse(editingCourse.id, {
          title,
          description: description || undefined,
          category: category || undefined,
          price: parseFloat(price) || 0,
          is_free: isFree,
          thumbnail_url: thumbnailUrl || undefined,
        });
      } else {
        await createCourse({
          title,
          description: description || undefined,
          category: category || undefined,
          price: parseFloat(price) || 0,
          is_free: isFree,
          thumbnail_url: thumbnailUrl || undefined,
          instructor_id: user!._id,
        });
      }
      resetForm();
      await loadCourses();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(courseId: number) {
    if (!confirm("Delete this course? All lessons, enrollments, and reviews will be removed.")) return;
    try {
      await deleteCourse(courseId);
      setCourses((prev) => prev.filter((c) => c.id !== courseId));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Delete failed");
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center text-muted-foreground">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="mt-4">Loading instructor dashboard...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Course Management</h1>
          <p className="mt-2 text-lg text-muted-foreground">
            {user?.role === "admin" ? "Manage all platform courses" : "Create and manage your courses"}
          </p>
        </div>
        <Button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="shadow-md shadow-primary/25 transition-all hover:shadow-lg hover:shadow-primary/30"
        >
          <Plus className="mr-2 h-4 w-4" />
          New Course
        </Button>
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive animate-scale-in">
          {error}
        </div>
      )}

      {/* Create / Edit Form */}
      {showForm && (
        <Card className="mb-8 animate-scale-in shadow-lg shadow-black/5 border-0 ring-1 ring-border">
          <CardHeader>
            <CardTitle>{editingCourse ? "Edit Course" : "Create New Course"}</CardTitle>
            <CardDescription>
              {editingCourse ? "Update your course details below." : "Fill in the details to create a new course."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Introduction to Python"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="e.g. Programming, Data Science"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Course description..."
                  className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div>
                  <Label htmlFor="price">Price</Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>
                <div className="flex items-end gap-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={isFree}
                      onChange={(e) => setIsFree(e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <span className="text-sm font-medium">Free course</span>
                  </label>
                </div>
                <div>
                  <Label htmlFor="thumbnail">Thumbnail URL</Label>
                  <Input
                    id="thumbnail"
                    value={thumbnailUrl}
                    onChange={(e) => setThumbnailUrl(e.target.value)}
                    placeholder="https://..."
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <Button type="submit" disabled={saving}>
                  {saving ? "Saving..." : editingCourse ? "Update Course" : "Create Course"}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Course List */}
      {courses.length === 0 ? (
        <Card className="text-center">
          <CardContent className="py-12">
            <BookOpen className="mx-auto mb-4 h-12 w-12 text-muted-foreground/40" />
            <h3 className="text-lg font-semibold">No courses yet</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Click &quot;New Course&quot; to create your first course.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {courses.map((course) => (
            <Card key={course.id} className="transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 border-0 ring-1 ring-border hover:ring-primary/20">
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold">{course.title}</h3>
                      <Badge variant={course.is_free ? "secondary" : "default"}>
                        {course.is_free ? "Free" : `$${course.price}`}
                      </Badge>
                      {course.category && (
                        <Badge variant="outline">{course.category}</Badge>
                      )}
                    </div>
                    {course.description && (
                      <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                        {course.description}
                      </p>
                    )}
                    <p className="mt-2 text-xs text-muted-foreground">
                      Created {new Date(course.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <a href={`/courses/${course.id}`}>
                        <Eye className="mr-1 h-4 w-4" />
                        View
                      </a>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <a href={`/dashboard/instructor/${course.id}/lessons`}>
                        <Layers className="mr-1 h-4 w-4" />
                        Lessons
                      </a>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditForm(course)}
                    >
                      <Pencil className="mr-1 h-4 w-4" />
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(course.id)}
                    >
                      <Trash2 className="mr-1 h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
