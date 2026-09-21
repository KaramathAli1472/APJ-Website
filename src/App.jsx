import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import MainLayout from "./layouts/MainLayout/MainLayout";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import StudentProtectedRoute from "./components/StudentProtectedRoute/StudentProtectedRoute";

// =========================
// Public Pages
// =========================

import Home from "./pages/Home/Home";
import About from "./pages/About/About";
import Admission from "./pages/Admission/Admission";
import Syllabus from "./pages/Syllabus/Syllabus";
import Classes from "./pages/Classes/Classes";
import Gallery from "./pages/Gallery/Gallery";
import Notices from "./pages/Notices/Notices";
import FAQ from "./pages/FAQ/FAQ";
import Contact from "./pages/Contact/Contact";
import StudentLogin from "./pages/StudentLogin/StudentLogin";
import StudentDashboard from "./pages/StudentDashboard/StudentDashboard";

// =========================
// Admin Pages
// =========================

import AdminLogin from "./pages/AdminLogin/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard/AdminDashboard";

import AdminRegistrations from "./pages/AdminRegistrations/AdminRegistrations";
import AdminSyllabus from "./pages/AdminSyllabus/AdminSyllabus";
import AdminClasses from "./pages/AdminClasses/AdminClasses";
import AdminGallery from "./pages/AdminGallery/AdminGallery";
import AdminNotices from "./pages/AdminNotices/AdminNotices";
import AdminSettings from "./pages/AdminSettings/AdminSettings";
import AdminExams from "./pages/AdminExams/AdminExams";
import StudentExam from "./pages/StudentExam/StudentExam";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ==================================================
            PUBLIC WEBSITE
        ================================================== */}

        <Route element={<MainLayout />}>

          {/* Home */}
          <Route
            path="/"
            element={<Home />}
          />

          {/* About */}
          <Route
            path="/about"
            element={<About />}
          />

          {/* Student Registration */}
          <Route
            path="/admission"
            element={<Admission />}
          />

          {/* Syllabus */}
          <Route
            path="/syllabus"
            element={<Syllabus />}
          />

          {/* Classes */}
          <Route
            path="/classes"
            element={<Classes />}
          />

          {/* Gallery */}
          <Route
            path="/gallery"
            element={<Gallery />}
          />

          {/* Notices */}
          <Route
            path="/notices"
            element={<Notices />}
          />

          {/* FAQ */}
          <Route
            path="/faq"
            element={<FAQ />}
          />

          {/* Contact */}
          <Route
            path="/contact"
            element={<Contact />}
          />

          <Route
            path="/student/login"
            element={<StudentLogin />}
          />

        </Route>

        <Route
          path="/student/dashboard"
          element={
            <StudentProtectedRoute>
              <StudentDashboard />
            </StudentProtectedRoute>
          }
        />


        {/* ==================================================
            ADMIN LOGIN
        ================================================== */}

        <Route
          path="/admin/login"
          element={<AdminLogin />}
        />


        {/* ==================================================
            PROTECTED ADMIN PANEL
        ================================================== */}

        {/* Dashboard */}

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />


        {/* Student Registrations */}

        <Route
          path="/admin/registrations"
          element={
            <ProtectedRoute>
              <AdminRegistrations />
            </ProtectedRoute>
          }
        />


        {/* Syllabus */}

        <Route
          path="/admin/syllabus"
          element={
            <ProtectedRoute>
              <AdminSyllabus />
            </ProtectedRoute>
          }
        />


        {/* Classes */}

        <Route
          path="/admin/classes"
          element={
            <ProtectedRoute>
              <AdminClasses />
            </ProtectedRoute>
          }
        />


        {/* Gallery */}

        <Route
          path="/admin/gallery"
          element={
            <ProtectedRoute>
              <AdminGallery />
            </ProtectedRoute>
          }
        />


        {/* Notices */}

        <Route
          path="/admin/notices"
          element={
            <ProtectedRoute>
              <AdminNotices />
            </ProtectedRoute>
          }
        />


        {/* Settings */}

        <Route
          path="/admin/settings"
          element={
            <ProtectedRoute>
              <AdminSettings />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/exams"
          element={
            <ProtectedRoute>
              <AdminExams />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/exams/:examId"
          element={
            <StudentProtectedRoute>
              <StudentExam />
            </StudentProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;