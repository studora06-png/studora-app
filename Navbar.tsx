import { Link, NavLink } from 'react-router-dom';
import { GraduationCap, LogOut } from 'lucide-react';
import type { AppState } from '../lib/authStore';
import { signOut } from '../lib/authStore';
import { Avatar } from './ui';

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-lg px-3 py-1.5 text-sm font-medium transition ${
    isActive ? 'bg-teal-700/10 text-teal-800' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
  }`;

export default function Navbar({ state }: { state: AppState }) {
  const dashboardPath =
    state.role === 'teacher' ? '/dashboard/teacher' : state.role === 'student' ? '/dashboard/student' : null;

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-700 text-white">
            <GraduationCap className="h-5 w-5" />
          </span>
          <span className="text-lg font-bold tracking-tight text-slate-900">
            Tutor<span className="text-teal-700">Match</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 sm:flex">
          <NavLink to="/tutors" className={navLinkClass}>
            Find tutors
          </NavLink>
          <NavLink to="/teach" className={navLinkClass}>
            Become a tutor
          </NavLink>
          {dashboardPath && (
            <NavLink to={dashboardPath} className={navLinkClass}>
              Dashboard
            </NavLink>
          )}
        </nav>

        <div className="flex items-center gap-3">
          {state.ready && (state.fbUser || state.demoEmail) && state.role ? (
            <div className="flex items-center gap-2">
              <Avatar name={state.teacher?.fullName ?? state.student?.fullName ?? 'User'} size="sm" url={state.teacher?.photoUrl || state.student?.photoUrl || undefined} />
              <button
                onClick={() => void signOut()}
                className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
                title="Sign out"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/signin"
                className="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
              >
                Sign in
              </Link>
              <Link
                to="/signup"
                className="rounded-lg bg-teal-700 px-4 py-1.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-800"
              >
                Get started
              </Link>
            </div>
          )}
        </div>
      </div>

      <nav className="flex items-center gap-1 border-t border-slate-100 px-4 py-2 sm:hidden">
        <NavLink to="/tutors" className={navLinkClass}>
          Find tutors
        </NavLink>
        <NavLink to="/teach" className={navLinkClass}>
          Become a tutor
        </NavLink>
        {dashboardPath && (
          <NavLink to={dashboardPath} className={navLinkClass}>
            Dashboard
          </NavLink>
        )}
      </nav>
    </header>
  );
}
