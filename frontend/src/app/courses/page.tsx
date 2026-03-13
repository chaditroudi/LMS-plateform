import { Search, Filter, BookOpen } from "lucide-react";

// Sample courses for static rendering (in production, fetched from API)
const sampleCourses = [
  {
    id: 1,
    title: "Introduction to Python",
    description: "Learn Python programming from scratch with hands-on exercises.",
    category: "Programming",
    price: 0.0,
    is_free: true,
    instructor_id: "instructor_1",
    thumbnail_url: "/images/python.jpg",
  },
  {
    id: 2,
    title: "Web Development with React",
    description: "Master React.js and build modern web applications.",
    category: "Web Development",
    price: 29.99,
    is_free: false,
    instructor_id: "instructor_1",
    thumbnail_url: "/images/react.jpg",
  },
  {
    id: 3,
    title: "Data Science Fundamentals",
    description: "Explore data analysis, visualization, and machine learning basics.",
    category: "Data Science",
    price: 49.99,
    is_free: false,
    instructor_id: "instructor_2",
    thumbnail_url: "/images/datascience.jpg",
  },
  {
    id: 4,
    title: "DevOps & Cloud Computing",
    description: "Learn Docker, Kubernetes, CI/CD, and cloud deployment.",
    category: "DevOps",
    price: 39.99,
    is_free: false,
    instructor_id: "instructor_2",
    thumbnail_url: "/images/devops.jpg",
  },
  {
    id: 5,
    title: "Machine Learning A-Z",
    description: "Comprehensive guide to machine learning algorithms and applications.",
    category: "AI/ML",
    price: 59.99,
    is_free: false,
    instructor_id: "instructor_3",
    thumbnail_url: "/images/ml.jpg",
  },
];

const categories = ["All", "Programming", "Web Development", "Data Science", "DevOps", "AI/ML"];

export default function CoursesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Course Catalog</h1>
        <p className="text-gray-600">Discover courses to advance your skills</p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search courses..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              className="px-4 py-2 rounded-lg border text-sm hover:bg-indigo-50 hover:border-indigo-300 transition-colors"
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sampleCourses.map((course) => (
          <a
            key={course.id}
            href={`/courses/${course.id}`}
            className="bg-white rounded-xl shadow-sm border hover:shadow-lg transition-shadow overflow-hidden group"
          >
            <div className="h-48 bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
              <BookOpen className="w-16 h-16 text-indigo-400 group-hover:scale-110 transition-transform" />
            </div>
            <div className="p-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">
                  {course.category}
                </span>
                {course.is_free && (
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                    Free
                  </span>
                )}
              </div>
              <h3 className="font-semibold text-lg mb-2 group-hover:text-indigo-600 transition-colors">
                {course.title}
              </h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {course.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-indigo-600">
                  {course.is_free ? "Free" : `$${course.price}`}
                </span>
                <span className="text-sm text-gray-500">View Course →</span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
