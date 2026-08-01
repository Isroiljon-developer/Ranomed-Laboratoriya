import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

// Boshqa paneldan redirect bo'lib kelsa URL'dagi tokenni o'qib saqlash
(function readTokenFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const token = params.get('_token');
  const user = params.get('_user');
  if (token) {
    localStorage.setItem('token', token);
    if (user) localStorage.setItem('user', user);
    window.history.replaceState({}, '', window.location.pathname);
  }
})();

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = '/login';
    return null;
  }
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
