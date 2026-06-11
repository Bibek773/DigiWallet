import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Pages — uncomment as each sprint implements them
// import LoginPage           from './pages/LoginPage';
// import RegisterPage        from './pages/RegisterPage';
// import AdminDashboard      from './pages/AdminDashboard';
// import CollegeDashboard    from './pages/CollegeDashboard';
// import IssueCredentialPage from './pages/IssueCredentialPage';
// import IssuedCredentials   from './pages/IssuedCredentials';
// import StudentWallet       from './pages/StudentWallet';
// import VerifyPage          from './pages/VerifyPage';
// import VerifyResult        from './pages/VerifyResult';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Routes will be added in Sprint 1 */}
        <Route path="/" element={<div>DiGiWallet — Sprint 1 coming soon</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
