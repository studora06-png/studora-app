import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuthState } from './lib/authStore';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Tutors from './pages/Tutors';
import TutorProfile from './pages/TutorProfile';
import BookTrial from './pages/BookTrial';
import Auth from './pages/Auth';
import Teach from './pages/Teach';
import StudentDashboard from './pages/StudentDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import TeacherProfileEditor from './pages/TeacherProfileEditor';
import { Spinner } from './components/ui';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white py-8">
      <div className="mx-auto max-w-6xl px-4 text-center text-sm text-slate-500">
        TutorMatch - free trial classes with verified CBSE tutors, Grades 1-12.
      </div>
    </footer>
  );
}

function DashboardRedirect({ role }: { role: 'student' | 'teacher' | null }) {
  if (role === 'teacher') return <Navigate to="/dashboard/teacher" replace />;
  if (role === 'student') return <Navigate to="/dashboard/student" replace />;
  return <Navigate to="/signin" replace />;
}

export default function App() {
  const state = useAuthState();

  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
        <Navbar state={state} />
        <main className="flex-1">
          {state.ready ? (
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/tutors" element={<Tutors />} />
              <Route path="/tutors/:uid" element={<TutorProfile />} />
              <Route path="/book/:uid" element={<BookTrial state={state} />} />
              <Route path="/signin" element={<Auth mode="signin" />} />
              <Route path="/signup" element={<Auth mode="signup" />} />
              <Route path="/teach" element={<Teach />} />
              <Route path="/dashboard" element={<DashboardRedirect role={state.role} />} />
              <Route path="/dashboard/student" element={<StudentDashboard state={state} />} />
              <Route path="/dashboard/teacher" element={<TeacherDashboard state={state} />} />
              <Route path="/dashboard/teacher/edit" element={<TeacherProfileEditor state={state} />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          ) : (
            <Spinner />
          )}
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
