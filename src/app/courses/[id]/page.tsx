"use client";
import { useState } from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { courses } from "@/lib/data";

export default function CourseDetailPage({ params }: { params: { id: string } }) {
  const course = courses.find((c) => c.id === params.id);
  const [openSection, setOpenSection] = useState<string | null>("s1");
  const [enrolled, setEnrolled] = useState(false);

  if (!course) notFound();

  const totalLessons = course.curriculum.reduce((acc, s) => acc + s.lessons.length, 0);

  return (
    <div>
      {/* Course Header */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="text-sm text-purple-400 mb-2">{course.category}</div>
            <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
            <p className="text-gray-300 mb-6">{course.description}</p>
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <span className="text-yellow-400 font-semibold">{course.rating}</span>
                <div className="flex">
                  {[1,2,3,4,5].map(s => (
                    <svg key={s} className={`w-4 h-4 ${s <= Math.round(course.rating) ? "text-yellow-400" : "text-gray-600"}`} fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-gray-400">({course.students.toLocaleString()} students)</span>
              </div>
              <span className="text-gray-300">⏱ {course.duration}</span>
              <span className={`px-2 py-0.5 rounded-full text-xs ${course.level === "Beginner" ? "bg-green-600" : course.level === "Intermediate" ? "bg-yellow-600" : "bg-red-600"}`}>{course.level}</span>
            </div>
            <div className="mt-4 text-sm text-gray-400">Instructor: <span className="text-white">{course.instructor}</span></div>
          </div>

          {/* Enrollment Card */}
          <div className="bg-white text-gray-900 rounded-xl p-6 h-fit shadow-2xl">
            <div className="relative h-40 rounded-lg overflow-hidden mb-4">
              <Image src={course.thumbnail} alt={course.title} fill className="object-cover" sizes="400px" />
            </div>
            <div className="text-3xl font-bold mb-4">${course.price}</div>
            <button
              onClick={() => setEnrolled(!enrolled)}
              className={`w-full py-3 rounded-xl font-semibold mb-3 transition-all ${enrolled ? "bg-green-500 text-white" : "bg-gradient-to-r from-purple-600 to-blue-500 text-white hover:opacity-90"}`}
            >
              {enrolled ? "✓ Enrolled" : "Enroll Now"}
            </button>
            <p className="text-center text-sm text-gray-500 mb-4">30-Day Money-Back Guarantee</p>
            <ul className="text-sm space-y-2 text-gray-600">
              <li>✅ {totalLessons} lessons</li>
              <li>✅ {course.duration} of video content</li>
              <li>✅ Certificate of completion</li>
              <li>✅ Lifetime access</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* What You'll Learn */}
          <section className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">What You&apos;ll Learn</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {course.tags.map((tag) => (
                <div key={tag} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <span>Master {tag} concepts and techniques</span>
                </div>
              ))}
              <div className="flex items-start gap-2 text-sm text-gray-700">
                <span className="text-green-500 mt-0.5">✓</span>
                <span>Build real-world projects for your portfolio</span>
              </div>
              <div className="flex items-start gap-2 text-sm text-gray-700">
                <span className="text-green-500 mt-0.5">✓</span>
                <span>Get industry-ready skills and certification</span>
              </div>
            </div>
          </section>

          {/* Curriculum */}
          <section className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Course Curriculum</h2>
            <p className="text-gray-500 text-sm mb-6">{course.curriculum.length} sections • {totalLessons} lessons</p>
            <div className="space-y-3">
              {course.curriculum.map((section) => (
                <div key={section.id} className="border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setOpenSection(openSection === section.id ? null : section.id)}
                    className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
                  >
                    <div>
                      <span className="font-medium text-gray-900">{section.title}</span>
                      <span className="text-sm text-gray-500 ml-2">({section.lessons.length} lessons)</span>
                    </div>
                    <svg className={`w-5 h-5 text-gray-500 transition-transform ${openSection === section.id ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {openSection === section.id && (
                    <div className="divide-y divide-gray-100">
                      {section.lessons.map((lesson) => (
                        <div key={lesson.id} className="flex items-center justify-between p-4 hover:bg-gray-50">
                          <div className="flex items-center gap-3">
                            <span className="text-lg">
                              {lesson.type === "video" ? "▶️" : lesson.type === "quiz" ? "📝" : "📖"}
                            </span>
                            <span className="text-sm text-gray-700">{lesson.title}</span>
                          </div>
                          <span className="text-xs text-gray-500">{lesson.duration}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Instructor Card */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Your Instructor</h2>
            <div className="flex items-center gap-4 mb-4">
              <Image
                src={course.instructorAvatar}
                alt={course.instructor}
                width={64}
                height={64}
                className="rounded-full"
              />
              <div>
                <div className="font-semibold text-gray-900">{course.instructor}</div>
                <div className="text-sm text-gray-500">{course.category} Expert</div>
              </div>
            </div>
            <p className="text-sm text-gray-600">{course.instructorBio}</p>
          </div>

          {/* Course Stats */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Course Stats</h2>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-gray-500">Students enrolled</dt>
                <dd className="font-medium">{course.students.toLocaleString()}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Duration</dt>
                <dd className="font-medium">{course.duration}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Level</dt>
                <dd className="font-medium">{course.level}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Rating</dt>
                <dd className="font-medium">{course.rating} / 5.0</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
