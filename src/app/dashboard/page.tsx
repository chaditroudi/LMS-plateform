import Image from "next/image";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { courses, enrolledCourses } from "@/lib/data";

export default function DashboardPage() {
  const myCoursesData = enrolledCourses.map((e) => ({
    ...e,
    course: courses.find((c) => c.id === e.courseId)!,
  })).filter((e) => e.course);

  const totalProgress = Math.round(
    myCoursesData.reduce((sum, e) => sum + e.progress, 0) / myCoursesData.length
  );

  const recentActivity = [
    { action: "Completed lesson", detail: "CSS Selectors", course: "Complete Web Development Bootcamp", time: "2 hours ago" },
    { action: "Started section", detail: "Data Analysis with Pandas", course: "Python for Data Science", time: "1 day ago" },
    { action: "Completed quiz", detail: "Design Principles Quiz", course: "UI/UX Design Masterclass", time: "2 days ago" },
    { action: "Earned certificate", detail: "HTML Fundamentals", course: "Complete Web Development Bootcamp", time: "3 days ago" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-purple-700 to-blue-600 rounded-2xl p-8 text-white mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-2xl">👤</div>
          <div>
            <h1 className="text-2xl font-bold">Welcome back, Student!</h1>
            <p className="text-purple-200">Keep up the great work on your learning journey</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="bg-white/10 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold">{myCoursesData.length}</div>
            <div className="text-sm text-purple-200">Enrolled Courses</div>
          </div>
          <div className="bg-white/10 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold">{totalProgress}%</div>
            <div className="text-sm text-purple-200">Avg. Progress</div>
          </div>
          <div className="bg-white/10 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold">1</div>
            <div className="text-sm text-purple-200">Certificates</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* My Courses */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold text-gray-900 mb-4">My Courses</h2>
          <div className="space-y-4">
            {myCoursesData.map(({ course, progress, lastAccessed }) => (
              <div key={course.id} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-sm transition-shadow">
                <div className="flex gap-4">
                  <div className="relative w-20 h-16 rounded-lg overflow-hidden flex-shrink-0">
                    <Image src={course.thumbnail} alt={course.title} fill className="object-cover" sizes="80px" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link href={`/courses/${course.id}`} className="font-semibold text-gray-900 hover:text-purple-600 transition-colors line-clamp-1">
                      {course.title}
                    </Link>
                    <p className="text-sm text-gray-500 mb-2">{course.instructor}</p>
                    <ProgressBar progress={progress} height="h-1.5" />
                    <p className="text-xs text-gray-400 mt-1">Last accessed: {lastAccessed}</p>
                  </div>
                  <Link
                    href={`/courses/${course.id}`}
                    className="flex-shrink-0 bg-purple-50 text-purple-600 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-purple-100 transition-colors self-start"
                  >
                    Continue
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <Link href="/courses" className="text-purple-600 font-medium text-sm hover:text-purple-700 transition-colors">
              + Explore more courses
            </Link>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Recent Activity */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h2>
            <div className="space-y-3">
              {recentActivity.map((activity, i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-2 h-2 rounded-full bg-purple-500 mt-2 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">{activity.action}:</span> {activity.detail}
                    </p>
                    <p className="text-xs text-gray-400">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Recommended</h2>
            <div className="space-y-3">
              {courses.slice(4, 6).map((course) => (
                <Link key={course.id} href={`/courses/${course.id}`} className="flex gap-3 group">
                  <div className="relative w-16 h-12 rounded overflow-hidden flex-shrink-0">
                    <Image src={course.thumbnail} alt={course.title} fill className="object-cover" sizes="64px" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 group-hover:text-purple-600 transition-colors line-clamp-2">{course.title}</p>
                    <p className="text-xs text-gray-500">${course.price}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
