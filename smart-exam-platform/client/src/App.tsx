import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Layouts
import DashboardLayout from './layouts/DashboardLayout';
import AuthLayout from './layouts/AuthLayout';

// Auth Pages
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyEmail from './pages/VerifyEmail';

// Dashboard & Feature Pages
import Dashboard from './pages/Dashboard';
import StudentExams from './pages/StudentExams';
import StudentResults from './pages/StudentResults';
import DigitalEvaluation from './pages/DigitalEvaluation';
import QuestionBank from './pages/QuestionBank';
import FacultyAnalytics from './pages/FacultyAnalytics';
import ExamSchedules from './pages/ExamSchedules';
import RoomAllocations from './pages/RoomAllocations';
import AcademicRecords from './pages/AcademicRecords';
import ReportsAudit from './pages/ReportsAudit';
import ParentWard from './pages/ParentWard';

// Route Guards
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <svg className="animate-spin h-10 w-10 text-indigo-500" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span className="text-slate-400 text-sm font-semibold tracking-wider animate-pulse">Loading Platform...</span>
        </div>
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return null;
  return !isAuthenticated ? <>{children}</> : <Navigate to="/dashboard" replace />;
};

export const App: React.FC = () => {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        {/* Public Auth Routes */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <AuthLayout>
                <Login />
              </AuthLayout>
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <AuthLayout>
                <Register />
              </AuthLayout>
            </PublicRoute>
          }
        />
        <Route
          path="/verify-email"
          element={
            <PublicRoute>
              <AuthLayout>
                <VerifyEmail />
              </AuthLayout>
            </PublicRoute>
          }
        />

        {/* Protected Dashboard/App Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Dashboard />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Student Routes */}
        <Route
          path="/student/exams"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <StudentExams />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/results"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <StudentResults />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Faculty / Examiner Routes */}
        <Route
          path="/faculty/evaluation"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <DigitalEvaluation />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/examiner/evaluation"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <DigitalEvaluation />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/faculty/questions"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <QuestionBank />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/faculty/analytics"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <FacultyAnalytics />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin/exams"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <ExamSchedules />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/rooms"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <RoomAllocations />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/academics"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <AcademicRecords />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/reports"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <ReportsAudit />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Parent Route */}
        <Route
          path="/parent/ward"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <ParentWard />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
