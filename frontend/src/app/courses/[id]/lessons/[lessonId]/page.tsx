"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useParams } from "next/navigation";
import {
  ChevronLeft, ChevronRight, CheckCircle, BookOpen, Play, Video,
  FileText, Clock, ListOrdered, ArrowRight, Brain, HelpCircle,
} from "lucide-react";
import { fetchLesson, fetchLessons, markLessonComplete, getUserProgress, generateQuiz } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";

interface LessonData {
  id: number; course_id: number; title: string; content: string | null;
  video_url: string | null; order_index: number; duration_minutes: number;
}
interface ProgressRecord { lesson_id: number; completed: boolean; }

/** Detect YouTube URLs and extract embed ID */
function getYouTubeId(url: string): string | null {
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|.*&v=))([^&#?]+)/);
  return m ? m[1] : null;
}

export default function LessonPage() {
  const params = useParams();
  const courseId = Number(params.id);
  const lessonId = Number(params.lessonId);

  const [lesson, setLesson] = useState<LessonData | null>(null);
  const [allLessons, setAllLessons] = useState<LessonData[]>([]);
  const [progressMap, setProgressMap] = useState<Record<number, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);
  const [readProgress, setReadProgress] = useState(0);
  const [videoEnded, setVideoEnded] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Quiz state
  const [quizQuestions, setQuizQuestions] = useState<{ question: string; options: string[]; correct_answer: number; explanation?: string }[]>([]);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizLoading, setQuizLoading] = useState(false);
  const [quizVisible, setQuizVisible] = useState(false);

  const contentRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // --- Load lesson, all lessons, and existing progress ---
  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [l, all] = await Promise.all([
          fetchLesson(courseId, lessonId),
          fetchLessons(courseId),
        ]);
        setLesson(l);
        setAllLessons(all);

        // Load existing completion state
        const user = getUser();
        if (user) {
          const progs: ProgressRecord[] = await getUserProgress(courseId, user._id);
          const map: Record<number, boolean> = {};
          progs.forEach((p) => { map[p.lesson_id] = p.completed; });
          setProgressMap(map);
          setCompleted(!!map[lessonId]);
        }
      } catch { setLesson(null); } finally { setLoading(false); }
    }
    load();
    setReadProgress(0);
    setVideoEnded(false);
  }, [courseId, lessonId]);

  // --- Scroll-based reading progress ---
  const handleScroll = useCallback(() => {
    if (!contentRef.current) return;
    const el = contentRef.current;
    const rect = el.getBoundingClientRect();
    const viewportH = window.innerHeight;
    const totalH = el.scrollHeight;
    // How much of the content has scrolled past the top of the viewport
    const scrolled = Math.max(0, -rect.top + viewportH * 0.3);
    const pct = Math.min(100, Math.round((scrolled / totalH) * 100));
    setReadProgress(pct);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  function getUser() {
    try { const u = localStorage.getItem("user"); return u ? JSON.parse(u) : null; } catch { return null; }
  }

  async function handleMarkComplete() {
    const user = getUser();
    if (!user) { window.location.href = "/auth/login"; return; }
    try {
      await markLessonComplete(courseId, lessonId, user._id);
      setCompleted(true);
      setProgressMap((prev) => ({ ...prev, [lessonId]: true }));
    } catch { /* ignore */ }
  }

  async function handleGenerateQuiz() {
    setQuizLoading(true);
    setQuizVisible(true);
    setQuizSubmitted(false);
    setQuizAnswers({});
    try {
      const data = await generateQuiz(courseId, lessonId, 5);
      // Transform API response: options are objects {label, text, is_correct}
      const transformed = (data.questions || []).map((q: { question: string; options: { label: string; text: string; is_correct?: boolean }[]; explanation?: string }) => ({
        question: q.question,
        options: q.options.map((o: { text: string }) => o.text),
        correct_answer: q.options.findIndex((o: { is_correct?: boolean }) => o.is_correct),
        explanation: q.explanation,
      }));
      setQuizQuestions(transformed);
    } catch {
      setQuizQuestions([]);
    } finally {
      setQuizLoading(false);
    }
  }

  if (loading) return (
    <div className="mx-auto max-w-4xl px-4 py-16 text-center text-muted-foreground">
      <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      <p className="mt-4">Loading lesson...</p>
    </div>
  );

  if (!lesson) return (
    <div className="mx-auto max-w-4xl px-4 py-16 text-center">
      <h1 className="text-2xl font-bold">Lesson Not Found</h1>
      <Button variant="link" asChild className="mt-4"><a href="/courses">Back to Courses</a></Button>
    </div>
  );

  const sorted = [...allLessons].sort((a, b) => a.order_index - b.order_index);
  const currentIdx = sorted.findIndex((l) => l.id === lessonId);
  const prevLesson = currentIdx > 0 ? sorted[currentIdx - 1] : null;
  const nextLesson = currentIdx < sorted.length - 1 ? sorted[currentIdx + 1] : null;
  const completedCount = sorted.filter((l) => progressMap[l.id]).length;
  const courseProgress = sorted.length > 0 ? Math.round((completedCount / sorted.length) * 100) : 0;

  const ytId = lesson.video_url ? getYouTubeId(lesson.video_url) : null;
  const isDirectVideo = lesson.video_url && !ytId;
  const hasVideo = !!lesson.video_url;
  const hasText = !!lesson.content;

  return (
    <>
      {/* Top reading progress bar */}
      {hasText && (
        <div className="fixed left-0 right-0 top-0 z-50 h-1 bg-muted/50">
          <div
            className="h-full bg-gradient-to-r from-primary to-purple-600 transition-all duration-300 ease-out"
            style={{ width: `${readProgress}%` }}
          />
        </div>
      )}

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
          <a href="/courses" className="transition-colors hover:text-primary">Courses</a>
          <ChevronRight className="h-3.5 w-3.5" />
          <a href={`/courses/${courseId}`} className="transition-colors hover:text-primary">Course</a>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="font-medium text-foreground">{lesson.title}</span>
        </nav>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_300px]">
          {/* Main content area */}
          <div className="min-w-0">
            {/* Lesson Header */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{lesson.title}</h1>
                <div className="mt-2 flex flex-wrap items-center gap-3">
                  <Badge variant="secondary" className="gap-1">
                    <BookOpen className="h-3 w-3" /> Lesson {lesson.order_index}
                  </Badge>
                  <span className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" /> {lesson.duration_minutes} min
                  </span>
                  {hasVideo && (
                    <Badge variant="outline" className="gap-1 border-blue-200 bg-blue-50 text-blue-700">
                      <Video className="h-3 w-3" /> Video
                    </Badge>
                  )}
                  {hasText && (
                    <Badge variant="outline" className="gap-1 border-amber-200 bg-amber-50 text-amber-700">
                      <FileText className="h-3 w-3" /> Text
                    </Badge>
                  )}
                </div>
              </div>
              <Button
                onClick={handleMarkComplete}
                disabled={completed}
                variant={completed ? "outline" : "default"}
                className={completed
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-50"
                  : "bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/25"}
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                {completed ? "Completed" : "Mark Complete"}
              </Button>
            </div>

            {/* Video Player */}
            {hasVideo && (
              <Card className="mb-8 overflow-hidden">
                {ytId ? (
                  /* YouTube embed */
                  <div className="relative aspect-video w-full">
                    <iframe
                      src={`https://www.youtube-nocookie.com/embed/${ytId}?rel=0`}
                      title={lesson.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="absolute inset-0 h-full w-full border-0"
                    />
                  </div>
                ) : isDirectVideo ? (
                  /* HTML5 video player */
                  <div className="relative aspect-video w-full bg-black">
                    <video
                      ref={videoRef}
                      src={lesson.video_url!}
                      controls
                      className="h-full w-full"
                      onEnded={() => setVideoEnded(true)}
                    >
                      Your browser does not support the video tag.
                    </video>
                  </div>
                ) : (
                  /* Fallback: link to external video */
                  <a
                    href={lesson.video_url!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex aspect-video items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 transition-opacity hover:opacity-90"
                  >
                    <div className="flex flex-col items-center gap-3 text-white">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10 backdrop-blur">
                        <Play className="h-8 w-8" />
                      </div>
                      <span className="text-sm font-medium">Open Video</span>
                    </div>
                  </a>
                )}
              </Card>
            )}

            {/* Auto-complete prompt after video ends */}
            {videoEnded && !completed && (
              <div className="mb-6 flex items-center gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4">
                <CheckCircle className="h-5 w-5 shrink-0 text-emerald-600" />
                <p className="text-sm text-emerald-800">Video terminée ! Marquer cette leçon comme terminée ?</p>
                <Button size="sm" onClick={handleMarkComplete} className="ml-auto bg-emerald-600 hover:bg-emerald-700">
                  Compléter
                </Button>
              </div>
            )}

            {/* Text Content */}
            {hasText && (
              <Card className="mb-8">
                <CardContent className="p-8" ref={contentRef}>
                  <div className="prose prose-neutral max-w-none dark:prose-invert">
                    {lesson.content!.split("\n\n").map((paragraph, i) => {
                      // Detect headings (lines starting with # or all caps short lines)
                      if (paragraph.startsWith("# ")) {
                        return <h2 key={i} className="mb-4 mt-8 text-xl font-bold text-foreground first:mt-0">{paragraph.replace(/^#+\s*/, "")}</h2>;
                      }
                      if (paragraph.startsWith("## ")) {
                        return <h3 key={i} className="mb-3 mt-6 text-lg font-semibold text-foreground">{paragraph.replace(/^#+\s*/, "")}</h3>;
                      }
                      // Detect bullet points
                      if (paragraph.match(/^[-*•]\s/m)) {
                        const items = paragraph.split(/\n/).filter(Boolean);
                        return (
                          <ul key={i} className="mb-4 ml-4 list-disc space-y-1 text-foreground/90">
                            {items.map((item, j) => (
                              <li key={j}>{item.replace(/^[-*•]\s*/, "")}</li>
                            ))}
                          </ul>
                        );
                      }
                      // Detect numbered lists
                      if (paragraph.match(/^\d+[.)]\s/m)) {
                        const items = paragraph.split(/\n/).filter(Boolean);
                        return (
                          <ol key={i} className="mb-4 ml-4 list-decimal space-y-1 text-foreground/90">
                            {items.map((item, j) => (
                              <li key={j}>{item.replace(/^\d+[.)]\s*/, "")}</li>
                            ))}
                          </ol>
                        );
                      }
                      // Detect code blocks (lines indented with 4 spaces or ```)
                      if (paragraph.startsWith("```") || paragraph.startsWith("    ")) {
                        return (
                          <pre key={i} className="mb-4 overflow-x-auto rounded-lg bg-muted p-4 text-sm">
                            <code>{paragraph.replace(/^```\w*\n?|```$/g, "").replace(/^    /gm, "")}</code>
                          </pre>
                        );
                      }
                      // Regular paragraphs - handle inline **bold** and *italic*
                      return (
                        <p key={i} className="mb-4 leading-relaxed text-foreground/90"
                          dangerouslySetInnerHTML={{
                            __html: paragraph
                              .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
                              .replace(/\*(.+?)\*/g, "<em>$1</em>")
                              .replace(/`(.+?)`/g, '<code class="rounded bg-muted px-1.5 py-0.5 text-sm font-mono">$1</code>')
                              .replace(/\n/g, "<br />"),
                          }}
                        />
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {!hasVideo && !hasText && (
              <Card className="mb-8">
                <CardContent className="flex flex-col items-center gap-4 p-12 text-center text-muted-foreground">
                  <FileText className="h-12 w-12 opacity-50" />
                  <p>No content available for this lesson yet.</p>
                </CardContent>
              </Card>
            )}

            {/* Quiz Section */}
            <Card className="mb-8">
              <CardContent className="p-6">
                {!quizVisible ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50">
                        <HelpCircle className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium">Test Your Knowledge</p>
                        <p className="text-sm text-muted-foreground">Take a quiz to check your understanding of this lesson</p>
                      </div>
                    </div>
                    <Button onClick={handleGenerateQuiz} variant="outline">
                      <Brain className="mr-2 h-4 w-4" />
                      Generate Quiz
                    </Button>
                  </div>
                ) : quizLoading ? (
                  <div className="py-8 text-center text-muted-foreground">
                    <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-purple-500 border-t-transparent" />
                    <p className="mt-4">Generating quiz questions...</p>
                  </div>
                ) : quizQuestions.length === 0 ? (
                  <div className="py-8 text-center text-muted-foreground">
                    <p>No quiz questions available for this lesson.</p>
                    <Button variant="ghost" className="mt-2" onClick={() => setQuizVisible(false)}>Close</Button>
                  </div>
                ) : (
                  <div>
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="flex items-center gap-2 text-lg font-bold">
                        <Brain className="h-5 w-5 text-purple-600" /> Lesson Quiz
                      </h3>
                      {quizSubmitted && (
                        <Badge variant="outline" className="text-sm">
                          Score: {quizQuestions.filter((q, i) => quizAnswers[i] === q.correct_answer).length}/{quizQuestions.length}
                        </Badge>
                      )}
                    </div>
                    <div className="space-y-6">
                      {quizQuestions.map((q, qi) => {
                        const userAnswer = quizAnswers[qi];
                        const isCorrect = quizSubmitted && userAnswer === q.correct_answer;
                        const isWrong = quizSubmitted && userAnswer !== undefined && userAnswer !== q.correct_answer;
                        return (
                          <div key={qi} className={`rounded-lg border p-4 ${isCorrect ? "border-emerald-200 bg-emerald-50/50" : isWrong ? "border-red-200 bg-red-50/50" : ""}`}>
                            <p className="mb-3 font-medium">
                              <span className="mr-2 text-muted-foreground">{qi + 1}.</span>
                              {q.question}
                            </p>
                            <div className="space-y-2">
                              {q.options.map((opt, oi) => {
                                const isSelected = userAnswer === oi;
                                const showCorrect = quizSubmitted && oi === q.correct_answer;
                                const showWrong = quizSubmitted && isSelected && oi !== q.correct_answer;
                                return (
                                  <button
                                    key={oi}
                                    type="button"
                                    disabled={quizSubmitted}
                                    onClick={() => setQuizAnswers((prev) => ({ ...prev, [qi]: oi }))}
                                    className={`flex w-full items-center gap-3 rounded-lg border px-4 py-2.5 text-left text-sm transition-all ${
                                      showCorrect ? "border-emerald-300 bg-emerald-100 font-medium text-emerald-800" :
                                      showWrong ? "border-red-300 bg-red-100 text-red-800" :
                                      isSelected ? "border-primary bg-primary/5 font-medium" :
                                      "hover:border-primary/30 hover:bg-muted/50"
                                    }`}
                                  >
                                    <span className={`flex h-6 w-6 items-center justify-center rounded-full border text-xs ${
                                      isSelected ? "border-primary bg-primary text-primary-foreground" : "text-muted-foreground"
                                    }`}>
                                      {String.fromCharCode(65 + oi)}
                                    </span>
                                    {opt}
                                    {showCorrect && <CheckCircle className="ml-auto h-4 w-4 text-emerald-600" />}
                                  </button>
                                );
                              })}
                            </div>
                            {quizSubmitted && q.explanation && (
                              <p className="mt-3 rounded-md bg-muted/50 px-3 py-2 text-sm text-muted-foreground">
                                <strong>Explanation:</strong> {q.explanation}
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    <div className="mt-6 flex gap-3">
                      {!quizSubmitted ? (
                        <Button
                          onClick={() => setQuizSubmitted(true)}
                          disabled={Object.keys(quizAnswers).length < quizQuestions.length}
                          className="bg-purple-600 hover:bg-purple-700 shadow-md shadow-purple-600/25"
                        >
                          Submit Answers
                        </Button>
                      ) : (
                        <Button onClick={handleGenerateQuiz} variant="outline">
                          <Brain className="mr-2 h-4 w-4" />
                          Try Again
                        </Button>
                      )}
                      <Button variant="ghost" onClick={() => { setQuizVisible(false); setQuizSubmitted(false); setQuizAnswers({}); }}>
                        Close Quiz
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Navigation */}
            <Separator className="mb-6" />
            <div className="flex items-center justify-between">
              {prevLesson ? (
                <Button variant="ghost" asChild>
                  <a href={`/courses/${courseId}/lessons/${prevLesson.id}`}>
                    <ChevronLeft className="mr-1 h-4 w-4" /> Previous
                  </a>
                </Button>
              ) : <div />}
              {nextLesson ? (
                <Button asChild className={!completed ? "opacity-70" : ""}>
                  <a href={`/courses/${courseId}/lessons/${nextLesson.id}`}>
                    Next Lesson <ArrowRight className="ml-1 h-4 w-4" />
                  </a>
                </Button>
              ) : (
                <Button variant="outline" asChild>
                  <a href={`/courses/${courseId}`}>
                    Back to Course <ChevronRight className="ml-1 h-4 w-4" />
                  </a>
                </Button>
              )}
            </div>
          </div>

          {/* Sidebar — lesson list + course progress */}
          <aside className="hidden lg:block">
            <Card className="sticky top-16">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                    <ListOrdered className="h-4 w-4" /> Course Progress
                  </CardTitle>
                  <span className="text-xs font-medium text-muted-foreground">{completedCount}/{sorted.length}</span>
                </div>
                <Progress value={courseProgress} className="mt-2 h-2" />
              </CardHeader>
              <Separator />
              <CardContent className="max-h-[60vh] overflow-y-auto p-2">
                <div className="space-y-0.5">
                  {sorted.map((l) => {
                    const isCurrent = l.id === lessonId;
                    const isDone = progressMap[l.id];
                    return (
                      <a
                        key={l.id}
                        href={`/courses/${courseId}/lessons/${l.id}`}
                        className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ${
                          isCurrent
                            ? "bg-primary/10 font-medium text-primary"
                            : isDone
                              ? "text-muted-foreground hover:bg-muted"
                              : "text-foreground hover:bg-muted"
                        }`}
                      >
                        {isDone ? (
                          <CheckCircle className="h-4 w-4 shrink-0 text-emerald-500" />
                        ) : isCurrent ? (
                          <Play className="h-4 w-4 shrink-0 text-primary" />
                        ) : (
                          <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border text-[10px] text-muted-foreground">
                            {l.order_index}
                          </span>
                        )}
                        <span className={`truncate ${isDone && !isCurrent ? "line-through opacity-60" : ""}`}>
                          {l.title}
                        </span>
                        <span className="ml-auto shrink-0 text-[10px] text-muted-foreground">{l.duration_minutes}m</span>
                      </a>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </>
  );
}
