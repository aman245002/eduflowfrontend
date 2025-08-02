// (File: InstructorDashboard.tsx)

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { URLS } from '@/config/urls';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Pencil, Trash } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import { toast } from "sonner";

interface Course {
  _id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  tags: string[];
  price: number;
  thumbnail_url: string | null;
  status: string;
  created_by: any;
  overview?: string;
  curriculum?: {
    topics: string[];
    total_modules: number;
    total_quizzes: number;
  };
}

export default function InstructorDashboard() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCreateCourse, setShowCreateCourse] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [newCourse, setNewCourse] = useState({
    title: "",
    description: "",
    category: "",
    difficulty: "",
    tags: "",
    price: "",
    overview: "",
    curriculumTopics: "",
    totalModules: "",
    totalQuizzes: "",
  });

  const fetchMyCourses = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    const res = await fetch(URLS.API.COURSES.MY_COURSES, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (data.success) {
      setCourses(data.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMyCourses();
  }, []);

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnail(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  const handleCreateOrUpdateCourse = async () => {
    const formData = new FormData();
    const curriculum = {
      topics: newCourse.curriculumTopics.split(",").map((t) => t.trim()),
      total_modules: parseInt(newCourse.totalModules),
      total_quizzes: parseInt(newCourse.totalQuizzes),
    };

    formData.append("title", newCourse.title);
    formData.append("description", newCourse.description);
    formData.append("category", newCourse.category);
    formData.append("difficulty", newCourse.difficulty);
    formData.append("tags", newCourse.tags);
    formData.append("price", newCourse.price);
    formData.append("overview", newCourse.overview);
    formData.append("curriculum", JSON.stringify(curriculum));
    if (thumbnail) formData.append("thumbnail", thumbnail);

    const token = localStorage.getItem("token");
    const url = isEditMode
              ? URLS.API.COURSES.UPDATE(editingCourse?._id)
      : URLS.API.COURSES.LIST;
    const method = isEditMode ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    const data = await res.json();
    if (data.success) {
      toast.success(isEditMode ? "✅ Course updated!" : "🎉 Course created!");
      resetForm();
      fetchMyCourses();
    } else {
      toast.error(data.message || "❌ Operation failed");
    }
  };

  const openEditDialog = (course: Course) => {
    setEditingCourse(course);
    setIsEditMode(true);
    setShowCreateCourse(true);
    setNewCourse({
      title: course.title,
      description: course.description,
      category: course.category,
      difficulty: course.difficulty,
      tags: course.tags.join(", "),
      price: course.price.toString(),
      overview: course.overview || "",
      curriculumTopics: course.curriculum?.topics.join(", ") || "",
      totalModules: course.curriculum?.total_modules?.toString() || "0",
      totalQuizzes: course.curriculum?.total_quizzes?.toString() || "0",
    });
    setThumbnail(null);
    setThumbnailPreview(
      course.thumbnail_url
        ? URLS.FILES.THUMBNAIL(course.thumbnail_url)
        : null,
    );
  };

  const handleDeleteCourse = async (id: string) => {
    if (!confirm("Are you sure you want to delete this course?")) return;
    const token = localStorage.getItem("token");
    const res = await fetch(URLS.API.COURSES.UPDATE(id), {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (data.success) {
      toast.success("🗑️ Course deleted successfully");
      fetchMyCourses();
    } else {
      toast.error(data.message || "❌ Failed to delete course");
    }
  };

  const resetForm = () => {
    setShowCreateCourse(false);
    setIsEditMode(false);
    setEditingCourse(null);
    setNewCourse({
      title: "",
      description: "",
      category: "",
      difficulty: "",
      tags: "",
      price: "",
      overview: "",
      curriculumTopics: "",
      totalModules: "",
      totalQuizzes: "",
    });
    setThumbnail(null);
    setThumbnailPreview(null);
  };

  return (
    <AppLayout>
      <div className="container py-8 px-4 max-w-5xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Instructor Dashboard</h1>
          <Dialog open={showCreateCourse} onOpenChange={setShowCreateCourse}>
            <DialogTrigger asChild>
              <Button size="lg">
                <Plus className="mr-2 h-5 w-5" />
                {isEditMode ? "Edit Course" : "Create Course"}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {isEditMode ? "Edit Course" : "Create New Course"}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Label>Course Title</Label>
                <Input
                  value={newCourse.title}
                  onChange={(e) =>
                    setNewCourse({ ...newCourse, title: e.target.value })
                  }
                />
                <Label>Description</Label>
                <Textarea
                  value={newCourse.description}
                  onChange={(e) =>
                    setNewCourse({ ...newCourse, description: e.target.value })
                  }
                />
                <Label>Overview</Label>
                <Textarea
                  value={newCourse.overview}
                  onChange={(e) =>
                    setNewCourse({ ...newCourse, overview: e.target.value })
                  }
                />
                <Label>Curriculum Topics (comma-separated)</Label>
                <Input
                  value={newCourse.curriculumTopics}
                  onChange={(e) =>
                    setNewCourse({
                      ...newCourse,
                      curriculumTopics: e.target.value,
                    })
                  }
                />
                <Label>Total Modules</Label>
                <Input
                  type="number"
                  value={newCourse.totalModules}
                  onChange={(e) =>
                    setNewCourse({ ...newCourse, totalModules: e.target.value })
                  }
                />
                <Label>Total Quizzes</Label>
                <Input
                  type="number"
                  value={newCourse.totalQuizzes}
                  onChange={(e) =>
                    setNewCourse({ ...newCourse, totalQuizzes: e.target.value })
                  }
                />
                <Label>Category</Label>
                <Select
                  value={newCourse.category}
                  onValueChange={(val) =>
                    setNewCourse({ ...newCourse, category: val })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="web-development">
                      Web Development
                    </SelectItem>
                    <SelectItem value="data-science">Data Science</SelectItem>
                    <SelectItem value="design">Design</SelectItem>
                    <SelectItem value="design">Programming Language</SelectItem>
                    <SelectItem value="design">
                      Research & Development
                    </SelectItem>
                  </SelectContent>
                </Select>
                <Label>Difficulty</Label>
                <Select
                  value={newCourse.difficulty}
                  onValueChange={(val) =>
                    setNewCourse({ ...newCourse, difficulty: val })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
                <Label>Tags</Label>
                <Input
                  value={newCourse.tags}
                  onChange={(e) =>
                    setNewCourse({ ...newCourse, tags: e.target.value })
                  }
                />
                <Label>Price</Label>
                <Input
                  type="number"
                  value={newCourse.price}
                  onChange={(e) =>
                    setNewCourse({ ...newCourse, price: e.target.value })
                  }
                />
                <Label>Thumbnail</Label>
                <Input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleThumbnailChange}
                />
                {thumbnailPreview && (
                  <img
                    src={thumbnailPreview}
                    alt="preview"
                    className="h-24 mt-2"
                  />
                )}
                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateOrUpdateCourse}>
                    {isEditMode ? "Update" : "Create"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {loading ? (
          <p>Loading your courses...</p>
        ) : courses.length === 0 ? (
          <p>No courses created yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {courses.map((course) => (
              <div
                key={course._id}
                className="border rounded shadow-sm p-4 bg-white"
              >
                {course.thumbnail_url && (
                  <img
                    src={URLS.FILES.THUMBNAIL(course.thumbnail_url)}
                    className="w-full h-40 object-cover mb-2"
                  />
                )}
                <h2 className="font-bold text-lg">{course.title}</h2>
                <p className="text-sm text-black">{course.description}</p>
                <p className="text-sm mt-1">${course.price}</p>
                <p className="text-xs text-gray-500">
                  {course.category} • {course.difficulty}
                </p>
                <div className="flex gap-2 mt-3">
                  <Button size="sm" onClick={() => openEditDialog(course)}>
                    <Pencil className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDeleteCourse(course._id)}
                  >
                    <Trash className="w-4 h-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
