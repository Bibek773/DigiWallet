import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom';

import HomePage from './pages/home/Homepage';
import RegisterPage from './pages/register/RegisterPage';
import LoginPage from './pages/login/LoginPage';
import TermsPage from './pages/terms/TermsPage';
import PrivacyPage from './pages/register/PrivacyPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import CreateCollegePage from './pages/admin/CreateCollegePage';
import CollegeDashboard from './pages/CollegeDashboard';
import StudentDashboard from './pages/student/StudentDashboard';
import { AuthProvider } from './context/AuthContext';
import ProtectedAdminRoute from './components/ProtectedAdminRoute';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/college/dashboard" element={<CollegeDashboard />} />
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
