// AppLayout.tsx
import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { URLS } from '@/config/urls';
import { cn } from "@/lib/utils";
import {
  BookOpen,
  GraduationCap,
  Menu,
  Search,
  User,
  Bell,
  X,
  LogOut,
  Users as UsersIcon,
  LayoutList,
} from "lucide-react";
import { useAuth } from "@/AuthContext";
import axios from "axios";
import { toast } from "sonner";

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const navigation = (() => {
    if (!user) {
      return [
        { name: "Home", href: "/", icon: BookOpen },
        { name: "Courses", href: "/courses", icon: GraduationCap },
      ];
    }

    const base = [
      { name: "Home", href: "/", icon: BookOpen },
      { name: "Courses", href: "/courses", icon: GraduationCap },
      { name: "My Learning", href: "/my-learning", icon: User },
    ];

    if (user.role === "instructor") {
      return [
        ...base,
        {
          name: "Instructor Dashboard",
          href: "/instructor-dashboard",
          icon: User,
        },
        { name: "Manage Lessons", href: "/lessons", icon: LayoutList },
      ];
    }

    if (user.role === "admin") {
      return [
        ...base,
        {
          name: "Instructor Dashboard",
          href: "/instructor-dashboard",
          icon: User,
        },
        { name: "Manage Lessons", href: "/lessons", icon: LayoutList },
        { name: "Manage Users", href: "/admin", icon: UsersIcon },
        { name: "Affiliations", href: "/affiliations", icon: LayoutList },
        { name: "Franchise", href: "/franchise", icon: LayoutList },
      ];
    }

    // Default for student
    return base;
  })();

  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get(URLS.API.NOTIFICATIONS.LIST);
        setNotifications(res.data.notifications || []);
      } catch (err) {
        console.error("Failed to load notifications", err);
      }
    };

    fetchNotifications();
  }, []);

  const handleDeleteNotification = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(URLS.API.NOTIFICATIONS.DELETE(id), {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(notifications.filter((n) => n._id !== id));
      toast.success("Notification deleted");
    } catch (err) {
      toast.error("Failed to delete");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center px-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <GraduationCap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="hidden font-bold sm:inline-block">EduFlow</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="mx-6 hidden items-center space-x-4 lg:flex lg:space-x-6">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary",
                    location.pathname === item.href
                      ? "text-primary"
                      : "text-muted-foreground",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Section */}
          <div className="flex flex-1 items-center justify-end space-x-4">
            <div className="w-full flex-1 md:w-auto md:flex-none">
              <div className="relative">{/* Optional search */}</div>
            </div>

            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <Bell className="h-4 w-4" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-primary text-[10px] font-medium text-white flex items-center justify-center">
                    {notifications.length}
                  </span>
                )}
              </Button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white border rounded shadow z-50 max-h-96 overflow-y-auto">
                  <div className="p-4 border-b font-semibold">
                    Notifications
                  </div>

                  {notifications.length === 0 ? (
                    <div className="p-4 text-sm text-muted-foreground">
                      No notifications available.
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n._id}
                        className="p-3 border-b space-y-1 text-sm"
                      >
                        <div className="font-medium">{n.title}</div>
                        <div className="text-muted-foreground">{n.message}</div>
                        {n.createdBy?.full_name && (
                          <div className="text-xs text-muted-foreground italic">
                            Posted by: {n.createdBy.full_name}
                          </div>
                        )}

                        {(user?.role === "admin" ||
                          user?.role === "instructor") && (
                          <button
                            onClick={() => handleDeleteNotification(n._id)}
                            className="text-xs text-red-600 hover:underline"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    ))
                  )}

                  {/* Manage Notifications Button */}
                  {(user?.role === "admin" || user?.role === "instructor") && (
                    <div className="p-3 border-t text-right">
                      <Link
                        to="/notifications"
                        className="text-sm text-primary font-medium hover:underline"
                        onClick={() => setShowNotifications(false)}
                      >
                        Manage Notifications →
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>

            {user ? (
              <div className="relative" ref={dropdownRef}>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  <User className="h-4 w-4" />
                </Button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow z-50">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm hover:bg-gray-100"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Profile
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login">
                <Button variant="ghost" size="icon">
                  <User className="h-4 w-4" />
                </Button>
              </Link>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-4 w-4" />
              ) : (
                <Menu className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="border-b border-border/40 lg:hidden">
            <div className="container space-y-1 px-4 pb-3 pt-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      "flex items-center space-x-3 rounded-md px-3 py-2 text-base font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                      location.pathname === item.href
                        ? "bg-accent text-accent-foreground"
                        : "text-foreground",
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-muted/40">
        <div className="container px-4 py-12">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            {/* About */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                  <GraduationCap className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="font-bold">EduFlow</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Empowering learners worldwide with cutting-edge online education
                platform.
              </p>
            </div>

            {/* Platform Links */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold">Platform</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link to="/courses" className="hover:text-foreground">
                    Browse Courses
                  </Link>
                </li>
                <li>
                  <Link to="/instructors" className="hover:text-foreground">
                    Become Instructor
                  </Link>
                </li>
                <li>
                  <Link to="/enterprise" className="hover:text-foreground">
                    Enterprise
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support Links */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold">Support</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link to="/help" className="hover:text-foreground">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-foreground">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link to="/community" className="hover:text-foreground">
                    Community
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold">Legal</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link to="/privacy" className="hover:text-foreground">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="hover:text-foreground">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link to="/cookies" className="hover:text-foreground">
                    Cookie Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 border-t border-border/40 pt-8">
            <p className="text-center text-sm text-muted-foreground">
              © 2025 EduFlow. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
