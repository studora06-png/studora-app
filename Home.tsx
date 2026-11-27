import { Link } from 'react-router-dom';
import { ArrowRight, BadgeCheck, BookOpen, Globe2, Search, Star, Users } from 'lucide-react';
import { useTutors } from './dataService';
import TutorCard from './TutorCard';
import { btnPrimary } from './ui';

export default function Home() {
  const { tutors } = useTutors();
  const featured = tutors.slice(0, 3);

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-b from-teal-50 via-white to-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:py-24">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-700/10 px-3 py-1 text-xs font-semibold text-teal-800">
                <BadgeCheck className="h-3.5 w-3.5" /> Verified CBSE tutors, Grades 1-12
              </span>
              <h1 className="mt-4 text-4xl font-bold leading-tight tracking-tight text-slate-900 sm:text-5xl">
                Learn from the right tutor, one free trial at a time.
              </h1>
              <p className="mt-4 max-w-lg text-lg leading-relaxed text-slate-600">
                TutorMatch connects CBSE students with experienced teachers for 1-on-1 online classes. Compare subjects,
                ratings, languages and prices - then book a free trial class with zero commitment.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/tutors" className={`${btnPrimary} px-6 py-3`}>
                  <Search className="h-4 w-4" /> Find a tutor
                </Link>
                <Link
                  to="/teach"
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
                >
                  Teach on TutorMatch <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              <dl className="mt-10 grid max-w-md grid-cols-3 gap-6">
                {[
                  { icon: Users, label: 'Tutors', value: `${Math.max(tutors.length, 8)}+` },
                  { icon: BookOpen, label: 'Subjects', value: '12' },
                  { icon: Star, label: 'Avg rating', value: '4.8' },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label}>
                    <dt className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                      <Icon className="h-3.5 w-3.5" /> {label}
                    </dt>
                    <dd className="text-2xl font-bold text-slate-900">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="relative hidden lg:block">
              <div className="absolute -left-8 top-8 w-72 rounded-2xl bg-white p-5 shadow-lg ring-1 ring-slate-900/5">
                <p className="text-sm font-semibold text-slate-900">Physics with Rajkumar</p>
                <p className="mt-1 text-xs text-slate-500">Trial class confirmed - Sat 10:00 AM</p>
                <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full w-3/4 rounded-full bg-teal-600" />
                </div>
                <p className="mt-2 text-xs font-medium text-teal-700">75% of board syllabus covered</p>
              </div>
              <div className="absolute right-0 top-28 w-64 rounded-2xl bg-white p-5 shadow-lg ring-1 ring-slate-900/5">
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                    <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                  </span>
                  <p className="text-sm font-semibold text-slate-900">4.9 rated tutor</p>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-slate-500">
                  "My daughter's maths score went from 68 to 92 in one term."
                </p>
              </div>
              <div className="flex h-80 items-center justify-center rounded-3xl bg-gradient-to-br from-teal-600 to-emerald-800 text-white shadow-xl">
                <div className="text-center">
                  <Globe2 className="mx-auto h-12 w-12 opacity-80" />
                  <p className="mt-4 text-lg font-semibold">1-on-1 live online classes</p>
                  <p className="mt-1 text-sm text-teal-100">In English, Hindi, Tamil and 4 more languages</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-center text-2xl font-bold tracking-tight text-slate-900">How TutorMatch works</h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {[
            {
              step: '1',
              title: 'Search & filter',
              text: 'Browse verified CBSE tutors by subject, grade, language, experience and hourly price.',
            },
            {
              step: '2',
              title: 'Book a free trial',
              text: 'Pick a slot that suits you and request a free trial class with the tutor.',
            },
            {
              step: '3',
              title: 'Learn & grow',
              text: 'The tutor confirms your booking, classes begin, and you track everything from your dashboard.',
            },
          ].map((s) => (
            <div key={s.step} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-700 text-sm font-bold text-white">
                {s.step}
              </span>
              <h3 className="mt-4 font-semibold text-slate-900">{s.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured tutors */}
      {featured.length > 0 && (
        <section className="bg-slate-50 py-16">
          <div className="mx-auto max-w-6xl px-4">
            <div className="flex items-end justify-between">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">Top-rated tutors</h2>
              <Link to="/tutors" className="inline-flex items-center gap-1 text-sm font-semibold text-teal-700 hover:text-teal-800">
                View all <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {featured.map((t) => (
                <TutorCard key={t.uid} tutor={t} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
