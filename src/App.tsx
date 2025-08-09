import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClientProvider } from "./providers/QueryClientProvider";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { useEffect } from "react";
import { initializeApp } from "./utils/initializeApp";
import Index from "./pages/Index";
import About from "./pages/About";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import DashboardLayout from "./components/DashboardLayout";
import MainLayout from "./components/MainLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardOverview from "./pages/dashboard/DashboardOverview";
import Analytics from "./pages/dashboard/Analytics";
import ResumeBuilder from "./pages/dashboard/ResumeBuilder";
import FaceToFaceInterview from "./pages/dashboard/FaceToFaceInterview";
import ReviewsDashboard from "./pages/dashboard/ReviewsDashboard";
import Settings from "./pages/dashboard/Settings";
import Roadmap from "./pages/dashboard/Roadmap";
import EnhancedMCQs from "./pages/dashboard/EnhancedMCQs";
import EnhancedCoding from "./pages/dashboard/EnhancedCoding";
import Discussions from "./pages/dashboard/Discussions";
import Leaderboard from "./pages/dashboard/Leaderboard";
import Auth from "./pages/Auth";
import Profile from "./pages/dashboard/Profile";
import CompanyPractice from "./pages/CompanyPractice";
import CompanyProfile from "./pages/CompanyProfile";
import EnhancedCodingPractice from "./pages/EnhancedCodingPractice";

const App = () => {
  // Initialize app with fresh state on first load
  useEffect(() => {
    const isFirstLoad = !localStorage.getItem('geniq_app_state');
    if (isFirstLoad) {
      initializeApp();
    }
  }, []);

  return (
    <QueryClientProvider>
      <ThemeProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
          <Routes>
            {/* Public routes with MainLayout */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<Services />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/companies" element={<CompanyPractice />} />
              <Route path="/companies/:companyId" element={<CompanyProfile />} />
              <Route path="/practice/:problemId" element={<EnhancedCodingPractice />} />
            </Route>
            
            {/* Protected Dashboard routes with DashboardLayout */}
            <Route element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Outlet />
                </DashboardLayout>
              </ProtectedRoute>
            }>
              <Route path="/dashboard" element={<DashboardOverview />} />
              <Route path="/dashboard/analytics" element={<Analytics />} />
              <Route path="/dashboard/coding" element={<EnhancedCoding />} />
              <Route path="/dashboard/mcqs" element={<EnhancedMCQs />} />
              <Route path="/dashboard/resume" element={<ResumeBuilder />} />
              <Route path="/dashboard/face-to-face" element={<FaceToFaceInterview />} />
              <Route path="/dashboard/reviews" element={<ReviewsDashboard />} />
              <Route path="/dashboard/settings" element={<Settings />} />
              <Route path="/dashboard/roadmap" element={<Roadmap />} />
              <Route path="/dashboard/discussions" element={<Discussions />} />
              <Route path="/dashboard/leaderboard" element={<Leaderboard />} />
              <Route path="/dashboard/profile" element={<Profile />} />
            </Route>
            
            {/* 404 Not Found */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </ThemeProvider>
  </QueryClientProvider>
  );
};

export default App;
