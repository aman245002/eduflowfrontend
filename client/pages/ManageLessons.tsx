import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { URLS } from '@/config/urls';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import AppLayout from "@/components/layout/AppLayout";
import { toast } from "sonner";

import { BACKEND_URL } from '@/config/urls'; // or your deployed backend

interface Course {
  _id: string;
  title: string;
}

interface Lesson {
  _id: string;
  title: string;
  content: string;
  order: number;
  duration: number;
  attachments?: UploadedFile[];
  quiz?: {
    _id: string;
    title: string;
    description: string;
    questions: {
      question_text: string;
      options: string[];
      correct_answer: number;
    }[];
  };
}

interface UploadedFile {
  filename: string;
  url: string;
  type: string;
  is_downloadable?: boolean;
}

const ManageLessons = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [newLesson, setNewLesson] = useState({
    title: "",
    content: "",
    order: 1,
    duration: 10,
  });
  const [quizEnabled, setQuizEnabled] = useState(false);
  const [isDownloadable, setIsDownloadable] = useState(false);

  const [quizData, setQuizData] = useState({
    title: "",
    description: "",
    time_limit: 10,
    passing_score: 70,
    max_attempts: 3,
    shuffle_questions: false,
    show_results: true,
    questions: [
      {
        question_text: "Sample question?",
        type: "mcq",
        options: ["Option 1", "Option 2", "Option 3", "Option 4"],
        correct_answer: 0,
        explanation: "",
        points: 1,
      },
    ],
  });

  const handleDeleteQuiz = async (lessonId, quizId) => {
    if (!window.confirm("Are you sure you want to delete this quiz?")) return;

    try {
      await axios.delete(`${BACKEND_URL}/api/quizzes/${quizId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      // Remove quiz from the lesson in local state
      setLessons((prevLessons) =>
        prevLessons.map((lesson) =>
          lesson._id === lessonId ? { ...lesson, quiz: null } : lesson,
        ),
      );
      toast.success("🗑️ Quiz deleted successfully");
    } catch (error) {
      console.error("Delete quiz error:", error);
      toast.error("❌ Failed to delete quiz");
    }
  };

  const handleEditQuiz = (quizId) => {
    // Navigate to your edit page or open a modal
    window.location.href = `/edit-quiz/${quizId}`; // or use navigate()
  };

  const [file, setFile] = useState<File | null>(null);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [loadingLessons, setLoadingLessons] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const token = localStorage.getItem("token");

  const fetchCourses = async () => {
    setLoadingCourses(true);
    try {
      const res = await axios.get(URLS.API.COURSES.MY_COURSES, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCourses(res.data.data || []);
    } catch (err) {
      console.error("Error fetching courses:", err);
      toast.error("❌ Failed to load your courses");
    } finally {
      setLoadingCourses(false);
    }
  };

  const fetchLessons = async (courseId: string) => {
    setLoadingLessons(true);
    try {
      const res = await axios.get(
        URLS.API.LESSONS.COURSE_LESSONS(courseId),
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const data = res.data.data || [];
      const hydrated = await Promise.all(
        data.map(async (lesson: Lesson) => {
          if (lesson.quiz && typeof lesson.quiz === "string") {
            const quizData = await fetchQuizById(lesson.quiz);
            return { ...lesson, quiz: quizData };
          }
          return lesson;
        }),
      );

      setLessons(hydrated);

      const nextOrder = data.length
        ? Math.max(...data.map((l: Lesson) => l.order)) + 1
        : 1;
      setNewLesson((prev) => ({ ...prev, order: nextOrder }));
    } catch (err) {
      console.error("Error fetching lessons:", err);
      toast.error("❌ Failed to load lessons for the selected course");
    } finally {
      setLoadingLessons(false);
    }
  };

  const fetchQuizById = async (quizId: string) => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/quizzes/${quizId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data.data;
    } catch (err) {
      console.error(`Error fetching quiz ${quizId}:`, err);
      return null;
    }
  };

  const handleAddLesson = async () => {
    if (!newLesson.title.trim() || !newLesson.content.trim()) {
      toast.error("⚠️ Please fill all lesson fields before submitting.");
      return;
    }

    setIsSubmitting(true);

    try {
      let uploadedFileInfo = null;
      if (file) {
        const uploadFormData = new FormData();
        uploadFormData.append("file", file);
        const uploadRes = await axios.post(
          URLS.API.LESSONS.UPLOAD,
          uploadFormData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          },
        );
        uploadedFileInfo = uploadRes.data.data;
      }

      const formData = new FormData();
      formData.append("title", newLesson.title);
      formData.append("content", newLesson.content);
      formData.append("order", String(newLesson.order));
      formData.append("duration", String(newLesson.duration));
      formData.append("course_id", selectedCourseId);

      if (uploadedFileInfo) {
        const attachmentWithFlag = {
          ...uploadedFileInfo,
          is_downloadable: isDownloadable,
        };
        formData.append("attachments", JSON.stringify([attachmentWithFlag]));
      } else {
        formData.append("attachments", JSON.stringify([]));
      }

      const lessonRes = await axios.post(
        URLS.API.LESSONS.UPLOAD,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      const createdLesson = lessonRes.data.data;

      // ✅ Add quiz if enabled
      if (quizEnabled) {
        const quizPayload = {
          ...quizData,
          lesson_id: createdLesson._id,
        };
        if (
          quizData.questions.some(
            (q) =>
              !q.question_text.trim() || q.options.some((opt) => !opt.trim()),
          )
        ) {
          alert(
            "Please fill out all quiz question fields and options before submitting.",
          );
          return;
        }

        await axios.post(URLS.API.QUIZZES.CREATE, quizPayload, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
      }

      // ✅ Reset form after success
      setNewLesson({
        title: "",
        content: "",
        order: newLesson.order + 1,
        duration: 10,
      });
      setFile(null);
      setQuizEnabled(false);
      setQuizData({
        title: "",
        description: "",
        time_limit: 10,
        passing_score: 70,
        max_attempts: 3,
        shuffle_questions: false,
        show_results: true,
        questions: [
          {
            question_text: "",
            type: "mcq",
            options: ["", "", "", ""],
            correct_answer: 0,
            explanation: "",
            points: 1,
          },
        ],
      });

      await fetchLessons(selectedCourseId);
      toast.success("✅ Lesson added successfully!");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "❌ Error adding lesson");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateLesson = async () => {
    if (!editingLesson) return;
    setIsSubmitting(true);

    try {
      let uploadedFileInfo = null;

      // 🔼 Upload the new file if provided
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        const uploadRes = await axios.post(
          `${BACKEND_URL}/api/lessons/upload`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          },
        );
        uploadedFileInfo = uploadRes.data.data;
      }

      // 🧠 Create FormData payload for lesson update
      const formData = new FormData();
      formData.append("title", newLesson.title);
      formData.append("content", newLesson.content);
      formData.append("order", String(newLesson.order));
      formData.append("duration", String(newLesson.duration));
      formData.append("course_id", selectedCourseId);

      // 🧩 Include attachments
      if (uploadedFileInfo) {
        const attachmentWithFlag = {
          ...uploadedFileInfo,
          is_downloadable: isDownloadable,
        };
        formData.append("attachments", JSON.stringify([attachmentWithFlag]));
      } else {
        formData.append("attachments", JSON.stringify([]));
      }

      // 🔁 Update lesson via PUT
      const lessonRes = await axios.put(
        `${BACKEND_URL}/api/lessons/${editingLesson._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      // 🔄 Reset UI state
      setEditingLesson(null);
      setFile(null);
      setNewLesson({
        title: "",
        content: "",
        order: newLesson.order + 1,
        duration: 10,
      });
      await fetchLessons(selectedCourseId);
      toast.success("📝 Lesson updated successfully!");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "❌ Error updating lesson");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteLesson = async (lessonId: string) => {
    if (!window.confirm("Are you sure you want to delete this lesson?")) return;
    try {
      await axios.delete(URLS.API.LESSONS.DELETE(lessonId), {
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchLessons(selectedCourseId);
      toast.success("🗑️ Lesson deleted successfully!");
    } catch (err) {
      toast.error("❌ Error deleting lesson");
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    if (selectedCourseId) fetchLessons(selectedCourseId);
  }, [selectedCourseId]);

  useEffect(() => {
    if (editingLesson) {
      setNewLesson({
        title: editingLesson.title,
        content: editingLesson.content,
        order: editingLesson.order,
        duration: editingLesson.duration,
      });
      setFile(null);
    }
  }, [editingLesson]);

  const selectedCourse = courses.find((c) => c._id === selectedCourseId);

  return (
    <AppLayout>
      <div className="container py-6">
        <h1 className="text-2xl font-bold mb-4">Manage Lessons</h1>

        <div className="mb-6">
          <select
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
            className="p-2 border rounded w-full sm:w-auto"
          >
            <option value="">Select a course</option>
            {courses.map((course) => (
              <option key={course._id} value={course._id}>
                {course.title}
              </option>
            ))}
          </select>
        </div>

        {selectedCourseId && (
          <>
            <h2 className="text-xl font-semibold mb-2">
              Lessons for: {selectedCourse?.title}
            </h2>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>
                  {editingLesson ? "Edit Lesson" : "Add New Lesson"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="Lesson Title"
                  value={newLesson.title}
                  onChange={(e) =>
                    setNewLesson({ ...newLesson, title: e.target.value })
                  }
                  disabled={isSubmitting}
                />
                <Textarea
                  placeholder="Lesson Content"
                  value={newLesson.content}
                  onChange={(e) =>
                    setNewLesson({ ...newLesson, content: e.target.value })
                  }
                  disabled={isSubmitting}
                />
                <Input
                  type="number"
                  placeholder="Order"
                  value={newLesson.order}
                  onChange={(e) =>
                    setNewLesson({
                      ...newLesson,
                      order: Number(e.target.value),
                    })
                  }
                  disabled={isSubmitting}
                />
                <Input
                  type="number"
                  placeholder="Duration (minutes)"
                  value={newLesson.duration}
                  onChange={(e) =>
                    setNewLesson({
                      ...newLesson,
                      duration: Number(e.target.value),
                    })
                  }
                  disabled={isSubmitting}
                />
                <Input
                  type="file"
                  accept="video/*,application/pdf"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  disabled={isSubmitting}
                />
                <label className="flex items-center space-x-2 mt-1">
                  <input
                    type="checkbox"
                    checked={isDownloadable}
                    onChange={(e) => setIsDownloadable(e.target.checked)}
                  />
                  <span>Mark this file as downloadable</span>
                </label>

                {file && file.type.startsWith("video/") && (
                  <video className="w-full mt-2" controls height="240">
                    <source src={URL.createObjectURL(file)} type={file.type} />
                    Your browser does not support the video tag.
                  </video>
                )}

                {/* ✅ Add Quiz Option */}
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={quizEnabled}
                    onChange={() => setQuizEnabled(!quizEnabled)}
                  />
                  <span>Add Quiz to this Lesson</span>
                </label>

                {/* ✅ Quiz Builder Form */}
                {quizEnabled && (
                  <div className="space-y-3 border border-purple-300 p-4 rounded-md">
                    <Input
                      placeholder="Quiz Title"
                      value={quizData.title}
                      onChange={(e) =>
                        setQuizData({ ...quizData, title: e.target.value })
                      }
                    />
                    <Textarea
                      placeholder="Quiz Description"
                      value={quizData.description}
                      onChange={(e) =>
                        setQuizData({
                          ...quizData,
                          description: e.target.value,
                        })
                      }
                    />

                    {quizData.questions.map((q, i) => (
                      <div key={i} className="border p-3 rounded-md bg-gray-50">
                        <Input
                          placeholder="Question Text"
                          value={q.question_text}
                          onChange={(e) => {
                            const updated = [...quizData.questions];
                            updated[i].question_text = e.target.value;
                            setQuizData({ ...quizData, questions: updated });
                          }}
                        />
                        {q.options.map((opt, j) => (
                          <Input
                            key={j}
                            className="mt-1"
                            placeholder={`Option ${j + 1}`}
                            value={opt}
                            onChange={(e) => {
                              const updated = [...quizData.questions];
                              updated[i].options[j] = e.target.value;
                              setQuizData({ ...quizData, questions: updated });
                            }}
                          />
                        ))}
                        <Input
                          type="number"
                          className="mt-1"
                          placeholder="Correct Option Index (e.g. 0)"
                          value={q.correct_answer}
                          onChange={(e) => {
                            const updated = [...quizData.questions];
                            updated[i].correct_answer = Number(e.target.value);
                            setQuizData({ ...quizData, questions: updated });
                          }}
                        />
                      </div>
                    ))}

                    <Button
                      variant="outline"
                      onClick={() => {
                        const newQ = {
                          question_text: "",
                          type: "mcq",
                          options: ["", "", "", ""],
                          correct_answer: 0,
                          explanation: "",
                          points: 1,
                        };
                        setQuizData({
                          ...quizData,
                          questions: [...quizData.questions, newQ],
                        });
                      }}
                    >
                      + Add Question
                    </Button>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button
                    onClick={
                      editingLesson ? handleUpdateLesson : handleAddLesson
                    }
                    disabled={isSubmitting}
                  >
                    {isSubmitting
                      ? editingLesson
                        ? "Updating..."
                        : "Adding..."
                      : editingLesson
                        ? "Update Lesson"
                        : "Add Lesson"}
                  </Button>
                  {editingLesson && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        setEditingLesson(null);
                        setNewLesson({
                          title: "",
                          content: "",
                          order: newLesson.order + 1,
                          duration: 10,
                        });
                        setFile(null);
                      }}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              {loadingLessons ? (
                <p>Loading lessons...</p>
              ) : lessons.length === 0 ? (
                <p>No lessons added yet.</p>
              ) : (
                lessons.map((lesson) => {
                  console.log("Lesson quiz full:", lesson.quiz);

                  // ✅ Debug output

                  return (
                    <Card key={lesson._id}>
                      <CardContent className="py-4 space-y-2">
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-semibold">{lesson.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              Order: {lesson.order}, Duration: {lesson.duration}{" "}
                              mins
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              onClick={() => setEditingLesson(lesson)}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={() => handleDeleteLesson(lesson._id)}
                            >
                              Delete
                            </Button>
                          </div>
                        </div>

                        {lesson.attachments?.map((att, i) => {
                          const fileUrl = URLS.FILES.UPLOAD(att.url);
                          return (
                            <div key={i} className="text-sm mt-1">
                              {att.type.startsWith("video/") ? (
                                <video controls className="w-full max-w-md">
                                  <source src={fileUrl} type={att.type} />
                                  Your browser does not support the video tag.
                                </video>
                              ) : (
                                <div className="flex items-center gap-2">
                                  <a
                                    className="text-blue-600 underline"
                                    href={fileUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                  >
                                    {att.filename}
                                  </a>
                                  {att.is_downloadable && (
                                    <a
                                      href={fileUrl}
                                      download
                                      className="text-sm text-green-600 underline"
                                    >
                                      Download
                                    </a>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })}

                        {lesson.quiz?.questions?.length > 0 && (
                          <div className="mt-4 border-t pt-4 space-y-2">
                            <h4 className="font-semibold text-purple-700">
                              📝 Quiz Preview
                            </h4>
                            <p className="text-sm font-medium text-gray-800">
                              {lesson.quiz.title}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {lesson.quiz.description}
                            </p>

                            <ul className="list-disc ml-5 space-y-1">
                              {lesson.quiz.questions.map((q, idx) => (
                                <li key={idx}>
                                  <span className="font-medium">
                                    {q.question_text}
                                  </span>
                                  <ul className="list-decimal ml-5 mt-1">
                                    {q.options.map((opt, i) => (
                                      <li
                                        key={i}
                                        className={`${
                                          i === q.correct_answer
                                            ? "text-green-600 font-semibold"
                                            : ""
                                        }`}
                                      >
                                        {opt}
                                      </li>
                                    ))}
                                  </ul>
                                </li>
                              ))}
                            </ul>

                            <div className="flex gap-3 mt-4">
                              <Button
                                variant="destructive"
                                onClick={() =>
                                  handleDeleteQuiz(lesson._id, lesson.quiz._id)
                                }
                              >
                                Delete Quiz
                              </Button>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
};

export default ManageLessons;
