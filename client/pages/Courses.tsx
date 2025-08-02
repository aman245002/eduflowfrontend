import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { URLS } from '@/config/urls';
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BookOpen, Search, Grid3X3, List } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";

const categories = [
  "All Categories",
  "Web Development",
  "Data Science",
  "Design",
  "Marketing",
  "Technology",
  "Business",
];

const levels = ["All Levels", "Beginner", "Intermediate", "Advanced"];

const sortOptions = [
  { value: "newest", label: "Newest" },
  { value: "popular", label: "Most Popular" },
  { value: "rating", label: "Highest Rated" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
];

const toSlug = (text: string) => text.toLowerCase().replace(/\s+/g, "-");

export default function Courses() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<any[]>([]);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState<Set<string>>(
    new Set(),
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedLevel, setSelectedLevel] = useState("All Levels");
  const [sortBy, setSortBy] = useState("popular");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch(URLS.API.COURSES.LIST);
        const data = await res.json();
        if (data.success) setCourses(data.data);
      } catch (err) {
        console.error("Failed to fetch courses", err);
        toast.error("Failed to load courses.");
      }
    };

    const fetchEnrolled = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          URLS.API.ENROLLMENTS.MY_COURSES,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        const enrolledData = await res.json();
        if (enrolledData.success) {
          const ids = new Set<string>(enrolledData.data.map((c: any) => c._id));
          setEnrolledCourseIds(ids);
        }
      } catch (err) {
        console.error("Failed to fetch enrolled courses", err);
        toast.error("Failed to load your enrollments.");
      }
    };

    fetchCourses();
    fetchEnrolled();
  }, []);

  const handleEnroll = async (courseId: string) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        URLS.API.COURSES.ENROLL(courseId),
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await res.json();
      if (data.success) {
        toast.success("Enrollment successful!");
        setEnrolledCourseIds((prev) => new Set([...prev, courseId]));
        navigate(`/course/${courseId}`);
      } else {
        toast.error(data.message || "Enrollment failed");
      }
    } catch (err) {
      console.error("Enrollment error:", err);
      toast.error("Something went wrong while enrolling");
    }
  };

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "All Categories" ||
      course.category === toSlug(selectedCategory);

    const matchesLevel =
      selectedLevel === "All Levels" ||
      course.difficulty.toLowerCase() === selectedLevel.toLowerCase();

    return matchesSearch && matchesCategory && matchesLevel;
  });

  const sortedCourses = [...filteredCourses].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case "popular":
        return (b.enrollments || 0) - (a.enrollments || 0);
      case "rating":
        return (b.rating || 0) - (a.rating || 0);
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      default:
        return 0;
    }
  });

  return (
    <AppLayout>
      <div className="container px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">All Courses</h1>
          <p className="text-muted-foreground">
            Explore our comprehensive collection of courses and find your next
            learning adventure
          </p>
        </div>

        {/* Controls */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search courses or descriptions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4">
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedLevel} onValueChange={setSelectedLevel}>
              <SelectTrigger className="w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {levels.map((level) => (
                  <SelectItem key={level} value={level}>
                    {level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Course List */}
        <div
          className={
            viewMode === "grid"
              ? "grid gap-6 md:grid-cols-2 lg:grid-cols-3"
              : "flex flex-col gap-6"
          }
        >
          {sortedCourses.map((course) => (
            <Card
              key={course._id}
              className="overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow"
            >
              <img
                src={URLS.FILES.THUMBNAIL(course.thumbnail_url)}
                alt={course.title}
                className="w-full h-48 object-cover"
              />
              <CardContent className="p-4 space-y-2">
                <h3 className="text-lg font-semibold line-clamp-2">
                  {course.title}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {course.description}
                </p>
                <div className="text-sm text-muted-foreground capitalize">
                  {course.category.replace(/-/g, " ")} • {course.difficulty}
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-primary font-semibold text-lg">
                    ${course.price}
                  </span>
                  {enrolledCourseIds.has(course._id) ? (
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => navigate(`/course/${course._id}`)}
                    >
                      <BookOpen className="h-4 w-4 mr-1" />
                      Enrolled
                    </Button>
                  ) : (
                    <Button size="sm" onClick={() => handleEnroll(course._id)}>
                      <BookOpen className="h-4 w-4 mr-1" />
                      Enroll
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {sortedCourses.length === 0 && (
          <div className="text-center py-12">
            <Search className="h-10 w-10 mx-auto text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">No courses found</h3>
            <p className="text-sm text-muted-foreground">
              Try adjusting your filters or search query.
            </p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
