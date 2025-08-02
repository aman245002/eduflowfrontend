import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { URLS } from '@/config/urls';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import AppLayout from "@/components/layout/AppLayout";
import {
  BookOpen,
  Users,
  Trophy,
  Star,
  Clock,
  Play,
  ArrowRight,
  CheckCircle,
  Globe,
  Zap,
  Shield,
} from "lucide-react";

const features = [
  {
    icon: Globe,
    title: "Global Access",
    description: "Learn from anywhere, anytime with our cloud-based platform",
  },
  {
    icon: Users,
    title: "Expert Instructors",
    description: "Learn from industry professionals and subject matter experts",
  },
  {
    icon: Zap,
    title: "Interactive Learning",
    description: "Engage with hands-on projects, quizzes, and peer discussions",
  },
  {
    icon: Trophy,
    title: "Certificates",
    description:
      "Earn recognized certificates upon successful course completion",
  },
  {
    icon: Shield,
    title: "Lifetime Access",
    description: "Get unlimited access to course materials and future updates",
  },
  {
    icon: CheckCircle,
    title: "Progress Tracking",
    description: "Monitor your learning journey with detailed analytics",
  },
];

const stats = [
  { label: "Active Students", value: "500K+" },
  { label: "Expert Instructors", value: "1,200+" },
  { label: "Course Hours", value: "50,000+" },
  { label: "Countries", value: "120+" },
];

