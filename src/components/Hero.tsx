import Link from "next/link";

export default function Hero() {
  return (
    <section className="bg-gradient-to-br from-purple-900 via-purple-700 to-blue-600 text-white py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-3xl">
          <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
            <span className="text-yellow-300 mr-2">⭐</span>
            <span className="text-sm">Trusted by 500,000+ learners worldwide</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Unlock Your
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-400"> Potential</span>
            <br />with Expert-Led Courses
          </h1>
          <p className="text-lg text-purple-100 mb-8 max-w-2xl">
            Access thousands of courses taught by industry experts. Learn at your own pace, earn certificates, and advance your career.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/courses" className="bg-white text-purple-700 font-semibold px-8 py-4 rounded-xl hover:bg-purple-50 transition-colors text-center">
              Browse Courses
            </Link>
            <Link href="/register" className="border-2 border-white text-white font-semibold px-8 py-4 rounded-xl hover:bg-white/10 transition-colors text-center">
              Start for Free
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
