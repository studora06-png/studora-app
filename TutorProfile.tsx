import { Link, useParams } from 'react-router-dom';
import { CalendarCheck, Clock, GraduationCap, MapPin, Sparkles } from 'lucide-react';
import { findTutor, useTutors } from '../lib/dataService';
import { gradeBand, GRADE_BAND_LABEL } from '../lib/types';
import { Avatar, Badge, Spinner, Stars, btnPrimary, rupees } from '../components/ui';

export default function TutorProfile() {
  const { uid } = useParams<{ uid: string }>();
  const { tutors, loading } = useTutors();
  const tutor = findTutor(tutors, uid);

  if (loading) return <Spinner label="Loading profile" />;
  if (!tutor) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="text-2xl font-bold text-slate-900">Tutor not found</h1>
        <p className="mt-2 text-slate-600">This tutor may have removed their profile.</p>
        <Link to="/tutors" className={`${btnPrimary} mt-6`}>
          Browse all tutors
        </Link>
      </div>
    );
  }

  const bandLabels = [...new Set(tutor.grades.map(gradeBand))].map((b) => GRADE_BAND_LABEL[b]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <Link to="/tutors" className="text-sm font-medium text-teal-700 hover:text-teal-800">
        Back to all tutors
      </Link>

      {/* Header card */}
      <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="h-28 bg-gradient-to-r from-teal-700 to-emerald-700" />
        <div className="px-6 pb-6">
          <div className="-mt-10 flex flex-wrap items-end justify-between gap-4">
            <div className="flex items-end gap-4">
              <Avatar name={tutor.fullName} url={tutor.photoUrl || undefined} size="lg" />
              <div className="pb-1">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">{tutor.fullName}</h1>
                <p className="text-slate-600">{tutor.headline}</p>
              </div>
            </div>
            <div className="pb-1 text-right">
              <p className="text-2xl font-bold text-slate-900">{rupees(tutor.hourlyRate)}</p>
              <p className="text-xs text-slate-400">per hour</p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-600">
            <Stars rating={tutor.rating} count={tutor.ratingCount} />
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-slate-400" /> {tutor.city || 'Online'}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <GraduationCap className="h-4 w-4 text-slate-400" /> {tutor.experienceYears} years of experience
            </span>
            {tutor.trialFree && (
              <Badge tone="teal">
                <Sparkles className="mr-1 h-3 w-3" /> Free trial available
              </Badge>
            )}
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <Link to={`/book/${tutor.uid}`} className={btnPrimary}>
              <CalendarCheck className="h-4 w-4" /> Book a free trial class
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_300px]">
        <div className="space-y-8">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="font-semibold text-slate-900">About</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">{tutor.bio || 'This tutor has not written a bio yet.'}</p>

            <h3 className="mt-6 text-sm font-semibold text-slate-900">Subjects & grades</h3>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {tutor.subjects.map((s) => (
                <Badge key={s} tone="teal">
                  {s}
                </Badge>
              ))}
            </div>
            <p className="mt-2 text-sm text-slate-600">
              Teaches Grades {Math.min(...tutor.grades)}-{Math.max(...tutor.grades)} ({bandLabels.join(', ')})
            </p>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="font-semibold text-slate-900">Qualifications</h2>
            {tutor.qualifications.length === 0 ? (
              <p className="mt-3 text-sm text-slate-500">No qualifications listed yet.</p>
            ) : (
              <ul className="mt-3 space-y-3">
                {tutor.qualifications.map((q) => (
                  <li key={q.id} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-teal-50 text-teal-700">
                      <GraduationCap className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-sm font-medium text-slate-900">{q.degree}</p>
                      <p className="text-xs text-slate-500">
                        {q.institution} - {q.year}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        <aside className="h-fit space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:sticky lg:top-24">
          <div>
            <h2 className="font-semibold text-slate-900">Availability</h2>
            {tutor.availability.length === 0 ? (
              <p className="mt-3 text-sm text-slate-500">Flexible - message to find a slot.</p>
            ) : (
              <ul className="mt-3 space-y-2">
                {tutor.availability.map((slot) => (
                  <li key={slot.id} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm">
                    <span className="font-medium text-slate-700">{slot.day}</span>
                    <span className="inline-flex items-center gap-1 text-slate-500">
                      <Clock className="h-3.5 w-3.5" /> {slot.start}-{slot.end}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div>
            <h2 className="font-semibold text-slate-900">Languages</h2>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {tutor.languages.map((l) => (
                <Badge key={l}>{l}</Badge>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
