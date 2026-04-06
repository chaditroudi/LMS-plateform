"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  Clock, BookOpen, Star, Users, Brain, Send, ArrowLeft,
  GraduationCap, Award, CheckCircle2, CheckCircle, Video, FileText, Play,
} from "lucide-react";
import {
  fetchCourse, fetchLessons, fetchReviews, enrollInCourse, chatWithAI, submitReview,
  getUserProgress,
} from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

interface Lesson { id: number; title: string; duration_minutes: number; order_index: number; video_url?: string | null; content?: string | null; }
interface Review { id: number; user_id: string; rating: number; comment: string; created_at: string; }
interface Course { id: number; title: string; description: string; category: string; price: number; is_free: boolean; instructor_id: string; lessons: Lesson[]; }

export default function CourseDetailPage() {
  const params = useParams();
  const courseId = Number(params.id);
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrollMsg, setEnrollMsg] = useState("");
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<{ role: string; content: string }[]>([]);
  const [chatLoading, setChatLoading] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewMsg, setReviewMsg] = useState("");
  const [progressMap, setProgressMap] = useState<Record<number, boolean>>({});
  const [isEnrolled, setIsEnrolled] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const [c, l, r] = await Promise.all([fetchCourse(courseId), fetchLessons(courseId), fetchReviews(courseId)]);
        setCourse(c); setLessons(l); setReviews(r);

        // Load user progress if logged in
        const user = getUser();
        if (user) {
          const progs = await getUserProgress(courseId, user._id);
          if (progs && progs.length > 0) {
            setIsEnrolled(true);
            const map: Record<number, boolean> = {};
            progs.forEach((p: { lesson_id: number; completed: boolean }) => { map[p.lesson_id] = p.completed; });
            setProgressMap(map);
          }
        }
      } catch { setCourse(null); } finally { setLoading(false); }
    }
    load();
  }, [courseId]);

  function getUser() {
    try { const u = localStorage.getItem("user"); return u ? JSON.parse(u) : null; } catch { return null; }
  }

  async function handleEnroll() {
    const user = getUser();
    if (!user) { window.location.href = "/auth/login"; return; }
    try { await enrollInCourse(courseId, user._id); setEnrollMsg("Enrolled successfully!"); }
    catch (err: unknown) { setEnrollMsg(err instanceof Error ? err.message : "Enrollment failed"); }
  }

  async function handleChat(e: React.FormEvent) {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const userMsg = chatInput.trim();
    setChatInput("");
    setChatMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setChatLoading(true);
    try {
      const resp = await chatWithAI(courseId, userMsg, chatMessages);
      setChatMessages((prev) => [...prev, { role: "assistant", content: resp.reply }]);
    } catch { setChatMessages((prev) => [...prev, { role: "assistant", content: "Sorry, I couldn't process your question." }]); }
    finally { setChatLoading(false); }
  }

  async function handleReview(e: React.FormEvent) {
    e.preventDefault();
    const user = getUser();
    if (!user) { window.location.href = "/auth/login"; return; }
    try {
      const r = await submitReview(courseId, user._id, reviewRating, reviewComment);
      setReviews((prev) => [...prev, r]); setReviewComment(""); setReviewMsg("Review submitted!");
    } catch (err: unknown) { setReviewMsg(err instanceof Error ? err.message : "Failed to submit review"); }
  }

  if (loading) return (
    <div className="mx-auto max-w-4xl px-4 py-16 text-center text-muted-foreground">
      <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      <p className="mt-4 text-sm">Loading course...</p>
    </div>
  );

  if (!course) return (
    <div className="mx-auto max-w-4xl px-4 py-16 text-center animate-fade-in">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
        <BookOpen className="h-8 w-8 text-muted-foreground/50" />
      </div>
      <h1 className="text-2xl font-bold">Course Not Found</h1>
      <p className="mt-2 text-muted-foreground">This course may have been removed or doesn&apos;t exist.</p>
      <Button variant="link" asChild className="mt-4"><a href="/courses"><ArrowLeft className="mr-1 h-4 w-4" /> Back to Courses</a></Button>
    </div>
  );

  const totalDuration = lessons.reduce((sum, l) => sum + l.duration_minutes, 0);
  const avgRating = reviews.length > 0 ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : "N/A";
  const completedCount = lessons.filter((l) => progressMap[l.id]).length;
  const courseProgress = lessons.length > 0 ? Math.round((completedCount / lessons.length) * 100) : 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Card className="mb-8 overflow-hidden border-0 bg-gradient-to-br from-primary via-purple-600 to-pink-600 text-primary-foreground shadow-2xl shadow-primary/20 animate-fade-in">
        <CardContent className="p-8 lg:p-12">
          <Button variant="ghost" size="sm" asChild className="mb-4 text-primary-foreground/70 hover:bg-white/10 hover:text-primary-foreground">
            <a href="/courses"><ArrowLeft className="mr-1 h-4 w-4" /> All Courses</a>
          </Button>
          <Badge className="mb-4 border-primary-foreground/20 bg-white/20 text-primary-foreground backdrop-blur hover:bg-white/30">{course.category}</Badge>
          <h1 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">{course.title}</h1>
          <p className="mb-6 max-w-3xl text-lg text-primary-foreground/80 leading-relaxed">{course.description}</p>
          <div className="flex flex-wrap gap-6 text-sm text-primary-foreground/80">
            <span className="flex items-center gap-2"><BookOpen className="h-4 w-4" /> {lessons.length} lessons</span>
            <span className="flex items-center gap-2"><Clock className="h-4 w-4" /> {totalDuration} min</span>
            <span className="flex items-center gap-2"><Star className="h-4 w-4 fill-amber-400 text-amber-400" /> {avgRating} rating</span>
            <span className="flex items-center gap-2"><Users className="h-4 w-4" /> {reviews.length} reviews</span>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Tabs defaultValue="syllabus" className="w-full">
            <TabsList className="mb-6 w-full justify-start">
              <TabsTrigger value="syllabus">Syllabus</TabsTrigger>
              <TabsTrigger value="ai-tutor">AI Tutor</TabsTrigger>
              <TabsTrigger value="reviews">Reviews ({reviews.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="syllabus">
              {isEnrolled && (
                <div className="mb-4 rounded-lg border bg-card p-4">
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="font-medium">Your Progress</span>
                    <span className="text-muted-foreground">{completedCount}/{lessons.length} lessons ({courseProgress}%)</span>
                  </div>
                  <Progress value={courseProgress} className="h-2" />
                </div>
              )}
              <div className="space-y-2">
                {lessons.map((lesson, index) => {
                  const isDone = progressMap[lesson.id];
                  const hasVideo = !!lesson.video_url;
                  return (
                    <a key={lesson.id} href={`/courses/${course.id}/lessons/${lesson.id}`}
                      className={`group flex items-center justify-between rounded-lg border p-4 transition-all hover:border-primary/30 hover:shadow-sm ${
                        isDone ? "border-emerald-100 bg-emerald-50/50" : "bg-card"
                      }`}>
                      <div className="flex items-center gap-4">
                        {isDone ? (
                          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                            <CheckCircle className="h-4 w-4" />
                          </span>
                        ) : (
                          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                            {index + 1}
                          </span>
                        )}
                        <div>
                          <span className={`font-medium transition-colors group-hover:text-primary ${isDone ? "text-emerald-700" : ""}`}>{lesson.title}</span>
                          <div className="mt-0.5 flex items-center gap-2">
                            {hasVideo && <Badge variant="outline" className="h-5 gap-0.5 px-1.5 text-[10px] border-blue-200 bg-blue-50 text-blue-600"><Video className="h-2.5 w-2.5" /> Video</Badge>}
                            <span className="text-xs text-muted-foreground">{lesson.duration_minutes} min</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {isDone && <Badge variant="outline" className="border-emerald-200 bg-emerald-100 text-emerald-700 text-xs">Done</Badge>}
                        <Play className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                      </div>
                    </a>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="ai-tutor">
              <Card>
                <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><Brain className="h-5 w-5 text-primary" /> AI Tutor</CardTitle></CardHeader>
                <CardContent>
                  <p className="mb-4 text-sm text-muted-foreground">Ask questions about this course and get AI-powered answers.</p>
                  {chatMessages.length > 0 && (
                    <div className="mb-4 max-h-80 space-y-3 overflow-y-auto rounded-lg border bg-muted/30 p-4">
                      {chatMessages.map((msg, i) => (
                        <div key={i} className={`rounded-lg p-3 text-sm ${msg.role === "user" ? "ml-8 bg-primary text-primary-foreground" : "mr-8 border bg-card"}`}>
                          <span className="mb-1 block text-xs font-semibold opacity-70">{msg.role === "user" ? "You" : "AI Tutor"}</span>
                          {msg.content}
                        </div>
                      ))}
                      {chatLoading && <div className="mr-8 rounded-lg border bg-card p-3 text-sm text-muted-foreground animate-pulse">Thinking...</div>}
                    </div>
                  )}
                  <form onSubmit={handleChat} className="flex gap-2">
                    <Input value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder="Ask a question..." disabled={chatLoading} />
                    <Button type="submit" size="icon" disabled={chatLoading}><Send className="h-4 w-4" /></Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews">
              {reviews.length > 0 ? (
                <div className="mb-6 space-y-3">
                  {reviews.map((review) => (
                    <Card key={review.id}><CardContent className="p-4">
                      <div className="mb-2 flex items-center gap-2">
                        <div className="flex">{[1,2,3,4,5].map((s) => <Star key={s} className={`h-4 w-4 ${s <= review.rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"}`} />)}</div>
                        <span className="text-xs text-muted-foreground">{new Date(review.created_at).toLocaleDateString()}</span>
                      </div>
                      {review.comment && <p className="text-sm text-muted-foreground">{review.comment}</p>}
                    </CardContent></Card>
                  ))}
                </div>
              ) : <p className="mb-6 text-muted-foreground">No reviews yet. Be the first!</p>}
              <Card>
                <CardHeader><CardTitle className="text-lg">Write a Review</CardTitle></CardHeader>
                <CardContent>
                  {reviewMsg && <p className="mb-3 text-sm text-emerald-600">{reviewMsg}</p>}
                  <form onSubmit={handleReview} className="space-y-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Rating:</span>
                      {[1,2,3,4,5].map((s) => (
                        <button key={s} type="button" onClick={() => setReviewRating(s)}>
                          <Star className={`h-5 w-5 transition-colors ${s <= reviewRating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30 hover:text-amber-300"}`} />
                        </button>
                      ))}
                    </div>
                    <textarea value={reviewComment} onChange={(e) => setReviewComment(e.target.value)} placeholder="Share your experience..."
                      className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" rows={3} />
                    <Button type="submit">Submit Review</Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div>
          <Card className="sticky top-20 shadow-lg shadow-black/5 border-0 ring-1 ring-border">
            <CardContent className="p-6">
              <div className="mb-4 text-3xl font-bold text-primary">{course.is_free ? "Free" : `$${course.price}`}</div>
              {isEnrolled ? (
                <>
                  <div className="mb-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-center">
                    <CheckCircle2 className="mx-auto mb-1 h-5 w-5 text-emerald-600" />
                    <p className="text-sm font-medium text-emerald-700">Enrolled</p>
                  </div>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{courseProgress}%</span>
                  </div>
                  <Progress value={courseProgress} className="mb-3 h-2" />
                  {lessons.length > 0 && (
                    <Button asChild className="mb-2 w-full" size="lg">
                      <a href={`/courses/${courseId}/lessons/${
                        // Resume from first incomplete lesson, or first lesson
                        (lessons.find((l) => !progressMap[l.id]) || lessons[0]).id
                      }`}>
                        {completedCount > 0 ? "Continue Learning" : "Start Learning"}
                      </a>
                    </Button>
                  )}
                </>
              ) : (
                <>
                  <Button onClick={handleEnroll} className="mb-2 w-full shadow-md shadow-primary/25 transition-all hover:shadow-lg hover:shadow-primary/30" size="lg">{course.is_free ? "Enroll for Free" : "Buy & Enroll"}</Button>
                  {enrollMsg && <p className="mb-4 text-center text-sm text-emerald-600 animate-scale-in">{enrollMsg}</p>}
                </>
              )}
              <Separator className="my-4" />
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between"><span className="flex items-center gap-2 text-muted-foreground"><BookOpen className="h-4 w-4" /> Lessons</span><span className="font-medium">{lessons.length}</span></div>
                <div className="flex items-center justify-between"><span className="flex items-center gap-2 text-muted-foreground"><Clock className="h-4 w-4" /> Duration</span><span className="font-medium">{totalDuration} min</span></div>
                <div className="flex items-center justify-between"><span className="flex items-center gap-2 text-muted-foreground"><GraduationCap className="h-4 w-4" /> Level</span><span className="font-medium">Beginner</span></div>
                <div className="flex items-center justify-between"><span className="flex items-center gap-2 text-muted-foreground"><Award className="h-4 w-4" /> Certificate</span><CheckCircle2 className="h-4 w-4 text-emerald-600" /></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
