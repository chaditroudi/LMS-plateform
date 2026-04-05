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
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,hsl(var(--primary)/0.12),transparent)]" />
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="secondary" className="mb-6 gap-1.5 px-3 py-1.5 text-sm">
              <Sparkles className="h-3.5 w-3.5" />
              AI-Powered Learning Platform
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
              Learn Without{" "}
              <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                Limits
              </span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground sm:text-xl">
              Discover free and premium courses. Learn at your own pace with AI-powered tutoring, real-time progress tracking, and personalized recommendations.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" className="gap-2 text-base" asChild>
                <a href="/courses">
                  Browse Courses
                  <ArrowRight className="h-4 w-4" />
                </a>
              </Button>
              <Button variant="outline" size="lg" className="gap-2 text-base" asChild>
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
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Everything you need to succeed
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Built with modern microservices architecture for a seamless learning experience.
          </p>
        </div>
        <div className="mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <FeatureCard
            icon={<BookOpen className="h-6 w-6" />}
            title="Rich Course Catalog"
            description="Browse hundreds of courses across programming, data science, DevOps, and more."
          />
          <FeatureCard
            icon={<Brain className="h-6 w-6" />}
            title="AI-Powered Tutor"
            description="Get instant contextual answers with our AI tutor integrated into every course."
          />
          <FeatureCard
            icon={<Users className="h-6 w-6" />}
            title="Progress Tracking"
            description="Track your journey with detailed analytics, completion rates, and insights."
          />
          <FeatureCard
            icon={<Shield className="h-6 w-6" />}
            title="Secure & Reliable"
            description="Built with microservices for high availability, security, and performance."
          />
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y bg-muted/30">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-8 px-4 py-16 sm:px-6 lg:grid-cols-4 lg:px-8">
          {[
            { value: "500+", label: "Courses" },
            { value: "10K+", label: "Students" },
            { value: "50+", label: "Instructors" },
            { value: "95%", label: "Satisfaction" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-bold text-primary sm:text-4xl">{stat.value}</div>
              <div className="mt-1 text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <Card className="overflow-hidden border-0 bg-gradient-to-r from-primary to-purple-600 text-primary-foreground shadow-xl">
          <CardContent className="flex flex-col items-center p-12 text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">Ready to Start Learning?</h2>
            <p className="mt-4 max-w-xl text-lg text-primary-foreground/80">
              Join thousands of learners and transform your career today. It&apos;s free to get started.
            </p>
            <Button size="lg" variant="secondary" className="mt-8 gap-2 text-base font-semibold" asChild>
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
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Card className="group relative overflow-hidden transition-all hover:shadow-md">
      <CardContent className="p-6">
        <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
          {icon}
        </div>
        <h3 className="mb-2 font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
