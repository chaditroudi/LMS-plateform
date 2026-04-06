"use client";

import React, { useState, useEffect, use } from "react";
import {
  Plus, Pencil, Trash2, GripVertical, ArrowLeft, Video, FileText,
} from "lucide-react";
import {
  fetchCourse, fetchLessons, createLesson, updateLesson, deleteLesson,
} from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface LessonItem {
  id: number;
  course_id: number;
  title: string;
  content: string | null;
  video_url: string | null;
  order_index: number;
  duration_minutes: number;
  created_at: string;
}

interface CourseInfo {
  id: number;
  title: string;
}

export default function LessonManagerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const courseId = parseInt(id, 10);

  const [course, setCourse] = useState<CourseInfo | null>(null);
  const [lessons, setLessons] = useState<LessonItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingLesson, setEditingLesson] = useState<LessonItem | null>(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [orderIndex, setOrderIndex] = useState("0");
  const [durationMinutes, setDurationMinutes] = useState("0");

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
    loadData();
  }, []);

  async function loadData() {
    try {
      const [c, l] = await Promise.all([fetchCourse(courseId), fetchLessons(courseId)]);
      setCourse(c);
      setLessons(l);
    } catch {
      setError("Failed to load course data");
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setTitle("");
    setContent("");
    setVideoUrl("");
    setOrderIndex(String(lessons.length));
    setDurationMinutes("0");
    setEditingLesson(null);
    setShowForm(false);
    setError("");
  }

  function openCreate() {
    resetForm();
    setOrderIndex(String(lessons.length));
    setShowForm(true);
  }

  function openEdit(lesson: LessonItem) {
    setEditingLesson(lesson);
    setTitle(lesson.title);
    setContent(lesson.content || "");
    setVideoUrl(lesson.video_url || "");
    setOrderIndex(String(lesson.order_index));
    setDurationMinutes(String(lesson.duration_minutes));
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
      if (editingLesson) {
        await updateLesson(courseId, editingLesson.id, {
          title,
          content: content || undefined,
          video_url: videoUrl || undefined,
          order_index: parseInt(orderIndex, 10),
          duration_minutes: parseInt(durationMinutes, 10) || 0,
        });
      } else {
        await createLesson(courseId, {
          title,
          content: content || undefined,
          video_url: videoUrl || undefined,
          order_index: parseInt(orderIndex, 10),
          duration_minutes: parseInt(durationMinutes, 10) || 0,
        });
      }
      resetForm();
      const updated = await fetchLessons(courseId);
      setLessons(updated);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(lessonId: number) {
    if (!confirm("Delete this lesson? Progress data will be removed.")) return;
    try {
      await deleteLesson(courseId, lessonId);
      setLessons((prev) => prev.filter((l) => l.id !== lessonId));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Delete failed");
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center text-muted-foreground">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="mt-4">Loading lessons...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <Button variant="ghost" size="sm" className="mb-4" asChild>
          <a href="/dashboard/instructor">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Courses
          </a>
        </Button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Lesson Management</h1>
            <p className="mt-1 text-muted-foreground">
              {course?.title || `Course #${courseId}`} — {lessons.length} lesson{lessons.length !== 1 ? "s" : ""}
            </p>
          </div>
          <Button onClick={openCreate} className="shadow-md shadow-primary/25 transition-all hover:shadow-lg hover:shadow-primary/30">
            <Plus className="mr-2 h-4 w-4" />
            Add Lesson
          </Button>
        </div>
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
            <CardTitle>{editingLesson ? "Edit Lesson" : "Add New Lesson"}</CardTitle>
            <CardDescription>
              {editingLesson ? "Update the lesson details below." : "Fill in the details to add a lesson."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="lessonTitle">Title *</Label>
                  <Input
                    id="lessonTitle"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Getting Started with Variables"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="orderIndex">Order</Label>
                    <Input
                      id="orderIndex"
                      type="number"
                      min="0"
                      value={orderIndex}
                      onChange={(e) => setOrderIndex(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="duration">Duration (min)</Label>
                    <Input
                      id="duration"
                      type="number"
                      min="0"
                      value={durationMinutes}
                      onChange={(e) => setDurationMinutes(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div>
                <Label htmlFor="videoUrl">Video URL</Label>
                <Input
                  id="videoUrl"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://youtube.com/watch?v=..."
                />
              </div>
              <div>
                <Label htmlFor="content">Content</Label>
                <textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Lesson content (markdown or text)..."
                  className="flex min-h-[150px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>
              <div className="flex gap-3">
                <Button type="submit" disabled={saving}>
                  {saving ? "Saving..." : editingLesson ? "Update Lesson" : "Add Lesson"}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Lessons List */}
      {lessons.length === 0 ? (
        <Card className="text-center">
          <CardContent className="py-12">
            <FileText className="mx-auto mb-4 h-12 w-12 text-muted-foreground/40" />
            <h3 className="text-lg font-semibold">No lessons yet</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Click &quot;Add Lesson&quot; to create the first lesson for this course.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {lessons.map((lesson, idx) => (
            <Card key={lesson.id} className="transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 border-0 ring-1 ring-border hover:ring-primary/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                      {lesson.order_index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{lesson.title}</h3>
                        {lesson.video_url && (
                          <Badge variant="outline" className="gap-1">
                            <Video className="h-3 w-3" />
                            Video
                          </Badge>
                        )}
                        {lesson.duration_minutes > 0 && (
                          <Badge variant="secondary">
                            {lesson.duration_minutes} min
                          </Badge>
                        )}
                      </div>
                      {lesson.content && (
                        <p className="mt-1 text-sm text-muted-foreground line-clamp-1">
                          {lesson.content.slice(0, 120)}...
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => openEdit(lesson)}>
                      <Pencil className="mr-1 h-4 w-4" />
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(lesson.id)}
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
