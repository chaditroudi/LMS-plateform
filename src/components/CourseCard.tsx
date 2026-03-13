import Image from "next/image";
import Link from "next/link";
import { Course } from "@/lib/data";

interface CourseCardProps {
  course: Course;
}

const levelColors = {
  Beginner: "bg-green-100 text-green-700",
  Intermediate: "bg-yellow-100 text-yellow-700",
  Advanced: "bg-red-100 text-red-700",
};

export default function CourseCard({ course }: CourseCardProps) {
  return (
    <Link href={`/courses/${course.id}`}>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow group">
        <div className="relative h-48 overflow-hidden">
          <Image
            src={course.thumbnail}
            alt={course.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <span className={`absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-medium ${levelColors[course.level]}`}>
            {course.level}
          </span>
        </div>
        <div className="p-4">
          <div className="text-xs text-purple-600 font-medium mb-1">{course.category}</div>
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors">
            {course.title}
          </h3>
          <p className="text-sm text-gray-500 mb-3">{course.instructor}</p>
          <div className="flex items-center space-x-1 mb-3">
            <span className="text-yellow-500 font-semibold text-sm">{course.rating}</span>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg key={star} className={`w-4 h-4 ${star <= Math.round(course.rating) ? "text-yellow-400" : "text-gray-300"}`} fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-gray-500 text-sm">({course.students.toLocaleString()})</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-gray-900">${course.price}</span>
            <span className="text-sm text-gray-500">{course.duration}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
