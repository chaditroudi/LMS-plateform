import { BookOpen, Users, Brain, Shield } from "lucide-react";

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-20 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">
              Learn Without Limits
            </h1>
            <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
              Discover free and premium courses. Learn at your own pace with AI-powered assistance and progress tracking.
            </p>
            <div className="flex justify-center gap-4">
              <a
                href="/courses"
                className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition-colors"
              >
                Browse Courses
              </a>
              <a
                href="/auth/register"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors"
              >
                Get Started
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose Our Platform?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard
            icon={<BookOpen className="w-8 h-8 text-indigo-600" />}
            title="Rich Course Catalog"
            description="Browse through hundreds of courses across programming, data science, DevOps, and more."
          />
          <FeatureCard
            icon={<Brain className="w-8 h-8 text-indigo-600" />}
            title="AI-Powered Tutor"
            description="Get instant answers to your questions with our AI tutor integrated into every course."
          />
          <FeatureCard
            icon={<Users className="w-8 h-8 text-indigo-600" />}
            title="Progress Tracking"
            description="Track your learning journey with detailed progress analytics and completion certificates."
          />
          <FeatureCard
            icon={<Shield className="w-8 h-8 text-indigo-600" />}
            title="Secure & Reliable"
            description="Built with microservices architecture for high availability and data security."
          />
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Learning?</h2>
          <p className="text-gray-600 mb-8">
            Join thousands of learners and start your journey today.
          </p>
          <a
            href="/auth/register"
            className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors inline-block"
          >
            Create Free Account
          </a>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
      <div className="mb-4">{icon}</div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );
}
