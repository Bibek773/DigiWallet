import { BrowserRouter, Link, Routes, Route } from 'react-router-dom';

import RegisterPage from './pages/RegisterPage';

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
            </div>
          }
        />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
