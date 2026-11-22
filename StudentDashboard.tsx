import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { useAuthState } from '../lib/authStore';
import { useBookings, useTutors } from '../lib/dataService';
import { BookingList } from '../components/BookingList';
import { Spinner, btnPrimary } from '../components/ui';

export default function StudentDashboard({ state }: { state: ReturnType<typeof useAuthState> }) {
  const email = state.demoEmail;
  const uid = state.fbUser?.uid ?? null;
  const { bookings, loading } = useBookings(email, uid);
  const { tutors } = useTutors();

  if (!state.ready) return <Spinner />;
  if (!email && !uid) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <h1 className="text-2xl font-bold text-slate-900">Please sign in</h1>
        <p className="mt-2 text-slate-600">Your dashboard shows your booked classes and tutor replies.</p>
        <Link to="/signin" className={`${btnPrimary} mt-6`}>
          Sign in
        </Link>
      </div>
    );
  }

  const my = state.student;
  const pending = bookings?.asStudent.filter((b) => b.status === 'pending') ?? [];

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Hi{my ? ` ${my.fullName.split(' ')[0]}` : ''}!
          </h1>
          <p className="mt-1 text-slate-600">
            {my ? `Grade ${my.grade ?? '-'} student${my.city ? ` in ${my.city}` : ''}.` : ''} Here are your classes.
          </p>
        </div>
        <Link to="/tutors" className={btnPrimary}>
          <Search className="h-4 w-4" /> Find more tutors
        </Link>
      </div>

      {loading ? (
        <Spinner label="Loading your bookings" />
      ) : (
        <>
          <section className="mt-8">
            <h2 className="font-semibold text-slate-900">Pending requests ({pending.length})</h2>
            <p className="mb-3 text-sm text-slate-500">Waiting for tutors to accept.</p>
            <BookingList bookings={pending} view="student" />
          </section>

          <section className="mt-10">
            <h2 className="font-semibold text-slate-900">All bookings</h2>
            <p className="mb-3 text-sm text-slate-500">Accepted, completed and declined requests.</p>
            <BookingList
              bookings={bookings?.asStudent.filter((b) => b.status !== 'pending') ?? []}
              view="student"
              tutorLookup={(tuid) => tutors.find((t) => t.uid === tuid)}
            />
          </section>
        </>
      )}
    </div>
  );
}
