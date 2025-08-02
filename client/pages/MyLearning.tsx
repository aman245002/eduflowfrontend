import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import { URLS } from '@/config/urls';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Clock, Award, CheckCircle } from "lucide-react";
import axios from "axios";
import { useAuth } from "@/AuthContext"; // ✅ imported here

export default function MyLearning() {
  const { user } = useAuth(); // ✅ using user from AuthContext
  const [courses, setCourses] = useState<any[]>([]);
  const [progressMap, setProgressMap] = useState<Record<string, number>>({});
  const [hoursLearned, setHoursLearned] = useState("0h 0m");
  const [certificateCount, setCertificateCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        const res = await axios.get(URLS.API.ENROLLMENTS.MY_COURSES, { headers });
        const courseList = res.data.data;
        setCourses(courseList);

        const progressResponses = await Promise.all(
          courseList.map((course: any) =>
            axios
              .get(URLS.API.ANALYTICS.PROGRESS(course._id), { headers })
              .then((res) => ({
                courseId: course._id,
                progress: res.data?.data?.progress || 0,
              }))
              .catch(() => ({
                courseId: course._id,
                progress: 0,
              }))
          )
        );

        const progressData: Record<string, number> = {};
        let completed = 0;
        progressResponses.forEach(({ courseId, progress }) => {
          progressData[courseId] = progress;
          if (progress === 100) completed += 1;
        });
        setProgressMap(progressData);
        setCertificateCount(completed);

        const hoursRes = await axios.get(URLS.API.ANALYTICS.HOURS, { headers });
        const totalMinutes = hoursRes.data?.data?.totalDurationMinutes || 0;
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        setHoursLearned(`${hours}h ${minutes}m`);
      } catch (err) {
        console.error("Error loading MyLearning data:", err);
      }
    };

    fetchData();
  }, []);

  if (!user) {
    return (
      <AppLayout>
        <div className="container p-8 text-center">Loading user info...</div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="container px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Learning</h1>
          <p className="text-muted-foreground">
            Track your progress and continue your learning journey
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{courses.length}</p>
                  <p className="text-sm text-muted-foreground">Enrolled Courses</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-success/10 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{certificateCount}</p>
                  <p className="text-sm text-muted-foreground">Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-warning/10 rounded-lg">
                  <Clock className="h-6 w-6 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{hoursLearned}</p>
                  <p className="text-sm text-muted-foreground">Hours Learned</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-info/10 rounded-lg">
                  <Award className="h-6 w-6 text-info" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{certificateCount}</p>
                  <p className="text-sm text-muted-foreground">Certificates</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Course List */}
        <Card>
          <CardHeader>
            <CardTitle>All My Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {courses.length === 0 ? (
                <p className="text-muted-foreground">You have not enrolled in any courses yet.</p>
              ) : (
                courses.map((course) => {
                  const progress = progressMap[course._id] || 0;
                  const isComplete = progress === 100;

                  return (
                    <div
                      key={course._id}
                      className="flex items-center space-x-4 p-4 border rounded-lg"
                    >
                      <img
                        src={
                          course.thumbnail_url
                            ? URLS.FILES.THUMBNAIL(course.thumbnail_url)
                            : "https://via.placeholder.com/120x80"
                        }
                        alt={course.title}
                        className="w-16 h-12 rounded object-cover"
                      />

                      <div className="flex-1">
                        <h4 className="font-semibold">{course.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {course.created_by?.full_name || "Instructor"}
                        </p>
                      </div>

                      <div className="text-center">
                        <p className="text-sm font-medium">{progress}%</p>
                        <Progress value={progress} className="w-20 h-2" />
                      </div>

                      {isComplete ? (
                        <Button
                          size="sm"
                          onClick={() =>
                            navigate(
                              `/certificate?course=${encodeURIComponent(
                                course.title
                              )}&name=${encodeURIComponent(user.full_name)}`
                            )
                          }
                        >
                          View Certificate
                        </Button>
                      ) : (
                        <Badge variant="secondary">In Progress</Badge>
                      )}

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/course/${course._id}`)}
                      >
                        View
                      </Button>
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
