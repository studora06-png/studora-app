import { Link } from 'react-router-dom';
import { BadgeIndianRupee, CalendarClock, ShieldCheck, Users } from 'lucide-react';
import { btnPrimary } from './ui';

export default function Teach() {
  return (
    <div>
      <section className="bg-gradient-to-b from-emerald-50 via-white to-white">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:py-20">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">Teach what you love, on your schedule</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-slate-600">
            Create a free tutor profile, list your qualifications and weekly availability, and get booking requests from CBSE
            students in Grades 1-12. Your first trial class with every student is free.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/signup" className={`${btnPrimary} px-6 py-3`}>
              Create your tutor profile
            </Link>
            <Link
              to="/tutors"
              className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
            >
              See how others do it
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Users, title: 'Reach students', text: 'Parents search TutorMatch for CBSE tutors across 12 subjects and all grades.' },
            { icon: CalendarClock, title: 'Set availability', text: 'List the exact weekday slots you are free, so only fitting requests arrive.' },
            { icon: BadgeIndianRupee, title: 'Choose your rate', text: 'You set your hourly price. No commission on what you earn.' },
            { icon: ShieldCheck, title: 'Free trial classes', text: 'Every student gets one free trial with you before paid classes begin.' },
          ].map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-semibold text-slate-900">{title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="text-2xl font-bold text-slate-900">Ready to start teaching?</h2>
          <p className="mt-2 text-slate-600">
            Sign up as a teacher, then add your subjects, grades, qualifications, availability and rate from your dashboard.
          </p>
          <Link to="/signup" className={`${btnPrimary} mt-6 px-8 py-3`}>
            Get started - it's free
          </Link>
        </div>
      </section>
    </div>
  );
}
