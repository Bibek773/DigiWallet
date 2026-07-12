import { BrowserRouter, Routes, Route } from 'react-router-dom';

import HomePage from './pages/home/HomePage';
import RegisterPage from './pages/register/RegisterPage';
import LoginPage from './pages/login/LoginPage';
import TermsPage from './pages/terms/TermsPage';
import PrivacyPage from './pages/register/PrivacyPage';
import CollegeDashboard from './pages/college/CollegeDashboard';
import Students from './pages/college/Students';
import Credentials from './pages/college/Credentials';
import PendingRequests from './pages/college/PendingRequests';
import Verification from './pages/college/Verification';
import Profile from './pages/college/Profile';
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
        <Route path="/college/dashboard" element={<CollegeDashboard />} />  
        <Route path="/college/students" element={<Students />} /> 
        <Route path="/college/credentials" element={<Credentials/>} />
        <Route path="/college/pending-requests" element={<PendingRequests />} />
        <Route path="/college/verification" element={<Verification/>} />
        <Route path="/college/profile" element={<Profile/>} />
        <Route path="/student/dashboard" element={<StudentDashboard />} /> 

      </Routes>
    </BrowserRouter>
  );
}

export default App;