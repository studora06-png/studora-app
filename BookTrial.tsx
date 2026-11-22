import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { CalendarCheck, CheckCircle2 } from 'lucide-react';
import { createBookingRequest, useAuthState } from '../lib/authStore';
import { findTutor, useTutors } from '../lib/dataService';
import { SUBJECTS, type Booking } from '../lib/types';
import { Avatar, Field, Spinner, Stars, btnPrimary, inputClass, rupees } from '../components/ui';

interface Props {
  state: ReturnType<typeof useAuthState>;
}

function todayStr(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export default function BookTrial({ state }: Props) {
  const { uid } = useParams<{ uid: string }>();
  const navigate = useNavigate();
  const { tutors, loading } = useTutors();
  const tutor = findTutor(tutors, uid);

  const [subject, setSubject] = useState('');
  const [grade, setGrade] = useState<number>(6);
  const [date, setDate] = useState(todayStr());
  const [time, setTime] = useState('17:00');
  const [notes, setNotes] = useState('');
  const [done, setDone] = useState<Booking | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (tutor && !subject) setSubject(tutor.subjects[0] ?? '');
    if (tutor) setGrade(tutor.grades[0] ?? 6);
  }, [tutor, subject]);

  const signedIn = Boolean(state.fbUser || state.demoEmail);
  const studentName = state.student?.fullName || state.teacher?.fullName || 'Student';

  const minDate = useMemo(todayStr, []);

  if (loading) return <Spinner label="Loading tutor" />;
  if (!tutor) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="text-2xl font-bold text-slate-900">Tutor not found</h1>
        <Link to="/tutors" className={`${btnPrimary} mt-6`}>
          Browse tutors
        </Link>
      </div>
    );
  }

  if (done) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <CheckCircle2 className="mx-auto h-14 w-14 text-teal-600" />
        <h1 className="mt-4 text-2xl font-bold text-slate-900">Trial class requested</h1>
        <p className="mt-2 text-slate-600">
          Your request for {tutor.fullName} on {done.date} at {done.time} has been sent. You will see the tutor's response in
          your dashboard.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <button
            onClick={() => navigate(state.role === 'teacher' ? '/dashboard/teacher' : '/dashboard/student')}
            className={btnPrimary}
          >
            Go to dashboard
          </button>
          <Link
            to="/tutors"
            className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Keep browsing
          </Link>
        </div>
      </div>
    );
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!uid) return;
    setBusy(true);
    try {
      const booking = {
        teacherUid: tutor.uid,
        teacherName: tutor.fullName,
        studentUid: state.demoEmail ?? state.fbUser?.uid ?? '',
        studentName,
        subject,
        grade,
        date,
        time,
        notes,
        isTrial: true,
      };
      await createBookingRequest(booking);
      setDone(booking as Booking);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not send your request. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Link to={`/tutors/${tutor.uid}`} className="text-sm font-medium text-teal-700 hover:text-teal-800">
        Back to profile
      </Link>

      <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900">Book your free trial class</h1>

      <div className="mt-6 flex items-center gap-4 rounded-2xl border border-teal-200 bg-teal-50 p-4">
        <Avatar name={tutor.fullName} url={tutor.photoUrl || undefined} />
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-slate-900">{tutor.fullName}</p>
          <p className="truncate text-sm text-slate-600">{tutor.headline}</p>
        </div>
        <div className="text-right">
          <Stars rating={tutor.rating} count={tutor.ratingCount} />
          <p className="text-xs text-slate-500">then {rupees(tutor.hourlyRate)}/hr</p>
        </div>
      </div>

      {!signedIn && (
        <p className="mt-4 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800">
          You need an account to send a booking request.{' '}
          <Link to="/signup" className="font-semibold underline">
            Create one in under a minute
          </Link>{' '}
          or{' '}
          <Link to="/signin" className="font-semibold underline">
            sign in
          </Link>
          .
        </p>
      )}

      <form onSubmit={submit} className="mt-6 space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Subject">
            <select value={subject} onChange={(e) => setSubject(e.target.value)} className={inputClass} required>
              {tutor.subjects.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
              {!tutor.subjects.includes(subject) && <option value={subject}>{subject || 'Select a subject'}</option>}
            </select>
          </Field>
          <Field label="Grade">
            <select value={grade} onChange={(e) => setGrade(Number(e.target.value))} className={inputClass}>
              {tutor.grades.map((g) => (
                <option key={g} value={g}>
                  Grade {g}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Preferred date">
            <input type="date" min={minDate} value={date} onChange={(e) => setDate(e.target.value)} className={inputClass} required />
          </Field>
          <Field label="Preferred time" hint={`Tutor's slots: ${tutor.availability.map((a) => `${a.day} ${a.start}`).join(', ') || 'flexible'}`}>
            <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className={inputClass} required />
          </Field>
        </div>
        <Field label="Notes for the tutor (optional)">
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className={inputClass}
            placeholder="e.g. My son is weak in trigonometry and has exams in March."
          />
        </Field>

        {error && <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>}

        <button type="submit" disabled={busy || !subject} className={`${btnPrimary} w-full py-3`}>
          <CalendarCheck className="h-4 w-4" />
          {busy ? 'Sending request...' : 'Send booking request'}
        </button>
        <p className="text-center text-xs text-slate-400">
          The trial is free. After the trial, classes are {rupees(tutor.hourlyRate)}/hr, paid directly to the tutor. Subjects
          covered: {SUBJECTS.slice(0, 3).join(', ')} and more.
        </p>
      </form>
    </div>
  );
}
