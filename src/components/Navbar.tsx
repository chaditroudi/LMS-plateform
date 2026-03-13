"use client";
import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">LMS</span>
            </div>
            <span className="font-bold text-xl text-gray-900">LearnHub</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-600 hover:text-purple-600 transition-colors">Home</Link>
            <Link href="/courses" className="text-gray-600 hover:text-purple-600 transition-colors">Courses</Link>
            <Link href="/dashboard" className="text-gray-600 hover:text-purple-600 transition-colors">Dashboard</Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Link href="/login" className="text-gray-600 hover:text-purple-600 transition-colors px-4 py-2">Log in</Link>
            <Link href="/register" className="bg-gradient-to-r from-purple-600 to-blue-500 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity">Sign up</Link>
          </div>

          <button
            className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-3 border-t border-gray-100">
            <Link href="/" className="block text-gray-600 hover:text-purple-600 py-2">Home</Link>
            <Link href="/courses" className="block text-gray-600 hover:text-purple-600 py-2">Courses</Link>
            <Link href="/dashboard" className="block text-gray-600 hover:text-purple-600 py-2">Dashboard</Link>
            <Link href="/login" className="block text-gray-600 hover:text-purple-600 py-2">Log in</Link>
            <Link href="/register" className="block bg-gradient-to-r from-purple-600 to-blue-500 text-white px-4 py-2 rounded-lg text-center">Sign up</Link>
          </div>
        )}
      </div>
    </nav>
  );
}
