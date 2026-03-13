const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost";

export async function fetchCourses(params?: {
  search?: string;
  category?: string;
  is_free?: boolean;
  page?: number;
}) {
  const searchParams = new URLSearchParams();
  if (params?.search) searchParams.set("search", params.search);
  if (params?.category) searchParams.set("category", params.category);
  if (params?.is_free !== undefined)
    searchParams.set("is_free", String(params.is_free));
  if (params?.page) searchParams.set("page", String(params.page));

  const res = await fetch(
    `${API_BASE}/api/courses?${searchParams.toString()}`,
    { cache: "no-store" }
  );
  if (!res.ok) throw new Error("Failed to fetch courses");
  return res.json();
}

export async function fetchCourse(id: number) {
  const res = await fetch(`${API_BASE}/api/courses/${id}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch course");
  return res.json();
}

export async function fetchLessons(courseId: number) {
  const res = await fetch(`${API_BASE}/api/courses/${courseId}/lessons`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch lessons");
  return res.json();
}

export async function login(email: string, password: string) {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error("Login failed");
  return res.json();
}

export async function register(
  name: string,
  email: string,
  password: string
) {
  const res = await fetch(`${API_BASE}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
  if (!res.ok) throw new Error("Registration failed");
  return res.json();
}

export async function chatWithAI(courseId: number, message: string) {
  const res = await fetch(`${API_BASE}/api/ai/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ course_id: courseId, message }),
  });
  if (!res.ok) throw new Error("AI chat failed");
  return res.json();
}
