import { BookOpen, Clock, Award, TrendingUp } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard
          icon={<BookOpen className="w-6 h-6 text-indigo-600" />}
          label="Enrolled Courses"
          value="3"
        />
        <StatCard
          icon={<Clock className="w-6 h-6 text-orange-600" />}
          label="Hours Learned"
          value="24"
        />
        <StatCard
          icon={<Award className="w-6 h-6 text-green-600" />}
          label="Completed"
          value="1"
        />
        <StatCard
          icon={<TrendingUp className="w-6 h-6 text-purple-600" />}
          label="In Progress"
          value="2"
        />
      </div>

      {/* My Courses */}
      <h2 className="text-2xl font-bold mb-6">My Courses</h2>
      <div className="space-y-4">
        <CourseProgress
          title="Introduction to Python"
          progress={75}
          lessons={4}
          completed={3}
        />
        <CourseProgress
          title="Web Development with React"
          progress={33}
          lessons={3}
          completed={1}
        />
        <CourseProgress
          title="Data Science Fundamentals"
          progress={0}
          lessons={3}
          completed={0}
        />
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="bg-white p-6 rounded-xl border">
      <div className="flex items-center gap-3 mb-2">
        {icon}
        <span className="text-sm text-gray-600">{label}</span>
      </div>
      <div className="text-3xl font-bold">{value}</div>
    </div>
  );
}

function CourseProgress({
  title,
  progress,
  lessons,
  completed,
}: {
  title: string;
  progress: number;
  lessons: number;
  completed: number;
}) {
  return (
    <div className="bg-white p-6 rounded-xl border">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-lg">{title}</h3>
        <span className="text-sm text-gray-500">
          {completed}/{lessons} lessons
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-indigo-600 h-2 rounded-full transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="text-right text-sm text-gray-500 mt-1">
        {progress}% complete
      </div>
    </div>
  );
}
