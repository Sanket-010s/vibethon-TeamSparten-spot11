import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProviders } from './context/AppProviders';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import ModulesPage from './pages/ModulesPage';
import PlaygroundPage from './pages/PlaygroundPage';
import GamesPage from './pages/GamesPage';
import QuizPage from './pages/QuizPage';
import TutorPage from './pages/TutorPage';
import LeaderboardPage from './pages/LeaderboardPage';
import ProtectedRoute from './components/ProtectedRoute';
import './styles/globals.css';

function App() {
  return (
    <AppProviders>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/modules" element={<ProtectedRoute><ModulesPage /></ProtectedRoute>} />
          <Route path="/playground" element={<ProtectedRoute><PlaygroundPage /></ProtectedRoute>} />
          <Route path="/games" element={<ProtectedRoute><GamesPage /></ProtectedRoute>} />
          <Route path="/quiz" element={<ProtectedRoute><QuizPage /></ProtectedRoute>} />
          <Route path="/tutor" element={<ProtectedRoute><TutorPage /></ProtectedRoute>} />
          <Route path="/leaderboard" element={<ProtectedRoute><LeaderboardPage /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProviders>
  );
}

export default App;
