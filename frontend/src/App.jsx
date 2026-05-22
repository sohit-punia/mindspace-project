import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import AppShell from './components/AppShell';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Journal from './pages/Journal';
import JournalNew from './pages/JournalNew';
import Chat from './pages/Chat';
import Breathe from './pages/Breathe';
import Crisis from './pages/Crisis';
import Profile from './pages/Profile';

function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

function PublicRoute({ children }) {
  const { user } = useAuth();
  return !user ? children : <Navigate to="/" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
      <Route path="/" element={<PrivateRoute><AppShell /></PrivateRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="journal" element={<Journal />} />
        <Route path="journal/new" element={<JournalNew />} />
        <Route path="chat" element={<Chat />} />
        <Route path="breathe" element={<Breathe />} />
        <Route path="crisis" element={<Crisis />} />
        <Route path="profile" element={<Profile />} />
      </Route>
    </Routes>
  );
}
