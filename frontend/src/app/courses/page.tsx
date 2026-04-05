/**
 * Courses Page — /courses
 *
 * Client component that renders the searchable, filterable course catalogue.
 *
 * State:
 *   courses  — Array of courses returned by the API.
 *   search   — Controlled text input value for keyword search.
 *   category — Active category filter ("All" means no filter).
 *   loading  — True while a fetch is in-flight.
 *
 * Behaviour:
 *   - On search / category change a 300 ms debounce timer fires before
 *     the API call to avoid flooding the backend on every keystroke.
 *   - The loadCourses callback is memoised with useCallback so the
 *     debounce timer is correctly cleaned up on re-render.
 */

"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, BookOpen, ArrowRight } from "lucide-react";
import { fetchCourses } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Course {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  is_free: boolean;
  instructor_id: string;
  thumbnail_url: string;
}

const categories = [
  "All",
  "Programming",
  "Web Development",
  "Data Science",
  "DevOps",
  "AI/ML",
];

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  const loadCourses = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchCourses({
        search: search || undefined,
        category: category !== "All" ? category : undefined,
      });
      setCourses(data);
    } catch {
      setCourses([]);
    } finally {
      setLoading(false);
    }
  }, [search, category]);

  useEffect(() => {
    const timer = setTimeout(loadCourses, 300);
    return () => clearTimeout(timer);
  }, [loadCourses]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Course Catalog</h1>
        <p className="mt-2 text-muted-foreground">
          Discover courses to advance your skills
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search courses..."
            className="pl-10"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={category === cat ? "default" : "outline"}
              size="sm"
              onClick={() => setCategory(cat)}
            >
              {cat}
            </Button>
          ))}
        </div>
      </div>

      {/* Course Grid */}
      {loading ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="overflow-hidden">
              <div className="h-48 animate-pulse bg-muted" />
              <CardContent className="space-y-3 p-5">
                <div className="h-4 w-20 animate-pulse rounded bg-muted" />
                <div className="h-5 w-3/4 animate-pulse rounded bg-muted" />
                <div className="h-4 w-full animate-pulse rounded bg-muted" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : courses.length === 0 ? (
        <Card className="py-16 text-center">
          <CardContent>
            <BookOpen className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" />
            <h3 className="text-lg font-semibold">No courses found</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Try a different search or filter.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <a key={course.id} href={`/courses/${course.id}`} className="group">
              <Card className="overflow-hidden transition-all hover:shadow-lg">
                <div className="flex h-48 items-center justify-center bg-gradient-to-br from-primary/10 via-primary/5 to-purple-100">
                  <BookOpen className="h-16 w-16 text-primary/40 transition-transform group-hover:scale-110" />
                </div>
                <CardContent className="p-5">
                  <div className="mb-3 flex items-center gap-2">
                    <Badge variant="secondary">{course.category}</Badge>
                    {course.is_free && <Badge variant="success">Free</Badge>}
                  </div>
                  <h3 className="mb-2 text-lg font-semibold transition-colors group-hover:text-primary">
                    {course.title}
                  </h3>
                  <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
                    {course.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-primary">
                      {course.is_free ? "Free" : `$${course.price}`}
                    </span>
                    <span className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors group-hover:text-primary">
                      View Course <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </CardContent>
              </Card>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
