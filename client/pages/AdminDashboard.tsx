import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { URLS } from '@/config/urls';
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AppLayout from "@/components/layout/AppLayout";
import { Eye, MoreHorizontal, Search, Shield, X } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";


// Chart imports
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";

const COLORS = [
  "#6366f1", // Indigo
  "#10b981", // Emerald
  "#f59e0b", // Amber
  "#ef4444", // Red
  "#3b82f6", // Blue
  "#a855f7", // Purple
  "#14b8a6", // Teal
  "#eab308", // Yellow
  "#f97316", // Orange
  "#8b5cf6", // Violet
  "#06b6d4", // Cyan
  "#84cc16", // Lime
  "#ec4899", // Pink
  "#22d3ee", // Sky
  "#4ade80", // Green
  "#facc15", // Gold
  "#c084fc", // Light Purple
  "#f472b6", // Light Pink
  "#34d399", // Mint
  "#94a3b8", // Slate
];



interface UserRow {
  _id: string;
  full_name: string;
  email: string;
  createdAt: string;
  is_active: boolean;
  role?: string;
  courses_count?: number;
  total_spent?: number;
}

interface CourseRow {
  _id: string;
  title: string;
  created_by?: { full_name: string };
  enrolled_count?: number;
  createdAt: string;
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<UserRow[]>([]);
  const [courses, setCourses] = useState<CourseRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserRow | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(URLS.API.USERS.LIST, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data.data || []);
    } catch (err: any) {
      setError(err.message || "Failed to fetch users");
      toast.error("❌ Failed to fetch users");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(URLS.API.COURSES.LIST, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCourses(res.data.data || []);
    } catch (err: any) {
      setError(err.message || "Failed to fetch courses");
      toast.error("❌ Failed to fetch courses");
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "overview") {
      fetchUsers();
      fetchCourses();
    }
    if (activeTab === "users") fetchUsers();
    if (activeTab === "courses") fetchCourses();
  }, [activeTab]);

  const viewUserProfile = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(URLS.API.USERS.DETAIL(id), {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSelectedUser(res.data.data);
      setShowProfileModal(true);
    } catch {
      toast.error("❌ Error fetching user profile");
    }
  };

  const deleteUser = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(URLS.API.USERS.DELETE(id), {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.filter((u) => u._id !== id));
      toast.success("🗑️ User deleted successfully");
    } catch {
      toast.error("❌ Failed to delete user");
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const totalRevenue = users.reduce((sum, u) => sum + (u.total_spent ?? 0), 0);
  const totalStudents = users.filter((u) => u.role === "student").length;
  const totalInstructors = users.filter((u) => u.role === "instructor").length;

  // REPLACE ONLY THIS SECTION in your file before <ResponsiveContainer>
  const cumulativeRevenueData = () => {
    const revenueByDate: Record<string, number> = {};

    users.forEach((u) => {
      const date = new Date(u.createdAt).toLocaleDateString("en-GB");
      revenueByDate[date] = (revenueByDate[date] || 0) + (u.total_spent ?? 0);
    });

    const sortedDates = Object.keys(revenueByDate).sort(
      (a, b) => new Date(a).getTime() - new Date(b).getTime(),
    );

    let total = 0;
    const cumulative = sortedDates.map((date) => {
      total += revenueByDate[date];
      return { date, revenue: total };
    });

    return cumulative;
  };

  const userSignupsData = () => {
    const signupByDate: Record<string, number> = {};

    users.forEach((u) => {
      const date = new Date(u.createdAt).toLocaleDateString("en-GB"); // e.g., 15/07/2025
      signupByDate[date] = (signupByDate[date] || 0) + 1;
    });

    const sortedDates = Object.keys(signupByDate).sort(
      (a, b) => new Date(a).getTime() - new Date(b).getTime(),
    );

    let total = 0;
    return sortedDates.map((date) => {
      total += signupByDate[date];
      return { date, users: total };
    });
  };

  const roleDistributionData = () => {
    const counts: Record<string, number> = {};

    users.forEach((u) => {
      const role = u.role || "unknown";
      counts[role] = (counts[role] || 0) + 1;
    });

    return Object.entries(counts).map(([role, count]) => ({
      role,
      count,
    }));
  };

  const coursePopularityData = () => {
    return courses.map((course) => ({
      title: course.title,
      enrolled: course.enrolled_count || 0,
    }));
  };

  const revenueByCourseData = () => {
    const revenueMap: Record<string, number> = {};

    users.forEach((u) => {
      if (u.courses_count && u.total_spent) {
        const avgRevenuePerCourse = u.total_spent / u.courses_count;
        courses.forEach((course) => {
          // Just a simple distribution assuming all users bought all
          revenueMap[course.title] =
            (revenueMap[course.title] || 0) + avgRevenuePerCourse;
        });
      }
    });

    return Object.entries(revenueMap).map(([title, revenue]) => ({
      title,
      revenue: Number(revenue.toFixed(2)),
    }));
  };

  return (
    <AppLayout>
      <div className="container px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="courses">Courses</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <Card>
              <CardHeader>
                <CardTitle>Platform Overview</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p>Loading metrics...</p>
                ) : users.length || courses.length ? (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      <Card>
                        <CardHeader>
                          <CardTitle>Total Users</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-2xl font-bold">{users.length}</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader>
                          <CardTitle>Students</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-2xl font-bold">{totalStudents}</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader>
                          <CardTitle>Instructors</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-2xl font-bold">
                            {totalInstructors}
                          </p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader>
                          <CardTitle>Total Courses</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-2xl font-bold">{courses.length}</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader>
                          <CardTitle>Total Revenue</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-2xl font-bold">
                            ${totalRevenue.toFixed(2)}
                          </p>
                        </CardContent>
                      </Card>
                    </div>

                    <Card className="mt-6">
                      <CardHeader>
                        <CardTitle>Monthly Revenue Trend</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                          <LineChart data={cumulativeRevenueData()}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Line
                              type="monotone"
                              dataKey="revenue"
                              stroke="#6366f1"
                              strokeWidth={2}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                    <Card className="mt-6">
                      <CardHeader>
                        <CardTitle>
                          User Joined Over Time(Platform Growth)
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                          <LineChart data={userSignupsData()}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Line
                              type="monotone"
                              dataKey="users"
                              stroke="#22c55e"
                              strokeWidth={2}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                    {/* <Card className="mt-6">
                      <CardHeader>
                        <CardTitle>User Role Distribution</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                          <LineChart data={roleDistributionData()}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="role" />
                            <YAxis />
                            <Tooltip />
                            <Line
                              type="monotone"
                              dataKey="count"
                              stroke="#f59e0b"
                              strokeWidth={2}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card> */}

                    <Card className="mt-6">
                      <CardHeader>
                        <CardTitle>Course Popularity (Enrollments)</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                          <LineChart data={coursePopularityData()}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                              dataKey="title"
                              interval={0}
                              angle={-45}
                              textAnchor="end"
                              height={80}
                            />
                            <YAxis />
                            <Tooltip />
                            <Line
                              type="monotone"
                              dataKey="enrolled"
                              stroke="#ef4444"
                              strokeWidth={2}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>

                    {/* <Card className="mt-6">
                      <CardHeader>
                        <CardTitle>Revenue by Course (Estimated)</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                          <LineChart data={revenueByCourseData()}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                              dataKey="title"
                              interval={0}
                              angle={-45}
                              textAnchor="end"
                              height={80}
                            />
                            <YAxis />
                            <Tooltip />
                            <Line
                              type="monotone"
                              dataKey="revenue"
                              stroke="#8b5cf6"
                              strokeWidth={2}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card> */}
                  </>
                ) : (
                  <p className="text-muted-foreground">No metrics available.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">User Management</h3>
              <div className="relative">
                <Search className="absolute left-2 top-2 text-muted-foreground" />
                <Input
                  className="pl-8 w-64"
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            {error && <div className="text-red-600 font-medium">{error}</div>}
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Courses</TableHead>
                    <TableHead>Total Spent</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center">
                        Loading users...
                      </TableCell>
                    </TableRow>
                  ) : filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center">
                        No users found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((u) => (
                      <TableRow key={u._id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{u.full_name}</p>
                            <p className="text-sm text-muted-foreground">
                              {u.email}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          {new Date(u.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={u.is_active ? "default" : "secondary"}
                          >
                            {u.is_active ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell>{u.courses_count ?? 0}</TableCell>
                        <TableCell>
                          ${(u.total_spent ?? 0).toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem
                                onClick={() => viewUserProfile(u._id)}
                              >
                                <Eye className="mr-2 h-4 w-4" /> View Profile
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => deleteUser(u._id)}
                                className="text-destructive"
                              >
                                <Shield className="mr-2 h-4 w-4" /> Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          <TabsContent value="courses">
            <Card>
              <CardHeader>
                <CardTitle>Courses & Enrollment</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Instructor</TableHead>
                      <TableHead>Enrolled</TableHead>
                      <TableHead>Created</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center">
                          Loading courses...
                        </TableCell>
                      </TableRow>
                    ) : courses.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center">
                          No courses found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      courses.map((course) => (
                        <TableRow key={course._id}>
                          <TableCell>{course.title}</TableCell>
                          <TableCell>
                            {course.created_by?.full_name || "Unknown"}
                          </TableCell>
                          <TableCell>{course.enrolled_count ?? 0}</TableCell>
                          <TableCell>
                            {new Date(course.createdAt).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {showProfileModal && selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">User Profile</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowProfileModal(false)}
                >
                  <X />
                </Button>
              </div>
              <div className="space-y-2">
                <p>
                  <strong>Name:</strong> {selectedUser.full_name}
                </p>
                <p>
                  <strong>Email:</strong> {selectedUser.email}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  {selectedUser.is_active ? "Active" : "Inactive"}
                </p>
                <p>
                  <strong>Joined:</strong>{" "}
                  {new Date(selectedUser.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
