// App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PublicLayout from './components/PublicLayout';
import DashboardLayout from './components/DashboardLayout';
import Homepage from './components/Homepage';
import AdminDashboard from './components/AdminDashboard';
import StudentDashboard from './components/StudentDashboard';
import TeacherDashboard from './components/TeacherDashboard';
import LessonView from './components/LessonView';
import QuizPage from './components/QuizPage';
import LabPage from './components/LabPage';
import { UserProvider, useUser } from './contexts/UserContext';
import { TourProvider } from './contexts/TourContext';
import { mobileService } from './services/mobileService';

const App: React.FC = () => {
  React.useEffect(() => {
    mobileService.setupAppListeners();
    mobileService.initPushNotifications();
  }, []);

  return (
    <UserProvider>
      <InnerApp />
    </UserProvider>
  );
};

const InnerApp: React.FC = () => {
  const { user, isLoading } = useUser();   // now safe — inside UserProvider

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <TourProvider user={user ?? null}>   {/* ← pass user here – fixes missing prop error */}
      <Router>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route
              path="/"
              element={
                user ? <Navigate to={`/dashboard/${user.role}`} replace /> : <Homepage />
              }
            />
          </Route>

          <Route element={<DashboardLayout />}>
            <Route
              path="/dashboard/student"
              element={user ? <StudentDashboard user={user} /> : <Navigate to="/" />}
            />
            <Route
              path="/dashboard/teacher"
              element={user ? <TeacherDashboard user={user} /> : <Navigate to="/" />}
            />
            <Route
              path="/dashboard/admin"
              element={user ? <AdminDashboard /> : <Navigate to="/" />}
            />
          </Route>

          <Route
            path="/lesson/:topicId"
            element={user ? <LessonView /> : <Navigate to="/" />}
          />
          <Route
            path="/quiz/:quizId"
            element={user ? <QuizPage /> : <Navigate to="/" />}
          />
          <Route
            path="/lab/:labId"
            element={user ? <LabPage /> : <Navigate to="/" />}
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </TourProvider>
  );
};

export default App;