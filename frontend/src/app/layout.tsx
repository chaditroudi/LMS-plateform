import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LMS Platform - Learning Portal",
  description: "Discover, enroll, and learn from our extensive course catalog",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <nav className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <a href="/" className="text-xl font-bold text-indigo-600">
                📚 LMS Platform
              </a>
              <div className="flex items-center space-x-4">
                <a href="/courses" className="text-gray-700 hover:text-indigo-600 transition-colors">
                  Courses
                </a>
                <a href="/dashboard" className="text-gray-700 hover:text-indigo-600 transition-colors">
                  Dashboard
                </a>
                <a
                  href="/auth/login"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Sign In
                </a>
              </div>
            </div>
          </div>
        </nav>
        <main>{children}</main>
        <footer className="bg-gray-50 border-t mt-16">
          <div className="max-w-7xl mx-auto px-4 py-8 text-center text-gray-500 text-sm">
            © 2024 LMS Platform. Master DevOps & Cloud - M1.
          </div>
        </footer>
      </body>
    </html>
  );
}
