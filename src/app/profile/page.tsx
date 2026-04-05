"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { enrolledCourses, courses } from "@/lib/data";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<"overview" | "settings">("overview");
  const [saved, setSaved] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "Alex",
    lastName: "Student",
    email: "alex@example.com",
    bio: "Passionate learner exploring web development and data science.",
    location: "San Francisco, CA",
    website: "https://alexstudent.dev",
  });

  const myCoursesData = enrolledCourses
    .map((e) => ({ ...e, course: courses.find((c) => c.id === e.courseId)! }))
    .filter((e) => e.course);

  const completedCount = myCoursesData.filter((e) => e.progress === 100).length;
  const avgProgress =
    myCoursesData.length > 0
      ? Math.round(myCoursesData.reduce((s, e) => s + e.progress, 0) / myCoursesData.length)
      : 0;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-purple-700 to-blue-600 rounded-2xl p-8 text-white mb-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="relative">
            <Image
              src="https://picsum.photos/seed/profileuser/120/120"
              alt="Profile avatar"
              width={120}
              height={120}
              className="rounded-full border-4 border-white/30"
            />
            <span className="absolute bottom-1 right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full" />
          </div>
          <div className="text-center sm:text-left">
            <h1 className="text-3xl font-bold">
              {formData.firstName} {formData.lastName}
            </h1>
            <p className="text-purple-200 mt-1">{formData.email}</p>
            <p className="text-purple-100 mt-2 max-w-md">{formData.bio}</p>
            <div className="flex flex-wrap gap-4 mt-4 text-sm text-purple-200">
              {formData.location && (
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {formData.location}
                </span>
              )}
              {formData.website && (
                <a href={formData.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-white transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  Portfolio
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-8">
          <div className="bg-white/10 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold">{myCoursesData.length}</div>
            <div className="text-sm text-purple-200">Courses Enrolled</div>
          </div>
          <div className="bg-white/10 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold">{completedCount}</div>
            <div className="text-sm text-purple-200">Completed</div>
          </div>
          <div className="bg-white/10 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold">{avgProgress}%</div>
            <div className="text-sm text-purple-200">Avg. Progress</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-8">
        {(["overview", "settings"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 text-sm font-medium capitalize transition-colors border-b-2 -mb-px ${
              activeTab === tab
                ? "border-purple-600 text-purple-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="space-y-8">
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">My Courses</h2>
              <Link href="/dashboard" className="text-sm text-purple-600 hover:text-purple-700 font-medium">
                View Dashboard →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {myCoursesData.map(({ course, progress }) => (
                <Link key={course.id} href={`/courses/${course.id}`} className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow group">
                  <div className="text-sm font-medium text-gray-900 mb-1 group-hover:text-purple-600 transition-colors line-clamp-2">
                    {course.title}
                  </div>
                  <div className="text-xs text-gray-500 mb-3">{course.instructor}</div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div
                      className="bg-gradient-to-r from-purple-600 to-blue-500 h-1.5 rounded-full"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{progress}% complete</div>
                </Link>
              ))}
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Certificates</h2>
              <Link href="/certificates" className="text-sm text-purple-600 hover:text-purple-700 font-medium">
                View all →
              </Link>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-6 flex items-center gap-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">🏆</div>
              <div>
                <div className="font-semibold text-gray-900">HTML Fundamentals</div>
                <div className="text-sm text-gray-500">Complete Web Development Bootcamp · Issued Jan 2024</div>
              </div>
              <Link href="/certificates" className="ml-auto text-sm text-purple-600 hover:text-purple-700 font-medium whitespace-nowrap">
                View →
              </Link>
            </div>
          </section>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === "settings" && (
        <form onSubmit={handleSave} className="space-y-6">
          {saved && (
            <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl p-4 text-sm font-medium">
              ✅ Profile updated successfully!
            </div>
          )}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Personal Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Change Password</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="current-password" className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                <input id="current-password" type="password" placeholder="••••••••" className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm" />
              </div>
              <div>
                <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <input id="new-password" type="password" placeholder="Min. 6 characters" className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm" />
              </div>
              <div>
                <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                <input id="confirm-password" type="password" placeholder="••••••••" className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm" />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-gradient-to-r from-purple-600 to-blue-500 text-white px-8 py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity"
            >
              Save Changes
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
