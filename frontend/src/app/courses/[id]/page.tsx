import { Clock, BookOpen, Star, Users, Brain } from "lucide-react";

// Sample data - in production, fetched from Course Service API
const courseData: Record<number, any> = {
  1: {
    id: 1,
    title: "Introduction to Python",
    description: "Learn Python programming from scratch with hands-on exercises. This comprehensive course covers everything from basic syntax to advanced concepts like object-oriented programming and file handling.",
    category: "Programming",
    price: 0.0,
    is_free: true,
    instructor_id: "instructor_1",
    lessons: [
      { id: 1, title: "Getting Started with Python", duration_minutes: 15, order_index: 1 },
      { id: 2, title: "Variables and Data Types", duration_minutes: 20, order_index: 2 },
      { id: 3, title: "Control Flow", duration_minutes: 25, order_index: 3 },
      { id: 4, title: "Functions", duration_minutes: 20, order_index: 4 },
    ],
  },
  2: {
    id: 2,
    title: "Web Development with React",
    description: "Master React.js and build modern web applications. Learn components, hooks, state management, and how to build production-ready apps.",
    category: "Web Development",
    price: 29.99,
    is_free: false,
    instructor_id: "instructor_1",
    lessons: [
      { id: 5, title: "React Fundamentals", duration_minutes: 30, order_index: 1 },
      { id: 6, title: "State Management", duration_minutes: 35, order_index: 2 },
      { id: 7, title: "Building a Full App", duration_minutes: 45, order_index: 3 },
    ],
  },
  3: {
    id: 3,
    title: "Data Science Fundamentals",
    description: "Explore data analysis, visualization, and machine learning basics. Work with real datasets and learn industry tools.",
    category: "Data Science",
    price: 49.99,
    is_free: false,
    instructor_id: "instructor_2",
    lessons: [
      { id: 8, title: "Introduction to Data Science", duration_minutes: 20, order_index: 1 },
      { id: 9, title: "Pandas & NumPy", duration_minutes: 40, order_index: 2 },
      { id: 10, title: "Data Visualization", duration_minutes: 35, order_index: 3 },
    ],
  },
};

export default function CourseDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const courseId = parseInt(params.id);
  const course = courseData[courseId];

  if (!course) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Course Not Found</h1>
        <p className="text-gray-600 mb-8">The course you are looking for does not exist.</p>
        <a href="/courses" className="text-indigo-600 hover:underline">
          ← Back to Courses
        </a>
      </div>
    );
  }

  const totalDuration = course.lessons.reduce(
    (sum: number, l: any) => sum + l.duration_minutes,
    0
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {/* Course Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white rounded-2xl p-8 mb-8">
        <div className="max-w-3xl">
          <span className="text-sm bg-white/20 px-3 py-1 rounded-full">
            {course.category}
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold mt-4 mb-4">
            {course.title}
          </h1>
          <p className="text-indigo-100 text-lg mb-6">{course.description}</p>
          <div className="flex flex-wrap gap-6 text-sm">
            <span className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              {course.lessons.length} lessons
            </span>
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {totalDuration} min total
            </span>
            <span className="flex items-center gap-2">
              <Star className="w-4 h-4" />
              4.8 rating
            </span>
            <span className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              1.2k enrolled
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Syllabus */}
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold mb-6">Course Syllabus</h2>
          <div className="space-y-3">
            {course.lessons.map((lesson: any, index: number) => (
              <a
                key={lesson.id}
                href={`/courses/${course.id}/lessons/${lesson.id}`}
                className="flex items-center justify-between p-4 bg-white rounded-lg border hover:border-indigo-300 hover:shadow-sm transition-all group"
              >
                <div className="flex items-center gap-4">
                  <span className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm font-semibold">
                    {index + 1}
                  </span>
                  <span className="font-medium group-hover:text-indigo-600 transition-colors">
                    {lesson.title}
                  </span>
                </div>
                <span className="text-sm text-gray-500">
                  {lesson.duration_minutes} min
                </span>
              </a>
            ))}
          </div>

          {/* AI Tutor Section */}
          <div className="mt-10">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Brain className="w-6 h-6 text-indigo-600" />
              AI Tutor
            </h2>
            <div className="bg-white rounded-lg border p-6">
              <p className="text-gray-600 mb-4">
                Ask questions about this course and get AI-powered answers.
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ask a question about this course..."
                  className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                />
                <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                  Ask
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div>
          <div className="bg-white rounded-xl border p-6 sticky top-8">
            <div className="text-3xl font-bold text-indigo-600 mb-4">
              {course.is_free ? "Free" : `$${course.price}`}
            </div>
            <button className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors mb-4">
              {course.is_free ? "Enroll for Free" : "Buy Now"}
            </button>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Lessons</span>
                <span className="font-medium">{course.lessons.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Duration</span>
                <span className="font-medium">{totalDuration} min</span>
              </div>
              <div className="flex justify-between">
                <span>Level</span>
                <span className="font-medium">Beginner</span>
              </div>
              <div className="flex justify-between">
                <span>Certificate</span>
                <span className="font-medium">Yes</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
