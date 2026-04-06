/**
 * Home Page — /
 *
 * Static marketing landing page rendered as a React Server Component.
 * Contains three sections:
 *   1. Hero     — Headline, sub-headline, and primary CTAs.
 *   2. Features — Four feature cards highlighting platform capabilities.
 *   3. CTA      — Secondary call-to-action encouraging free registration.
 *
 * The FeatureCard sub-component is defined in this file to keep the
 * component tree simple — it is not reused anywhere else.
 */

import React from "react";
import { BookOpen, Users, Brain, Shield, ArrowRight, Sparkles, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b bg-gradient-to-b from-primary/5 via-background to-background">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,hsl(var(--primary)/0.15),transparent)]" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM2MzY2ZjEiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-50" />
        <div className="relative mx-auto max-w-7xl px-4 py-28 sm:px-6 sm:py-36 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="secondary" className="mb-6 gap-1.5 px-4 py-2 text-sm animate-fade-in shadow-sm">
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
              AI-Powered Learning Platform
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl animate-fade-in-up">
              Learn Without{" "}
              <span className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Limits
              </span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground sm:text-xl animate-fade-in-up stagger-2">
              Discover free and premium courses. Learn at your own pace with AI-powered tutoring, real-time progress tracking, and personalized recommendations.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row animate-fade-in-up stagger-3">
              <Button size="lg" className="gap-2 text-base shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5" asChild>
                <a href="/courses">
                  Browse Courses
                  <ArrowRight className="h-4 w-4" />
                </a>
              </Button>
              <Button variant="outline" size="lg" className="gap-2 text-base transition-all hover:-translate-y-0.5" asChild>
                <a href="/auth/register">
                  <Play className="h-4 w-4" />
                  Get Started Free
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="outline" className="mb-4">Features</Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Everything you need to succeed
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Built with modern microservices architecture for a seamless learning experience.
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <FeatureCard
            icon={<BookOpen className="h-6 w-6" />}
            title="Rich Course Catalog"
            description="Browse hundreds of courses across programming, data science, DevOps, and more."
            delay="stagger-1"
          />
          <FeatureCard
            icon={<Brain className="h-6 w-6" />}
            title="AI-Powered Tutor"
            description="Get instant contextual answers with our AI tutor integrated into every course."
            delay="stagger-2"
          />
          <FeatureCard
            icon={<Users className="h-6 w-6" />}
            title="Progress Tracking"
            description="Track your journey with detailed analytics, completion rates, and insights."
            delay="stagger-3"
          />
          <FeatureCard
            icon={<Shield className="h-6 w-6" />}
            title="Secure & Reliable"
            description="Built with microservices for high availability, security, and performance."
            delay="stagger-4"
          />
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y bg-gradient-to-r from-muted/40 via-muted/60 to-muted/40">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-8 px-4 py-16 sm:px-6 lg:grid-cols-4 lg:px-8">
          {[
            { value: "500+", label: "Courses", color: "text-primary" },
            { value: "10K+", label: "Students", color: "text-emerald-600" },
            { value: "50+", label: "Instructors", color: "text-amber-600" },
            { value: "95%", label: "Satisfaction", color: "text-purple-600" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className={`text-3xl font-bold ${stat.color} sm:text-4xl`}>{stat.value}</div>
              <div className="mt-1 text-sm font-medium text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <Card className="overflow-hidden border-0 bg-gradient-to-br from-primary via-purple-600 to-pink-600 text-primary-foreground shadow-2xl shadow-primary/20">
          <CardContent className="flex flex-col items-center p-12 text-center sm:p-16">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
              <Sparkles className="h-8 w-8" />
            </div>
            <h2 className="text-3xl font-bold sm:text-4xl">Ready to Start Learning?</h2>
            <p className="mt-4 max-w-xl text-lg text-primary-foreground/80">
              Join thousands of learners and transform your career today. It&apos;s free to get started.
            </p>
            <Button size="lg" variant="secondary" className="mt-8 gap-2 text-base font-semibold shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl" asChild>
              <a href="/auth/register">
                Create Free Account
                <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  delay,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay?: string;
}) {
  return (
    <Card className={`group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 animate-fade-in-up ${delay || ""}`}>
      <CardContent className="p-6">
        <div className="mb-4 inline-flex rounded-xl bg-gradient-to-br from-primary/10 to-purple-100 p-3 text-primary transition-all duration-300 group-hover:from-primary group-hover:to-purple-600 group-hover:text-primary-foreground group-hover:shadow-md group-hover:shadow-primary/25">
          {icon}
        </div>
        <h3 className="mb-2 font-semibold">{title}</h3>
        <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
      </CardContent>
      <div className="absolute inset-x-0 bottom-0 h-0.5 scale-x-0 bg-gradient-to-r from-primary to-purple-600 transition-transform duration-300 group-hover:scale-x-100" />
    </Card>
  );
}
