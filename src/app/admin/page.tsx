"use client";
import { useState } from "react";
import { courses as initialCourses, Course } from "@/lib/data";

export default function AdminPage() {
  const [courseList, setCourseList] = useState<Course[]>(initialCourses);
  const [showModal, setShowModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [formData, setFormData] = useState({ title: "", instructor: "", category: "", level: "Beginner" as Course["level"], price: "" });
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = courseList.filter(
    (c) =>
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.instructor.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openAdd = () => {
    setEditingCourse(null);
    setFormData({ title: "", instructor: "", category: "", level: "Beginner", price: "" });
    setShowModal(true);
  };

  const openEdit = (course: Course) => {
    setEditingCourse(course);
    setFormData({ title: course.title, instructor: course.instructor, category: course.category, level: course.level, price: String(course.price) });
    setShowModal(true);
  };

  const handleSave = () => {
    if (!formData.title || !formData.instructor || !formData.category || !formData.price) return;
    if (editingCourse) {
      setCourseList((prev) => prev.map((c) => c.id === editingCourse.id ? { ...c, ...formData, price: parseFloat(formData.price) } : c));
    } else {
      const newCourse: Course = {
        ...initialCourses[0],
        id: String(Date.now()),
        title: formData.title,
        instructor: formData.instructor,
        category: formData.category,
        level: formData.level,
        price: parseFloat(formData.price),
        students: 0,
        rating: 0,
        thumbnail: `https://picsum.photos/seed/${Date.now()}/600/400`,
      };
      setCourseList((prev) => [newCourse, ...prev]);
    }
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    setCourseList((prev) => prev.filter((c) => c.id !== id));
    setDeleteConfirm(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
          <p className="text-gray-500 text-sm mt-1">Manage courses and content</p>
        </div>
        <button onClick={openAdd} className="bg-gradient-to-r from-purple-600 to-blue-500 text-white px-5 py-2.5 rounded-xl font-medium hover:opacity-90 transition-opacity flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Course
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Courses", value: courseList.length, icon: "📚" },
          { label: "Total Students", value: courseList.reduce((s, c) => s + c.students, 0).toLocaleString(), icon: "👨‍🎓" },
          { label: "Avg. Rating", value: (courseList.reduce((s, c) => s + c.rating, 0) / courseList.length).toFixed(1), icon: "⭐" },
          { label: "Total Revenue", value: "$" + courseList.reduce((s, c) => s + c.price * c.students, 0).toLocaleString(), icon: "💰" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="text-2xl mb-2">{stat.icon}</div>
            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
            <div className="text-sm text-gray-500">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Course</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3 hidden md:table-cell">Category</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3 hidden md:table-cell">Level</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Students</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Price</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Rating</th>
                <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((course) => (
                <tr key={course.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900 text-sm line-clamp-1">{course.title}</div>
                    <div className="text-xs text-gray-500">{course.instructor}</div>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell">
                    <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700">{course.category}</span>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell">
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${course.level === "Beginner" ? "bg-green-100 text-green-700" : course.level === "Intermediate" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}>
                      {course.level}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{course.students.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">${course.price}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">⭐ {course.rating}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => openEdit(course)} className="text-blue-600 hover:text-blue-700 text-sm font-medium px-3 py-1 rounded-lg hover:bg-blue-50 transition-colors">Edit</button>
                      {deleteConfirm === course.id ? (
                        <div className="flex gap-1">
                          <button onClick={() => handleDelete(course.id)} className="text-white bg-red-500 text-sm font-medium px-3 py-1 rounded-lg hover:bg-red-600 transition-colors">Confirm</button>
                          <button onClick={() => setDeleteConfirm(null)} className="text-gray-600 text-sm font-medium px-3 py-1 rounded-lg hover:bg-gray-100 transition-colors">Cancel</button>
                        </div>
                      ) : (
                        <button onClick={() => setDeleteConfirm(course.id)} className="text-red-600 hover:text-red-700 text-sm font-medium px-3 py-1 rounded-lg hover:bg-red-50 transition-colors">Delete</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h2 className="text-xl font-bold text-gray-900 mb-6">{editingCourse ? "Edit Course" : "Add New Course"}</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Course Title</label>
                <input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="e.g. Advanced JavaScript" className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Instructor</label>
                <input value={formData.instructor} onChange={(e) => setFormData({ ...formData, instructor: e.target.value })} placeholder="Instructor name" className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm">
                  <option value="">Select category</option>
                  <option>Web Development</option>
                  <option>Data Science</option>
                  <option>Design</option>
                  <option>Business</option>
                  <option>Marketing</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
                  <select value={formData.level} onChange={(e) => setFormData({ ...formData, level: e.target.value as Course["level"] })} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm">
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                  <input type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} placeholder="99.99" className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm" />
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors">Cancel</button>
              <button onClick={handleSave} className="flex-1 bg-gradient-to-r from-purple-600 to-blue-500 text-white px-4 py-2.5 rounded-xl font-medium hover:opacity-90 transition-opacity">Save Course</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
