import Image from "next/image";
import Link from "next/link";
import Hero from "@/components/Hero";
import CourseCard from "@/components/CourseCard";
import { courses, testimonials } from "@/lib/data";

const stats = [
  { label: "Students", value: "500K+", icon: "👨‍🎓" },
  { label: "Courses", value: "2,000+", icon: "📚" },
  { label: "Instructors", value: "500+", icon: "👨‍🏫" },
  { label: "Countries", value: "150+", icon: "🌍" },
];

export default function HomePage() {
  const featuredCourses = courses.slice(0, 4);

  return (
    <div>
      <Hero />

      {/* Stats Section */}
      <section className="bg-white py-16 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl mb-2">{stat.icon}</div>
                <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-gray-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Featured Courses</h2>
              <p className="text-gray-500 mt-2">Expand your skills with our top-rated courses</p>
            </div>
            <Link href="/courses" className="text-purple-600 font-medium hover:text-purple-700 transition-colors hidden sm:block">
              View all courses →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">Browse by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { name: "Web Development", icon: "💻", count: 342 },
              { name: "Data Science", icon: "📊", count: 215 },
              { name: "Design", icon: "🎨", count: 189 },
              { name: "Business", icon: "💼", count: 278 },
              { name: "Marketing", icon: "📱", count: 156 },
            ].map((cat) => (
              <Link
                key={cat.name}
                href={`/courses?category=${encodeURIComponent(cat.name)}`}
                className="bg-gray-50 rounded-xl p-6 text-center hover:bg-purple-50 hover:border-purple-200 border border-transparent transition-all group"
              >
                <div className="text-3xl mb-3">{cat.icon}</div>
                <div className="font-semibold text-gray-900 group-hover:text-purple-700 text-sm">{cat.name}</div>
                <div className="text-gray-500 text-xs mt-1">{cat.count} courses</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">What Our Students Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center space-x-1 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-600 mb-4 italic">&ldquo;{testimonial.content}&rdquo;</p>
                <div className="flex items-center space-x-3">
                  <Image
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-purple-700 to-blue-600 py-16 px-4">
        <div className="max-w-3xl mx-auto text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Start Learning Today</h2>
          <p className="text-purple-100 mb-8">Join over 500,000 students already learning on LearnHub</p>
          <Link href="/register" className="bg-white text-purple-700 font-semibold px-8 py-4 rounded-xl hover:bg-purple-50 transition-colors inline-block">
            Get Started for Free
          </Link>
        </div>
      </section>
    </div>
  );
}
