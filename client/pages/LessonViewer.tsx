import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { URLS } from '@/config/urls';
import { Card, CardContent } from "@/components/ui/card";
import {
  FileText,
  Download,
  Video,
  ArrowRight,
  ArrowLeft,
  Link,
} from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import QuizAttempt from "@/components/QuizAttempt";
import { toast } from "sonner";

import { BACKEND_URL } from '@/config/urls';

export default function LessonViewer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState<any | null>(null);
  const [quiz, setQuiz] = useState<any | null>(null);
  const [attempt, setAttempt] = useState<any | null>(null);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(true);
  const [attemptLoading, setAttemptLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  // Fetch lesson
  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/api/lessons/${id}`);
        setLesson(res.data.data);
      } catch (err) {
        console.error("Error fetching lesson:", err);
        setError("Failed to load lesson");
        toast.error("❌ Failed to load lesson.");
      } finally {
        setLoading(false);
      }
    };
    fetchLesson();
  }, [id]);

  // Fetch quiz
  useEffect(() => {
    const fetchQuiz = async () => {
      if (lesson?.quiz && typeof lesson.quiz === "string") {
        try {
          const res = await axios.get(
            `${BACKEND_URL}/api/quizzes/${lesson.quiz}`,
          );
          setQuiz(res.data?.data?.questions?.length ? res.data.data : null);
        } catch (err) {
          console.error("Error fetching quiz:", err);
          setQuiz(null);
          toast.error("❌ Failed to load quiz.");
        }
      } else if (lesson?.quiz?.questions?.length > 0) {
        setQuiz(lesson.quiz);
      } else {
        setQuiz(null);
      }
    };
    fetchQuiz();
  }, [lesson]);

  // Fetch latest quiz attempt
  useEffect(() => {
    const fetchAttempt = async () => {
      if (!quiz || !lesson?._id) return;
      setAttemptLoading(true);
      try {
        const res = await axios.get(
          `${BACKEND_URL}/api/quiz-attempts/${lesson._id}/latest`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        setAttempt(res.data.data);
      } catch {
        setAttempt(null);
        toast.error("❌ Failed to load quiz attempt.");
      } finally {
        setAttemptLoading(false);
      }
    };
    fetchAttempt();
  }, [quiz, lesson]);

  // Fetch progress
  useEffect(() => {
    const fetchProgress = async () => {
      if (!token || !lesson?._id) return;
      try {
        const res = await axios.get(
          `${BACKEND_URL}/api/progress/lesson/${lesson._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        setDone(res.data?.data?.completed || false);
      } catch {
        setDone(false);
        toast.error("❌ Failed to fetch progress.");
      }
    };
    fetchProgress();
  }, [lesson]);

  const handleMarkAsDone = async () => {
    try {
      await axios.post(
        `${BACKEND_URL}/api/progress/mark-done`,
        { lessonId: lesson._id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setDone(true);
    } catch (err) {
      console.error("Error marking as done:", err);
      toast.error("❌ Failed to mark lesson as done.");
    }
  };

  const handleNextLesson = async () => {
    if (quiz && (!attempt || !attempt.passed)) {
      toast.warning("⚠️ You must pass the quiz to proceed.");
      return;
    }
    try {
      const res = await axios.get(`${BACKEND_URL}/api/lessons/${id}/next`);
      const nextLesson = res.data?.data;
      if (nextLesson?._id) {
        navigate(`/lesson/${nextLesson._id}`);
      } else {
        toast.warning("No next lesson available.");
      }
    } catch {
      toast.error("Failed to fetch next lesson.");
    }
  };

  const handlePreviousLesson = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/lessons/${id}/prev`);
      const prevLesson = res.data?.data;
      if (prevLesson?._id) {
        navigate(`/lesson/${prevLesson._id}`);
      } else {
        toast.warning("No previous lesson available.");
      }
    } catch {
      toast.error("Failed to fetch previous lesson.");
    }
  };

  if (loading)
    return (
      <AppLayout>
        <div className="p-8">Loading...</div>
      </AppLayout>
    );

  if (error)
    return (
      <AppLayout>
        <div className="p-8 text-red-500">{error}</div>
      </AppLayout>
    );

  if (!lesson) return null;

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 space-y-6">
        <h1 className="text-3xl font-bold">{lesson.title}</h1>

        {/* Attachments */}
        {lesson.attachments?.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Attachments</h2>
            {lesson.attachments.map((file: any) => {
              const fileUrl = `${BACKEND_URL}/uploads/lessons/${file.filename}`;
              const isVideo = file.type.startsWith("video/");
              const isPDF = file.type === "application/pdf";

              return (
                <div key={file.filename} className="space-y-2">
                  <div className="flex items-center gap-3">
                    {isVideo ? (
                      <Video className="text-blue-600" />
                    ) : (
                      <FileText className="text-blue-600" />
                    )}
                    <span className="font-medium">{file.original_name}</span>
                    <a
                      href={fileUrl}
                      download={file.original_name}
                      className="ml-2 inline-flex items-center px-2 py-1 border border-gray-300 text-sm rounded hover:bg-gray-100"
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Download
                    </a>
                  </div>
                  {isVideo && (
                    <video controls className="w-full max-w-3xl rounded shadow">
                      <source src={fileUrl} type={file.type} />
                    </video>
                  )}
                  {isPDF && (
                    <iframe
                      src={fileUrl}
                      title="PDF Preview"
                      className="w-full h-[600px] border rounded"
                    />
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Content */}
        <Card>
          <CardContent className="prose max-w-none p-6">
            <div dangerouslySetInnerHTML={{ __html: lesson.content }} />
          </CardContent>
        </Card>

        {/* Video Embed */}
        {lesson.video_embed_url && (
          <div className="aspect-video mb-4">
            <iframe
              src={lesson.video_embed_url}
              title="Lesson Video"
              allowFullScreen
              className="w-full h-full rounded-lg"
            />
          </div>
        )}

        {/* Resources */}
        {lesson.resources?.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Resources</h2>
            {lesson.resources.map((res: any, idx: number) => (
              <div key={idx} className="p-4 border rounded-md space-y-1">
                <div className="flex items-center gap-2 font-semibold">
                  <Link className="text-blue-600" />
                  <a
                    href={res.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline text-blue-700"
                  >
                    {res.title}
                  </a>
                </div>
                <p className="text-sm text-muted-foreground">
                  {res.description}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Quiz */}
        {quiz && quiz.questions?.length > 0 && (
          <QuizAttempt quiz={quiz} lessonId={lesson._id} />
        )}

        {/* Duration */}
        <p className="text-muted-foreground text-sm">
          Duration:{" "}
          {lesson.duration
            ? `${Math.floor(lesson.duration / 60)}m ${lesson.duration % 60}s`
            : "N/A"}
        </p>

        {/* Navigation */}
        <div className="flex justify-between pt-6">
          <Button variant="outline" onClick={handlePreviousLesson}>
            <ArrowLeft className="mr-2 w-4 h-4" />
            Previous Lesson
          </Button>
          <div className="flex flex-col items-end space-y-2">
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={handleMarkAsDone}
              disabled={
                !quiz ? false : !attempt?.passed || attemptLoading || done
              }
            >
              ✅ Mark as Done
            </Button>
            {done && (
              <p className="text-green-600 text-sm">
                ✅ Lesson marked as completed.
              </p>
            )}
            <Button
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={handleNextLesson}
              disabled={quiz && (!attempt?.passed || attemptLoading)}
            >
              Next Lesson <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
            {quiz && !attemptLoading && (!attempt || !attempt.passed) && (
              <p className="text-red-600 text-sm">
                ⚠️ You must pass the quiz to proceed to the next lesson.
              </p>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
