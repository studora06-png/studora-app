import { Link } from 'react-router-dom';
import { CalendarDays, Pencil, Presentation } from 'lucide-react';
import type { useAuthState } from './authStore';
import { setBookingStatus } from './authStore';
import type { BookingStatus } from './types';
import { useBookings, useTutors } from './dataService';
import BookingList from './BookingList';
import { Avatar, Spinner, Stars, btnPrimary, rupees } from './ui';
export default function TeacherDashboard({ state }: { state: ReturnType<typeof useAuthState> }) {
  const email = state.demoEmail;
  const uid = state.fbUser?.uid ?? null;
  const { bookings, loading } = useBookings(email, uid);
  const { tutors } = useTutors();

  if (!state.ready) return <Spinner />;
  if (!email && !uid) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <h1 className="text-2xl font-bold text-slate-900">Please sign in</h1>
        <p className="mt-2 text-slate-600">Sign in to manage your tutor profile and booking requests.</p>
        <Link to="/signin" className={`${btnPrimary} mt-6`}>
          Sign in
        </Link>
      </div>
    );
  }

  const me = state.teacher;
  const requests = bookings?.asTeacher ?? [];
  const pending = requests.filter((b) => b.status === 'pending');
  const upcoming = requests.filter((b) => b.status === 'accepted');

  const handleStatus = (id: string, status: BookingStatus) => {
    void setBookingStatus(id, status);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Avatar name={me?.fullName ?? 'Teacher'} url={me?.photoUrl || undefined} />
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">{me?.fullName ?? 'Your tutor profile'}</h1>
            <p className="text-sm text-slate-600">{me?.headline ?? 'Complete your profile to receive more requests.'}</p>
          </div>
        </div>
        <Link to="/dashboard/teacher/edit" className={btnPrimary}>
          <Pencil className="h-4 w-4" /> {me ? 'Edit profile' : 'Create profile'}
        </Link>
      </div>

      {!me && (
        <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-6">
          <p className="font-semibold text-amber-900">Your tutor profile is not set up yet</p>
          <p className="mt-1 text-sm text-amber-800">
            Add your subjects, grades, qualifications, availability and rate so students can find and book you.
          </p>
          <Link to="/dashboard/teacher/edit" className={`${btnPrimary} mt-4`}>
            <Presentation className="h-4 w-4" /> Set up my profile
          </Link>
        </div>
      )}

      {me && (
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {[
            { label: 'Rating', value: me.rating > 0 ? `${me.rating.toFixed(1)} (${me.ratingCount})` : 'New' },
            { label: 'Hourly rate', value: `${rupees(me.hourlyRate)}/hr` },
            { label: 'Experience', value: `${me.experienceYears} yrs` },
          ].map((s) => (
            <div key={s.label} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-medium text-slate-500">{s.label}</p>
              <p className="mt-1 text-xl font-bold text-slate-900">{s.value}</p>
            </div>
          ))}
        </div>
      )}

      {loading ? (
        <Spinner label="Loading booking requests" />
      ) : (
        <>
          <section className="mt-10">
            <h2 className="font-semibold text-slate-900">New requests ({pending.length})</h2>
            <p className="mb-3 text-sm text-slate-500">Students waiting for your reply.</p>
            <BookingList bookings={pending} view="teacher" onStatus={handleStatus} />
          </section>

          <section className="mt-10">
            <h2 className="font-semibold text-slate-900">Upcoming classes ({upcoming.length})</h2>
            <p className="mb-3 text-sm text-slate-500">Accepted trial classes to teach.</p>
            <BookingList bookings={upcoming} view="teacher" onStatus={handleStatus} />
          </section>

          <section className="mt-10">
            <h2 className="font-semibold text-slate-900">History</h2>
            <p className="mb-3 text-sm text-slate-500">Completed and declined requests.</p>
            <BookingList
              bookings={requests.filter((b) => b.status === 'completed' || b.status === 'declined')}
              view="teacher"
              tutorLookup={(tuid) => tutors.find((t) => t.uid === tuid)}
            />
          </section>
        </>
      )}

      {me && me.availability.length > 0 && (
        <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="flex items-center gap-2 font-semibold text-slate-900">
            <CalendarDays className="h-4 w-4" /> Your weekly availability
          </h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {me.availability.map((slot) => (
              <span key={slot.id} className="rounded-lg bg-slate-50 px-3 py-1.5 text-sm text-slate-600">
                {slot.day} {slot.start}-{slot.end}
              </span>
            ))}
          </div>
        </section>
      )}

      {me && me.ratingCount === 0 && (
        <p className="mt-8 text-center text-sm text-slate-400">
          <Stars rating={0} /> New tutors get featured on the homepage for their first month.
        </p>
      )}

    </div>
  );
}
