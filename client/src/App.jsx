import { BrowserRouter, Routes, Route } from 'react-router-dom';

import HomePage from './pages/home/HomePage';
import RegisterPage from './pages/register/RegisterPage';
import LoginPage from './pages/login/LoginPage';
import TermsPage from './pages/terms/TermsPage';
import PrivacyPage from './pages/register/PrivacyPage';
import StudentDashboard from './pages/student/StudentDashboard'; 

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/student/dashboard" element={<StudentDashboard />} /> 

      </Routes>
    </BrowserRouter>
  );
}

export default App;