export default function Index() {
  // const [featuredCourses, setFeaturedCourses] = useState<any[]>([]);

  // useEffect(() => {
  //   const fetchFeatured = async () => {
  //     try {
  //       const res = await fetch(URLS.API.COURSES.UPDATE('featured'));
  //       const data = await res.json();
  //       if (data.success) setFeaturedCourses(data.data);
  //     } catch (err) {
  //       console.error("Failed to load featured courses", err);
  //     }
  //   };
  //   fetchFeatured();
  // }, []);
  return (
    <AppLayout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="container px-4 py-24 md:py-32">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-16">
            <div className="flex flex-col justify-center space-y-8">
              <div className="space-y-6">
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                  Learn Without
                  <span className="text-primary"> Limits</span>
                </h1>
                <p className="text-xl text-muted-foreground sm:text-2xl">
                  Join millions of learners worldwide and unlock your potential
                  with our comprehensive online courses.
                </p>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row">
                <Button size="lg" className="text-lg px-8 py-6" asChild>
                  <Link to="/courses">
                    Explore Courses
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="text-lg px-8 py-6"
                >
                  <Play className="mr-2 h-5 w-5" />
                  Watch Demo
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-6 pt-8 md:grid-cols-4">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl font-bold text-primary">
                      {stat.value}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-accent/20 rounded-3xl blur-3xl"></div>
              <div className="relative rounded-2xl bg-card shadow-2xl overflow-hidden">
                <div className="relative aspect-video">
                  <img
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=450&fit=crop&crop=entropy"
                    alt="Students learning together"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Button
                      size="lg"
                      className="rounded-full p-6 bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white/30"
                    >
                      <Play className="h-8 w-8 text-white" />
                    </Button>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="text-white">
                      <p className="text-sm font-medium mb-2">
                        Watch: How EduFlow Works
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Course Progress</span>
                        <span className="text-sm">75%</span>
                      </div>
                      <div className="h-2 rounded-full bg-white/20 mt-2">
                        <div className="h-2 w-3/4 rounded-full bg-white"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24">
        <div className="container px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Why Choose EduFlow?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Experience the future of online learning with our cutting-edge
              platform designed for success.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="border-0 shadow-md">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-semibold">{feature.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      {/* <section className="py-24 bg-muted/40">
        <div className="container px-4">
          <div className="flex items-center justify-between mb-12">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tight">
                Featured Courses
              </h2>
              <p className="text-muted-foreground">
                Discover our most popular and highly-rated courses
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link to="/courses">
                View All Courses
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredCourses.map((course) => (
              <Card
                key={course._id}
                className="overflow-hidden group cursor-pointer"
              >
                <div className="relative">
                  <img
                    src={URLS.FILES.THUMBNAIL(course.thumbnail_url)}
                    alt={course.title}
                    className="w-full h-48 object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge variant="secondary" className="bg-background/90">
                      {course.category.replace(/-/g, " ")}
                    </Badge>
                  </div>
                  <div className="absolute top-4 right-4">
                    <Badge variant="outline" className="bg-background/90">
                      {course.difficulty}
                    </Badge>
                  </div>
                </div>

                <CardContent className="p-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg leading-tight">
                      {course.title}
                    </h3>

                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>{course.instructor_name || "Instructor"}</span>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{course.duration || "~"}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">
                          {course.rating || 4.5}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4" />
                        <span className="text-sm text-muted-foreground">
                          {course.enrollments?.toLocaleString() || 0} students
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-x-2">
                        <span className="text-2xl font-bold text-primary">
                          ${course.price}
                        </span>
                        {course.originalPrice && (
                          <span className="text-sm text-muted-foreground line-through">
                            ${course.originalPrice}
                          </span>
                        )}
                      </div>
                      <Button size="sm">
                        <BookOpen className="mr-2 h-4 w-4" />
                        Enroll Now
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section> */}

      {/* Testimonials Section */}
      <section className="py-24">
        <div className="container px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              What Our Students Say
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join thousands of successful learners who have transformed their
              careers with EduFlow
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-center space-x-4 mb-6">
                  <img
                    src="https://images.unsplash.com/photo-1494790108755-2616b612b5f5?w=60&h=60&fit=crop&crop=face"
                    alt="Sarah Wilson"
                    className="w-14 h-14 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-semibold">Sarah Wilson</h4>
                    <p className="text-sm text-muted-foreground">
                      Frontend Developer at Google
                    </p>
                  </div>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  "EduFlow completely transformed my understanding of React. The
                  instructor's teaching style and practical projects helped me
                  land my dream job at Google. Highly recommended!"
                </p>
                <div className="flex items-center mt-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className="h-4 w-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-center space-x-4 mb-6">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face"
                    alt="Michael Chen"
                    className="w-14 h-14 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-semibold">Michael Chen</h4>
                    <p className="text-sm text-muted-foreground">
                      Data Scientist at Microsoft
                    </p>
                  </div>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  "The Machine Learning course was incredibly comprehensive. I
                  went from zero knowledge to building my own ML models. The
                  certificate helped me transition into data science."
                </p>
                <div className="flex items-center mt-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className="h-4 w-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-center space-x-4 mb-6">
                  <img
                    src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&h=60&fit=crop&crop=face"
                    alt="Emily Rodriguez"
                    className="w-14 h-14 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-semibold">Emily Rodriguez</h4>
                    <p className="text-sm text-muted-foreground">
                      UX Designer at Airbnb
                    </p>
                  </div>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  "Amazing design course! The practical exercises and real-world
                  projects prepared me perfectly for my role at Airbnb. The
                  community support was fantastic too."
                </p>
                <div className="flex items-center mt-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className="h-4 w-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Learning Journey Section */}
      <section className="py-24 bg-muted/40">
        <div className="container px-4">
          <div className="grid gap-16 lg:grid-cols-2 lg:gap-24 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                  Your Learning Journey Starts Here
                </h2>
                <p className="text-xl text-muted-foreground">
                  Experience a personalized learning path designed to help you
                  achieve your career goals with hands-on projects and expert
                  guidance.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <span className="text-sm font-bold">1</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">
                      Choose Your Course
                    </h3>
                    <p className="text-muted-foreground">
                      Browse our extensive library of courses and find the
                      perfect match for your learning goals.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <span className="text-sm font-bold">2</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Learn by Doing</h3>
                    <p className="text-muted-foreground">
                      Engage with interactive lessons, hands-on projects, and
                      real-world case studies.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <span className="text-sm font-bold">3</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Earn Your Badge</h3>
                    <p className="text-muted-foreground">
                      Complete assessments and earn industry-recognized
                      certificates to showcase your new skills.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=800&fit=crop&crop=entropy"
                alt="Students learning together"
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute -top-6 -right-6 bg-white rounded-lg p-4 shadow-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center">
                    <Trophy className="h-6 w-6 text-success" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Certificate Earned!</p>
                    <p className="text-xs text-muted-foreground">
                      React Development
                    </p>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white rounded-lg p-4 shadow-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">500K+ Students</p>
                    <p className="text-xs text-muted-foreground">
                      Learning together
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container px-4">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary to-accent p-8 md:p-16">
            <div className="relative z-10 text-center space-y-6">
              <h2 className="text-3xl font-bold text-primary-foreground sm:text-4xl">
                Ready to Start Learning?
              </h2>
              <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto">
                Join thousands of learners who have transformed their careers
                with our expert-led courses.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                <Button
                  size="lg"
                  variant="secondary"
                  className="text-lg px-8 py-6"
                  asChild
                >
                  <Link to="/courses">
                    Browse Courses
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </AppLayout>
  );
}
