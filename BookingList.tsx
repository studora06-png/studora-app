import { Link } from 'react-router-dom';
import { CalendarClock, CalendarDays, UserRound } from 'lucide-react';
import type { Booking, TeacherProfile } from '../lib/types';
import { Badge, EmptyState, statusBadgeTone } from '../components/ui';

export function BookingList({
  bookings,
  view,
  onStatus,
  tutorLookup,
}: {
  bookings: Booking[];
  view: 'student' | 'teacher';
  onStatus?: (id: string, s: Booking['status']) => void;
  tutorLookup?: (uid: string) => TeacherProfile | undefined;
}) {
  if (bookings.length === 0) {
    return (
      <EmptyState title={view === 'student' ? 'No classes booked yet' : 'No booking requests yet'}>
        {view === 'student' ? (
          <>
            Browse tutors and request your first free trial class.
            <div className="mt-3">
              <Link to="/tutors" className="font-semibold text-teal-700 hover:text-teal-800">
                Find a tutor
              </Link>
            </div>
          </>
        ) : (
          'Once students request trial classes, they will appear here for you to accept or decline.'
        )}
      </EmptyState>
    );
  }

  return (
    <ul className="space-y-3">
      {bookings
        .slice()
        .sort((a, b) => (a.date + a.time < b.date + b.time ? -1 : 1))
        .map((b) => {
          const other = view === 'student' ? b.teacherName : b.studentName;
          const tutor = tutorLookup?.(b.teacherUid);
          return (
            <li key={b.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-slate-900">
                    {b.subject} - Grade {b.grade} {b.isTrial && <Badge tone="teal">Free trial</Badge>}
                  </p>
                  <p className="mt-0.5 text-sm text-slate-500">
                    {view === 'student' ? 'with' : 'requested by'} {other}
                    {tutor ? ` - ${tutor.city}` : ''}
                  </p>
                </div>
                <Badge tone={statusBadgeTone(b.status)}>{b.status}</Badge>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                <span className="inline-flex items-center gap-1">
                  <CalendarDays className="h-3.5 w-3.5" /> {b.date}
                </span>
                <span className="inline-flex items-center gap-1">
                  <CalendarClock className="h-3.5 w-3.5" /> {b.time}
                </span>
                <span className="inline-flex items-center gap-1">
                  <UserRound className="h-3.5 w-3.5" /> {view === 'student' ? 'your class' : 'respond below'}
                </span>
              </div>
              {b.notes && <p className="mt-2 rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-600">"{b.notes}"</p>}
              {view === 'teacher' && onStatus && b.status === 'pending' && (
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => onStatus(b.id, 'accepted')}
                    className="rounded-lg bg-teal-700 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-teal-800"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => onStatus(b.id, 'declined')}
                    className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
                  >
                    Decline
                  </button>
                </div>
              )}
              {view === 'teacher' && onStatus && b.status === 'accepted' && (
                <button
                  onClick={() => onStatus(b.id, 'completed')}
                  className="mt-3 rounded-lg border border-teal-600 px-3 py-1.5 text-xs font-semibold text-teal-700 transition hover:bg-teal-50"
                >
                  Mark completed
                </button>
              )}
            </li>
          );
        })}
    </ul>
  );
}
