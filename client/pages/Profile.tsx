import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/AuthContext";
import { URLS } from '@/config/urls';
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import AppLayout from "@/components/layout/AppLayout";
import { MapPin, Calendar, Camera, Edit, Save, X, Shield } from "lucide-react";

export default function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("overview");

  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [certificateCourses, setCertificateCourses] = useState<any[]>([]);

  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [profileMessage, setProfileMessage] = useState("");

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleAvatarButtonClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setEditedData((prev: any) => ({
        ...prev,
        avatar_url: reader.result,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handlePasswordChange = async () => {
    setPasswordError("");
    setPasswordSuccess("");

    if (passwordData.new_password !== passwordData.confirm_password) {
      setPasswordError("New passwords do not match.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        URLS.API.AUTH.CHANGE_PASSWORD,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            current_password: passwordData.current_password,
            new_password: passwordData.new_password,
          }),
        },
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to change password");

      setPasswordSuccess("Password changed successfully!");
      setPasswordData({
        current_password: "",
        new_password: "",
        confirm_password: "",
      });
    } catch (err: any) {
      setPasswordError(err.message);
    }
  };

  const handleSave = async () => {
    setProfileMessage("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(URLS.API.USERS.PROFILE, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          full_name: editedData.full_name,
          avatar_url: editedData.avatar_url,
          bio: editedData.profile?.bio || "",
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update profile");

      setIsEditing(false);
      setProfileMessage("Profile updated successfully!");
    } catch (error: any) {
      setProfileMessage(error.message);
    }
  };

  const handleCancel = () => {
    setEditedData(user);
    setIsEditing(false);
  };

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else {
      setEditedData({ ...user, profile: user.profile || {} });

      const fetchEnrolledCourses = async () => {
        try {
          const token = localStorage.getItem("token");
          const res = await fetch(
            URLS.API.ENROLLMENTS.MY_COURSES,
            {
              headers: { Authorization: `Bearer ${token}` },
            },
          );
          const data = await res.json();
          setEnrolledCourses(data.data || []);
          return data.data || [];
        } catch (err) {
          console.error("Failed to fetch enrolled courses", err);
          return [];
        }
      };

      const fetchCertificateCourses = async (courses: any[]) => {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        const results = await Promise.all(
          courses.map((course: any) =>
            fetch(
              URLS.API.ANALYTICS.PROGRESS(course._id),
              {
                headers,
              },
            )
              .then((res) => res.json())
              .then((data) => ({
                course,
                progress: data?.data?.progress || 0,
              }))
              .catch(() => ({ course, progress: 0 })),
          ),
        );

        const completedCourses = results
          .filter(({ progress }) => progress === 100)
          .map(({ course }) => course);

        setCertificateCourses(completedCourses);
      };

      if (user.role !== "instructor") {
        fetchEnrolledCourses().then((courses) => {
          fetchCertificateCourses(courses);
        });
      }
    }
  }, [user, navigate]);

  if (!editedData) return null;

  return (
    <AppLayout>
      <div className="container px-4 py-8 max-w-6xl">
        {/* Avatar & Header */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={editedData.avatar_url} />
                    <AvatarFallback className="text-2xl">
                      {editedData.full_name
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <>
                      <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={handleAvatarUpload}
                        className="hidden"
                      />
                      <Button
                        size="sm"
                        className="absolute -bottom-2 -right-2 rounded-full p-2"
                        onClick={handleAvatarButtonClick}
                      >
                        <Camera className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <h1 className="text-3xl font-bold">
                      {editedData.full_name}
                    </h1>
                    <Badge variant="secondary">{editedData.role}</Badge>
                  </div>
                  <p className="text-muted-foreground">{editedData.email}</p>
                  <div className="flex space-x-4 text-sm text-muted-foreground">
                    {/* <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <span>{editedData.location || "Unknown"}</span>
                    </div> */}
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>
                        Joined{" "}
                        {new Date(editedData.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <Button
                onClick={() =>
                  isEditing ? handleCancel() : setIsEditing(true)
                }
              >
                {isEditing ? (
                  <>
                    <X className="mr-2 h-4 w-4" /> Cancel
                  </>
                ) : (
                  <>
                    <Edit className="mr-2 h-4 w-4" /> Edit Profile
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            {editedData.role !== "instructor" && (
              <TabsTrigger value="courses">Courses</TabsTrigger>
            )}
            {editedData.role !== "instructor" && (
              <TabsTrigger value="certificates">Certificates</TabsTrigger>
            )}
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>About Me</CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <>
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      rows={4}
                      value={editedData.profile?.bio || ""}
                      onChange={(e) =>
                        setEditedData({
                          ...editedData,
                          profile: {
                            ...editedData.profile,
                            bio: e.target.value,
                          },
                        })
                      }
                    />
                    <Button onClick={handleSave}>
                      <Save className="mr-2 h-4 w-4" /> Save Changes
                    </Button>
                    {profileMessage && (
                      <p className="text-sm text-muted-foreground">
                        {profileMessage}
                      </p>
                    )}
                  </>
                ) : (
                  <p className="text-muted-foreground">
                    {editedData.profile?.bio || "No bio added."}
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {editedData.role !== "instructor" && (
            <TabsContent value="courses" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>My Courses</CardTitle>
                </CardHeader>
                <CardContent>
                  {enrolledCourses.length === 0 ? (
                    <p className="text-muted-foreground">
                      No enrolled courses yet.
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {enrolledCourses.map((course: any) => (
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
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/course/${course._id}`)}
                          >
                            View
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {editedData.role !== "instructor" && (
            <TabsContent value="certificates" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Certificates</CardTitle>
                </CardHeader>
                <CardContent>
                  {certificateCourses.length === 0 ? (
                    <p className="text-muted-foreground">
                      You have not completed any courses yet.
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {certificateCourses.map((course: any) => (
                        <div
                          key={course._id}
                          className="flex items-center justify-between p-4 border rounded-lg"
                        >
                          <div className="flex items-center space-x-4">
                            <img
                              src={
                                course.thumbnail_url
                                  ? URLS.FILES.THUMBNAIL(course.thumbnail_url)
                                  : "https://via.placeholder.com/120x80"
                              }
                              alt={course.title}
                              className="w-16 h-12 rounded object-cover"
                            />
                            <div>
                              <h4 className="font-semibold">{course.title}</h4>
                              <p className="text-sm text-muted-foreground">
                                Completed by {user.full_name}
                              </p>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            onClick={() =>
                              navigate(
                                `/certificate?course=${encodeURIComponent(course.title)}&name=${encodeURIComponent(user.full_name)}`,
                              )
                            }
                          >
                            View Certificate
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          )}

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Label>Full Name</Label>
                <Input
                  value={editedData.full_name}
                  onChange={(e) =>
                    setEditedData({ ...editedData, full_name: e.target.value })
                  }
                  readOnly={!isEditing}
                />
                <Label>Email</Label>
                <Input value={editedData.email} readOnly />
                <Label>Role</Label>
                <Input value={editedData.role} readOnly />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>
                  <Shield className="inline-block mr-2 h-4 w-4" /> Change
                  Password
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Label>Current Password</Label>
                <Input
                  type="password"
                  value={passwordData.current_password}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      current_password: e.target.value,
                    })
                  }
                />
                <Label>New Password</Label>
                <Input
                  type="password"
                  value={passwordData.new_password}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      new_password: e.target.value,
                    })
                  }
                />
                <Label>Confirm Password</Label>
                <Input
                  type="password"
                  value={passwordData.confirm_password}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      confirm_password: e.target.value,
                    })
                  }
                />
                {passwordError && (
                  <p className="text-red-500 text-sm">{passwordError}</p>
                )}
                {passwordSuccess && (
                  <p className="text-green-600 text-sm">{passwordSuccess}</p>
                )}
                <Button onClick={handlePasswordChange}>Update Password</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
