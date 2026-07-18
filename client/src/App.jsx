import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";

import HomePage from "./pages/home/Homepage";
import RegisterPage from "./pages/register/RegisterPage";
import LoginPage from "./pages/login/LoginPage";
import TermsPage from "./pages/terms/TermsPage";
import PrivacyPage from "./pages/register/PrivacyPage";
import VerifyPage from "./pages/VerifyPage";

import CollegeDashboard from "./pages/college/CollegeDashboard";
import Students from "./pages/college/Students";
import Credentials from "./pages/college/Credentials";
import PendingRequests from "./pages/college/PendingRequests";
import Verification from "./pages/college/Verification";
import Profile from "./pages/college/Profile";

import StudentDashboard from "./pages/student/StudentDashboard";

import AdminDashboard from "./pages/admin/AdminDashboard";
import CreateCollegePage from "./pages/admin/CreateCollegePage";

import { AuthProvider } from "./context/AuthContext";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";
import Settings from "./pages/college/Settings";
import CollegeLayout from "./components/CollegeLayout";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/verify/:credentialId" element={<VerifyPage />} />

          <Route path="/student" element={<Navigate to="/student/home" replace />} />
          <Route path="/student/dashboard" element={<Navigate to="/student/home" replace />} />
          <Route path="/student/home" element={<StudentDashboard />} />
          <Route path="/student/mywallet" element={<StudentDashboard />} />
          <Route path="/student/profile" element={<StudentDashboard />} />
          <Route path="/student/settings" element={<StudentDashboard />} />

          <Route path="/college" element={<CollegeLayout />}>
            <Route path="dashboard" element={<CollegeDashboard />} />
            <Route path="students" element={<Students />} />
            <Route path="credentials" element={<Credentials />} />
            <Route path="pending-requests" element={<PendingRequests />} />
            <Route path="verification" element={<Verification />} />
            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          <Route path="/admin" element={<Navigate to="/login" replace />} />

          <Route
            path="/admin/dashboard"
            element={
              <ProtectedAdminRoute>
                <AdminDashboard />
              </ProtectedAdminRoute>
            }
          />

          <Route
            path="/admin/colleges/create"
            element={
              <ProtectedAdminRoute>
                <CreateCollegePage />
              </ProtectedAdminRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
