import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { GraduationCap, Presentation } from 'lucide-react';
import { signIn, signUp } from './authStore';
import { ALL_GRADES, type Role } from './types';
import { Field, btnGhost, btnPrimary, inputClass } from './ui';

export default function Auth({ mode }: { mode: 'signin' | 'signup' }) {
  const isSignup = mode === 'signup';
  const navigate = useNavigate();
  const location = useLocation() as { state?: { from?: string } };
  const from = location.state?.from ?? '/tutors';

  const [role, setRole] = useState<Role>('student');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [city, setCity] = useState('');
  const [grade, setGrade] = useState<number>(6);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      if (isSignup) {
        await signUp({
          role,
          fullName,
          email,
          password,
          city,
          grade: role === 'student' ? grade : null,
        });
      } else {
        await signIn(email, password);
      }
      navigate(role === 'teacher' ? '/dashboard/teacher' : '/dashboard/student', { replace: true });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Something went wrong. Please try again.';
      setError(msg.replace('Firebase: ', '').replace(/\(auth.*\)\.?/, '').trim());
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-12">
      <h1 className="text-center text-2xl font-bold tracking-tight text-slate-900">
        {isSignup ? 'Create your account' : 'Welcome back'}
      </h1>
      <p className="mt-1 text-center text-sm text-slate-500">
        {isSignup ? 'Start learning or teaching with TutorMatch.' : 'Sign in to manage your classes and bookings.'}
      </p>

      <form onSubmit={submit} className="mt-8 space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        {isSignup && (
          <div>
            <span className="mb-2 block text-sm font-medium text-slate-700">I am a...</span>
            <div className="grid grid-cols-2 gap-3">
              {(
                [
                  { key: 'student', icon: GraduationCap, label: 'Student', sub: 'Find a tutor' },
                  { key: 'teacher', icon: Presentation, label: 'Teacher', sub: 'Teach students' },
                ] as const
              ).map(({ key, icon: Icon, label, sub }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setRole(key)}
                  className={`rounded-xl border p-3 text-left transition ${
                    role === key ? 'border-teal-700 bg-teal-50 ring-1 ring-teal-700' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <Icon className={`h-5 w-5 ${role === key ? 'text-teal-700' : 'text-slate-400'}`} />
                  <p className="mt-1.5 text-sm font-semibold text-slate-900">{label}</p>
                  <p className="text-xs text-slate-500">{sub}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {isSignup && (
          <Field label="Full name">
            <input required value={fullName} onChange={(e) => setFullName(e.target.value)} className={inputClass} placeholder="Priya Sharma" />
          </Field>
        )}

        <Field label="Email">
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
            placeholder="you@example.com"
            autoComplete="email"
          />
        </Field>

        <Field label="Password" hint={isSignup ? 'At least 6 characters' : undefined}>
          <input
            required
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
            placeholder="••••••••"
            autoComplete={isSignup ? 'new-password' : 'current-password'}
          />
        </Field>

        {isSignup && (
          <>
            <Field label="City">
              <input value={city} onChange={(e) => setCity(e.target.value)} className={inputClass} placeholder="Pune" />
            </Field>
            {role === 'student' && (
              <Field label="Current grade">
                <select value={grade} onChange={(e) => setGrade(Number(e.target.value))} className={inputClass}>
                  {ALL_GRADES.map((g) => (
                    <option key={g} value={g}>
                      Grade {g}
                    </option>
                  ))}
                </select>
              </Field>
            )}
          </>
        )}

        {error && <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>}

        <button type="submit" disabled={busy} className={`${btnPrimary} w-full py-3`}>
          {busy ? 'Please wait...' : isSignup ? 'Create account' : 'Sign in'}
        </button>

        <p className="text-center text-sm text-slate-500">
          {isSignup ? (
            <>
              Already have an account?{' '}
              <Link to="/signin" className="font-semibold text-teal-700 hover:text-teal-800">
                Sign in
              </Link>
            </>
          ) : (
            <>
              New to TutorMatch?{' '}
              <Link to="/signup" className="font-semibold text-teal-700 hover:text-teal-800">
                Create an account
              </Link>
            </>
          )}
        </p>
      </form>

      <div className="mt-4 text-center">
        <Link to={from} className={btnGhost}>
          Continue browsing instead
        </Link>
      </div>
    </div>
  );
}
