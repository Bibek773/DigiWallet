import { BrowserRouter, Link, Routes, Route } from 'react-router-dom';

import RegisterPage from './pages/RegisterPage';
import Login from './pages/login/LoginPage';
import LoginPage from './pages/login/LoginPage';

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

      </Routes>
    </BrowserRouter>
  );
}

export default App;
