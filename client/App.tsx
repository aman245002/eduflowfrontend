import "./global.css";

import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

import { AuthProvider } from "@/AuthContext";

// Pages
import Index from "./pages/Index";
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";
import LessonViewer from "./pages/LessonViewer";
import Quiz from "./pages/Quiz";
import MyLearning from "./pages/MyLearning";
import Profile from "./pages/Profile";
import Certificate from "./pages/Certificate";
import InstructorDashboard from "./pages/InstructorDashboard";
import ManageLessons from "./pages/ManageLessons";
import AdminDashboard from "./pages/AdminDashboard";
import Affiliations from "./pages/Affiliations"; // ✅ NEW
import Franchise from "./pages/Franchise"; // ✅ NEW
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import CookiePolicy from "./pages/CookiePolicy";
import BecomeInstructor from "./pages/BecomeInstructor";
import Enterprise from "./pages/Enterprise";
import Help from "./pages/Help";
import Contact from "./pages/Contact";
import Community from "./pages/Community";
import NotificationPanel from "./pages/NotificationPanel";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/course/:id" element={<CourseDetail />} />
            <Route path="/lesson/:id" element={<LessonViewer />} />
            <Route path="/quiz/:id" element={<Quiz />} />
            <Route path="/my-learning" element={<MyLearning />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/certificate" element={<Certificate />} />
            <Route
              path="/instructor-dashboard"
              element={<InstructorDashboard />}
            />
            <Route path="/lessons" element={<ManageLessons />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/affiliations" element={<Affiliations />} />{" "}
            {/* ✅ New */}
            <Route path="/franchise" element={<Franchise />} /> {/* ✅ New */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<NotFound />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/cookies" element={<CookiePolicy />} />
            <Route path="/instructors" element={<BecomeInstructor />} />
            <Route path="/enterprise" element={<Enterprise />} />
            <Route path="/help" element={<Help />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/community" element={<Community />} />
            <Route path="/notifications" element={<NotificationPanel />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
