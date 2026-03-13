import { ChevronLeft, ChevronRight, CheckCircle, BookOpen, Play } from "lucide-react";

const lessonData: Record<number, any> = {
  1: {
    id: 1,
    course_id: 1,
    title: "Getting Started with Python",
    content: `## Welcome to Python Programming!

Python is a versatile, high-level programming language known for its readability and simplicity. In this lesson, we'll set up your development environment and write your first Python program.

### Installing Python

1. Visit [python.org](https://python.org) and download the latest version
2. Run the installer (make sure to check "Add Python to PATH")
3. Open a terminal and verify: \`python --version\`

### Your First Program

Create a file called \`hello.py\` and add:

\`\`\`python
print("Hello, World!")
\`\`\`

Run it with: \`python hello.py\`

### Key Concepts

- **Python** is interpreted, not compiled
- **Indentation** is significant in Python (usually 4 spaces)
- **Comments** start with \`#\`
- Python supports multiple paradigms: procedural, object-oriented, and functional

### Practice Exercise

Try modifying the hello world program to:
1. Print your name
2. Print the result of a simple calculation
3. Use a variable to store a message`,
    duration_minutes: 15,
    order_index: 1,
    video_url: null,
    course_title: "Introduction to Python",
    next_lesson_id: 2,
    prev_lesson_id: null,
  },
  2: {
    id: 2,
    course_id: 1,
    title: "Variables and Data Types",
    content: `## Variables and Data Types in Python

Variables are containers for storing data values. Python has several built-in data types.

### Creating Variables

\`\`\`python
name = "Alice"        # String
age = 25              # Integer  
height = 5.7          # Float
is_student = True     # Boolean
\`\`\`

### Data Types

| Type | Example | Description |
|------|---------|-------------|
| str | "hello" | Text strings |
| int | 42 | Whole numbers |
| float | 3.14 | Decimal numbers |
| bool | True/False | Boolean values |
| list | [1, 2, 3] | Ordered collection |
| dict | {"key": "val"} | Key-value pairs |

### Type Checking

\`\`\`python
x = 42
print(type(x))  # <class 'int'>
\`\`\`

### Practice

Create variables of each type and experiment with type conversions.`,
    duration_minutes: 20,
    order_index: 2,
    video_url: null,
    course_title: "Introduction to Python",
    next_lesson_id: 3,
    prev_lesson_id: 1,
  },
};

export default async function LessonPage({
  params,
}: {
  params: Promise<{ id: string; lessonId: string }>;
}) {
  const { lessonId: lessonIdStr } = await params;
  const lessonId = parseInt(lessonIdStr);
  const lesson = lessonData[lessonId];

  if (!lesson) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Lesson Not Found</h1>
        <a href="/courses" className="text-indigo-600 hover:underline">
          ← Back to Courses
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <a href="/courses" className="hover:text-indigo-600">Courses</a>
        <span>/</span>
        <a href={`/courses/${lesson.course_id}`} className="hover:text-indigo-600">
          {lesson.course_title}
        </a>
        <span>/</span>
        <span className="text-gray-900">{lesson.title}</span>
      </div>

      {/* Lesson Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">{lesson.title}</h1>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <BookOpen className="w-4 h-4" />
              Lesson {lesson.order_index}
            </span>
            <span>{lesson.duration_minutes} min read</span>
          </div>
        </div>
        <button className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
          <CheckCircle className="w-4 h-4" />
          Mark Complete
        </button>
      </div>

      {/* Video Player Placeholder */}
      {lesson.video_url && (
        <div className="bg-gray-900 rounded-xl aspect-video flex items-center justify-center mb-8">
          <Play className="w-16 h-16 text-white" />
        </div>
      )}

      {/* Lesson Content */}
      <div className="bg-white rounded-xl border p-8 prose prose-indigo max-w-none mb-8">
        <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
          {lesson.content}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center pt-6 border-t">
        {lesson.prev_lesson_id ? (
          <a
            href={`/courses/${lesson.course_id}/lessons/${lesson.prev_lesson_id}`}
            className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            Previous Lesson
          </a>
        ) : (
          <div />
        )}
        {lesson.next_lesson_id ? (
          <a
            href={`/courses/${lesson.course_id}/lessons/${lesson.next_lesson_id}`}
            className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            Next Lesson
            <ChevronRight className="w-5 h-5" />
          </a>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}
