import { useEffect, useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { URLS } from '@/config/urls';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import AppLayout from "@/components/layout/AppLayout";
import { useAuth } from "@/AuthContext";
import { toast } from "sonner";

export default function NotificationPanel() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [form, setForm] = useState({ title: "", message: "" });
  const [loading, setLoading] = useState(false);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(URLS.API.NOTIFICATIONS.LIST);
      setNotifications(res.data.notifications || []);
    } catch (err) {
      toast.error("Failed to load notifications");
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post(URLS.API.NOTIFICATIONS.LIST, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Notification posted");
      setForm({ title: "", message: "" });
      fetchNotifications();
    } catch (err) {
      toast.error("Create failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(URLS.API.NOTIFICATIONS.DELETE(id), {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Notification deleted");
      fetchNotifications();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto px-4 py-10 space-y-6">
        <h1 className="text-2xl font-bold">Manage Notifications</h1>

        {(user?.role === "admin" || user?.role === "instructor") && (
          <form onSubmit={handleCreate} className="space-y-4 border p-4 rounded shadow">
            <Input
              placeholder="Title"
              value={form.title}
              onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
            />
            <Textarea
              placeholder="Message"
              value={form.message}
              onChange={(e) => setForm((prev) => ({ ...prev, message: e.target.value }))}
            />
            <Button type="submit" disabled={loading}>
              {loading ? "Posting..." : "Post Notification"}
            </Button>
          </form>
        )}

        <div className="space-y-4">
          <h2 className="text-lg font-semibold">All Notifications</h2>
          {notifications.map((n: any) => (
            <div key={n._id} className="p-4 border rounded space-y-1">
              <div className="font-medium">{n.title}</div>
              <div className="text-muted-foreground">{n.message}</div>
              <div className="text-xs text-gray-500">
                Posted by {n.createdBy?.full_name} ({n.createdBy?.role})
              </div>
              {(user?.role === "admin" || user?.role === "instructor") && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(n._id)}
                >
                  Delete
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
