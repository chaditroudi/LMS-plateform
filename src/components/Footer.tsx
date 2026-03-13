import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">LMS</span>
              </div>
              <span className="font-bold text-xl">LearnHub</span>
            </div>
            <p className="text-gray-400 max-w-sm">
              Empowering learners worldwide with high-quality online education. Join millions of students advancing their careers.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Platform</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/courses" className="hover:text-white transition-colors">Browse Courses</Link></li>
              <li><Link href="/dashboard" className="hover:text-white transition-colors">My Dashboard</Link></li>
              <li><Link href="/register" className="hover:text-white transition-colors">Become an Instructor</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 LearnHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
