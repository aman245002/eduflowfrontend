import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { URLS } from '@/config/urls';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  BookOpen,
  Clock,
  Users,
  Star,
  Play,
  Download,
  Share,
  Heart,
  Globe,
  Award,
} from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";

import { BACKEND_URL } from '@/config/urls';

export default function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [courseData, setCourseData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchFirstLessonId = async (courseId: string) => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/lessons/course/${courseId}`);
      const lessons = res.data.data;
      return lessons?.[0]?._id || null;
    } catch (err) {
      console.error("Error fetching first lesson:", err);
      return null;
    }
  };

  const handleStartLearning = async () => {
    const lessonId = await fetchFirstLessonId(courseData._id);
    if (lessonId) {
      navigate(`/lesson/${lessonId}`);
    } else {
      alert("No lessons found for this course.");
    }
  };

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/api/courses/${id}`);
        setCourseData(res.data.data);
      } catch (err) {
        console.error("Error fetching course:", err);
        setError("Failed to load course");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchCourse();
  }, [id]);

  if (loading) return <AppLayout><div className="p-8">Loading...</div></AppLayout>;
  if (error) return <AppLayout><div className="p-8 text-red-500">{error}</div></AppLayout>;
  if (!courseData) return null;

  const instructor = courseData.created_by;

  return (
    <AppLayout>
      <div className="bg-slate-900 text-white">
        <div className="container px-4 py-12">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="bg-primary/20 text-primary-foreground">
                    {courseData.category}
                  </Badge>
                  <Badge variant="outline" className="border-white/20 text-white">
                    {courseData.difficulty}
                  </Badge>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold leading-tight">
                  {courseData.title}
                </h1>

                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">
                      {courseData.average_rating || 0}
                    </span>
                    <span className="text-slate-300">
                      ({courseData.total_ratings || 0} reviews)
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4" />
                    <span>
                      {courseData.enrolled_students_count || 0} students
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{courseData.duration || 0} minutes</span>
                  </div>
                </div>

                {/* Instructor */}
                {instructor && (
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage
                        src={
                          instructor.avatar_url?.startsWith("data:image")
                            ? instructor.avatar_url
                            : `${BACKEND_URL}${instructor.avatar_url}`
                        }
                      />
                      <AvatarFallback>
                        {instructor.full_name
                          ?.split(" ")
                          .map((n: string) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{instructor.full_name}</p>
                      <p className="text-sm text-slate-300">{instructor.email}</p>
                    </div>
                  </div>
                )}

                <p className="text-slate-300 mt-4">{courseData.description}</p>
              </div>
            </div>

            {/* Right Column */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <div className="relative">
                  <img
                    src={
                      courseData.thumbnail_url
                        ? `${BACKEND_URL}${courseData.thumbnail_url}`
                        : "/default-thumb.jpg"
                    }
                    alt={courseData.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-t-lg">
                    <Button size="lg" className="rounded-full p-4">
                      <Play className="h-6 w-6" />
                    </Button>
                  </div>
                </div>

                <CardContent className="p-6 space-y-4 text-center">
                  <div className="text-3xl font-bold text-primary">${courseData.price}</div>

                  <Button className="w-full bg-green-600 hover:bg-green-700 text-white" size="lg" disabled>
                    <BookOpen className="mr-2 h-5 w-5" />
                    Enrolled
                  </Button>

                  <Button
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    size="lg"
                    onClick={handleStartLearning}
                  >
                    <Play className="mr-2 h-5 w-5" />
                    Start Learning
                  </Button>

                  <div className="flex space-x-2">
                    <Button variant="outline" className="flex-1">
                      <Heart className="mr-2 h-4 w-4" />
                      Wishlist
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Share className="mr-2 h-4 w-4" />
                      Share
                    </Button>
                  </div>

                  <div className="space-y-3 text-sm text-left">
                    <div className="flex items-center space-x-3">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{courseData.duration || 0} min video</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Download className="h-4 w-4 text-muted-foreground" />
                      <span>Downloadable resources</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Award className="h-4 w-4 text-muted-foreground" />
                      <span>Certificate of completion</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <span>Lifetime access</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="container px-4 py-12">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
            <TabsTrigger value="instructor">Instructor</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <Card>
              <CardContent className="p-6 text-muted-foreground">
                {courseData.overview || "No overview provided."}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="curriculum">
            <Card>
              <CardContent className="p-6 text-muted-foreground space-y-2">
                {courseData.curriculum?.topics?.length > 0 ? (
                  <>
                    <div><strong>Topics:</strong> {courseData.curriculum.topics.join(", ")}</div>
                    <div><strong>Total Modules:</strong> {courseData.curriculum.total_modules}</div>
                    <div><strong>Total Quizzes:</strong> {courseData.curriculum.total_quizzes}</div>
                  </>
                ) : (
                  <p>No curriculum available.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="instructor">
            <Card>
              <CardContent className="p-6 text-muted-foreground">
                <div className="flex items-center space-x-4 mb-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage
                      src={
                        instructor.avatar_url?.startsWith("data:image")
                          ? instructor.avatar_url
                          : `${BACKEND_URL}${instructor.avatar_url}`
                      }
                    />
                    <AvatarFallback>
                      {instructor.full_name
                        ?.split(" ")
                        .map((n: string) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-lg">{instructor.full_name}</p>
                    <p className="text-sm text-muted-foreground">{instructor.email}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews">
            <Card>
              <CardContent className="p-6 text-muted-foreground">
                <p>No reviews yet.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
