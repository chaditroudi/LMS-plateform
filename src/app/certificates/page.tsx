import Link from "next/link";
import { courses, enrolledCourses } from "@/lib/data";

const certificates = [
  {
    id: "cert-1",
    courseId: "1",
    title: "HTML Fundamentals",
    issuedDate: "January 15, 2024",
    credentialId: "LH-2024-00123",
  },
];

export default function CertificatesPage() {
  const completedCourses = enrolledCourses
    .filter((e) => e.progress === 100)
    .map((e) => courses.find((c) => c.id === e.courseId)!)
    .filter(Boolean);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Certificates</h1>
        <p className="text-gray-500 mt-2">Your earned certificates and achievements</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-5 text-center">
          <div className="text-3xl mb-1">🏆</div>
          <div className="text-2xl font-bold text-gray-900">{certificates.length}</div>
          <div className="text-sm text-gray-500">Certificates Earned</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5 text-center">
          <div className="text-3xl mb-1">📚</div>
          <div className="text-2xl font-bold text-gray-900">{completedCourses.length}</div>
          <div className="text-sm text-gray-500">Courses Completed</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5 text-center">
          <div className="text-3xl mb-1">⭐</div>
          <div className="text-2xl font-bold text-gray-900">{enrolledCourses.length}</div>
          <div className="text-sm text-gray-500">Courses Enrolled</div>
        </div>
      </div>

      {/* Certificates List */}
      {certificates.length > 0 ? (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Earned Certificates</h2>
          {certificates.map((cert) => {
            const course = courses.find((c) => c.id === cert.courseId);
            return (
              <div
                key={cert.id}
                className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                      🏆
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 text-lg">{cert.title}</div>
                      {course && (
                        <div className="text-sm text-purple-600 font-medium">{course.title}</div>
                      )}
                      <div className="text-sm text-gray-500 mt-1">
                        Issued: {cert.issuedDate} · Credential ID: {cert.credentialId}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3 sm:flex-shrink-0">
                    <button className="flex items-center gap-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Download
                    </button>
                    <button className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-500 text-white px-4 py-2 rounded-xl text-sm font-medium hover:opacity-90 transition-opacity">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                      </svg>
                      Share
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🎓</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No certificates yet</h3>
          <p className="text-gray-500 mb-6">Complete a course to earn your first certificate.</p>
          <Link href="/courses" className="bg-gradient-to-r from-purple-600 to-blue-500 text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity inline-block">
            Browse Courses
          </Link>
        </div>
      )}

      {/* In-Progress Courses */}
      {enrolledCourses.filter((e) => e.progress < 100).length > 0 && (
        <div className="mt-10">
          <h2 className="text-xl font-bold text-gray-900 mb-4">In Progress — Finish to Earn a Certificate</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {enrolledCourses
              .filter((e) => e.progress < 100)
              .map((e) => {
                const course = courses.find((c) => c.id === e.courseId);
                if (!course) return null;
                return (
                  <Link key={e.courseId} href={`/courses/${course.id}`} className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow group">
                    <div className="font-medium text-gray-900 mb-1 group-hover:text-purple-600 transition-colors line-clamp-2">
                      {course.title}
                    </div>
                    <div className="text-xs text-gray-500 mb-3">{course.instructor}</div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5 mb-1">
                      <div
                        className="bg-gradient-to-r from-purple-600 to-blue-500 h-1.5 rounded-full"
                        style={{ width: `${e.progress}%` }}
                      />
                    </div>
                    <div className="text-xs text-gray-500">{e.progress}% — {100 - e.progress}% remaining</div>
                  </Link>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
}
