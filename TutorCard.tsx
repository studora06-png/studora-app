import { Link } from 'react-router-dom';
import { Clock, IndianRupee, MapPin } from 'lucide-react';
import type { TeacherProfile } from '../lib/types';
import { Avatar, Badge, Stars } from './ui';

export default function TutorCard({ tutor }: { tutor: TeacherProfile }) {
  return (
    <article className="group flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start gap-4">
        <Avatar name={tutor.fullName} url={tutor.photoUrl || undefined} />
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-semibold text-slate-900">{tutor.fullName}</h3>
          <p className="truncate text-sm text-slate-500">{tutor.headline}</p>
          <div className="mt-1">
            <Stars rating={tutor.rating} count={tutor.ratingCount} />
          </div>
        </div>
        <div className="text-right">
          <p className="flex items-center justify-end font-semibold text-slate-900">
            <IndianRupee className="h-3.5 w-3.5" />
            {tutor.hourlyRate}
          </p>
          <p className="text-xs text-slate-400">per hour</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {tutor.subjects.slice(0, 3).map((s) => (
          <Badge key={s} tone="teal">
            {s}
          </Badge>
        ))}
        {tutor.grades.length > 0 && (
          <Badge tone="sky">
            Grades {Math.min(...tutor.grades)}-{Math.max(...tutor.grades)}
          </Badge>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
        <span className="inline-flex items-center gap-1">
          <MapPin className="h-3.5 w-3.5" /> {tutor.city || 'Online'}
        </span>
        <span className="inline-flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" /> {tutor.experienceYears} yrs experience
        </span>
        <span>{tutor.languages.join(', ')}</span>
      </div>

      <div className="mt-auto flex items-center gap-3 pt-1">
        <Link
          to={`/tutors/${tutor.uid}`}
          className="inline-flex flex-1 items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          View profile
        </Link>
        <Link
          to={`/book/${tutor.uid}`}
          className="inline-flex flex-1 items-center justify-center rounded-lg bg-teal-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-teal-800"
        >
          Book trial
        </Link>
      </div>
    </article>
  );
}
