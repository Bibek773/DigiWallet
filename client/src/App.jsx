import { BrowserRouter, Link, Routes, Route } from 'react-router-dom';

import RegisterPage from './pages/register/RegisterPage';
import Login from './pages/login/LoginPage';
import LoginPage from './pages/login/LoginPage';
import TermsPage from './pages/terms/TermsPage';
import PrivacyPage from './pages/register/PrivacyPage';
import CollegeDashboard from './pages/college/CollegeDashboard';
import Students from './pages/college/Students';
import Credentials from './pages/college/Credentials';
import PendingRequests from './pages/college/PendingRequests';
import Verification from './pages/college/Verification';
import Profile from './pages/college/Profile';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <div style={{ padding: '32px', fontFamily: 'sans-serif' }}>
              <h1>DiGiWallet</h1>
              <p>
                Open the registration page here: <Link to="/register">/register</Link>
              </p>
              <p>
                Open the login page here: <Link to="/login">/login</Link>
              </p>
            </div>
          }
        />
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
      </Routes>
    </BrowserRouter>
  );
}

export default App;
