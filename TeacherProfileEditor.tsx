import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Trash2 } from 'lucide-react';
import { updateMyTeacher, useAuthState } from '../lib/authStore';
import { LANGUAGES, SUBJECTS, type Qualification, type AvailabilitySlot, type TeacherProfile } from '../lib/types';
import { Spinner, btnGhost, btnPrimary, inputClass } from '../components/ui';

function newId(): string {
  return Math.random().toString(36).slice(2, 9);
}

export default function TeacherProfileEditor({ state }: { state: ReturnType<typeof useAuthState> }) {
  const navigate = useNavigate();
  const existing = state.teacher;

  const [fullName, setFullName] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [headline, setHeadline] = useState('');
  const [bio, setBio] = useState('');
  const [city, setCity] = useState('');
  const [subjects, setSubjects] = useState<string[]>([]);
  const [grades, setGrades] = useState<number[]>([]);
  const [languages, setLanguages] = useState<string[]>(['English']);
  const [experienceYears, setExperienceYears] = useState(0);
  const [hourlyRate, setHourlyRate] = useState(500);
  const [quals, setQuals] = useState<Qualification[]>([]);
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (existing && !loaded) {
      setFullName(existing.fullName);
      setPhotoUrl(existing.photoUrl);
      setHeadline(existing.headline);
      setBio(existing.bio);
      setCity(existing.city);
      setSubjects(existing.subjects);
      setGrades(existing.grades);
      setLanguages(existing.languages.length ? existing.languages : ['English']);
      setExperienceYears(existing.experienceYears);
      setHourlyRate(existing.hourlyRate);
      setQuals(existing.qualifications);
      setSlots(existing.availability);
      setLoaded(true);
    }
  }, [existing, loaded]);

  if (!state.ready) return <Spinner />;
  if (!state.fbUser && !state.demoEmail) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <h1 className="text-2xl font-bold text-slate-900">Please sign in</h1>
        <Link to="/signin" className={`${btnPrimary} mt-6`}>
          Sign in
        </Link>
      </div>
    );
  }

  const toggleIn = (list: string[], v: string, set: (x: string[]) => void) =>
    set(list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const uid = state.fbUser?.uid ?? existing?.uid ?? '';
    const patch: Partial<TeacherProfile> = {
      uid,
      role: 'teacher',
      fullName: fullName || 'New Tutor',
      photoUrl,
      headline: headline || 'CBSE tutor',
      bio,
      city,
      subjects,
      grades,
      languages,
      experienceYears,
      hourlyRate,
      qualifications: quals,
      availability: slots,
      trialFree: true,
      rating: existing?.rating ?? 0,
      ratingCount: existing?.ratingCount ?? 0,
      createdAt: existing?.createdAt ?? Date.now(),
    };
    try {
      await updateMyTeacher(uid, patch);
      navigate('/dashboard/teacher');
    } finally {
      setSaving(false);
    }
  };

  const dayOptions = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">
        {existing ? 'Edit your tutor profile' : 'Create your tutor profile'}
      </h1>
      <p className="mt-1 text-slate-600">Students see this profile when deciding to book you.</p>

      <form onSubmit={submit} className="mt-8 space-y-8">
        <section className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-slate-900">Basics</h2>
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700">Full name</span>
              <input required value={fullName} onChange={(e) => setFullName(e.target.value)} className={inputClass} placeholder="Anita Deshmukh" />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700">City</span>
              <input value={city} onChange={(e) => setCity(e.target.value)} className={inputClass} placeholder="Pune" />
            </label>
          </div>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Headline</span>
            <input
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              className={inputClass}
              placeholder="Mathematics specialist for Grades 8-12"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">About you</span>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              className={inputClass}
              placeholder="Tell students and parents how you teach, what results you help achieve, and what a typical class looks like."
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Photo URL (optional)</span>
            <input value={photoUrl} onChange={(e) => setPhotoUrl(e.target.value)} className={inputClass} placeholder="https://..." />
          </label>
        </section>

        <section className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-slate-900">What you teach</h2>
          <div>
            <span className="mb-2 block text-sm font-medium text-slate-700">Subjects</span>
            <div className="flex flex-wrap gap-1.5">
              {SUBJECTS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => toggleIn(subjects, s, setSubjects)}
                  className={`rounded-full border px-2.5 py-1 text-xs font-medium transition ${
                    subjects.includes(s)
                      ? 'border-teal-700 bg-teal-700 text-white'
                      : 'border-slate-300 text-slate-600 hover:border-teal-600'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div>
            <span className="mb-2 block text-sm font-medium text-slate-700">Grades you teach</span>
            <div className="flex flex-wrap gap-1.5">
              {Array.from({ length: 12 }, (_, i) => i + 1).map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGrades(grades.includes(g) ? grades.filter((x) => x !== g) : [...grades, g].sort((a, b) => a - b))}
                  className={`h-9 w-9 rounded-lg border text-xs font-semibold transition ${
                    grades.includes(g)
                      ? 'border-teal-700 bg-teal-700 text-white'
                      : 'border-slate-300 text-slate-600 hover:border-teal-600'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>
          <div>
            <span className="mb-2 block text-sm font-medium text-slate-700">Languages you teach in</span>
            <div className="flex flex-wrap gap-1.5">
              {LANGUAGES.map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => toggleIn(languages, l, setLanguages)}
                  className={`rounded-full border px-2.5 py-1 text-xs font-medium transition ${
                    languages.includes(l)
                      ? 'border-teal-700 bg-teal-700 text-white'
                      : 'border-slate-300 text-slate-600 hover:border-teal-600'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700">Years of experience</span>
              <input
                type="number"
                min={0}
                max={40}
                value={experienceYears}
                onChange={(e) => setExperienceYears(Number(e.target.value))}
                className={inputClass}
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700">Hourly rate (₹)</span>
              <input
                type="number"
                min={100}
                max={5000}
                step={50}
                value={hourlyRate}
                onChange={(e) => setHourlyRate(Number(e.target.value))}
                className={inputClass}
              />
            </label>
          </div>
        </section>

        <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-slate-900">Qualifications</h2>
            <button
              type="button"
              onClick={() => setQuals([...quals, { id: newId(), degree: '', institution: '', year: new Date().getFullYear() }])}
              className="inline-flex items-center gap-1 text-sm font-semibold text-teal-700 hover:text-teal-800"
            >
              <Plus className="h-4 w-4" /> Add
            </button>
          </div>
          {quals.length === 0 && <p className="text-sm text-slate-500">Add degrees and certifications to build trust.</p>}
          {quals.map((q, i) => (
            <div key={q.id} className="grid gap-3 sm:grid-cols-[1fr_1fr_100px_auto]">
              <input
                value={q.degree}
                onChange={(e) => setQuals(quals.map((x, j) => (j === i ? { ...x, degree: e.target.value } : x)))}
                className={inputClass}
                placeholder="M.Sc Mathematics"
              />
              <input
                value={q.institution}
                onChange={(e) => setQuals(quals.map((x, j) => (j === i ? { ...x, institution: e.target.value } : x)))}
                className={inputClass}
                placeholder="Delhi University"
              />
              <input
                type="number"
                value={q.year}
                onChange={(e) => setQuals(quals.map((x, j) => (j === i ? { ...x, year: Number(e.target.value) } : x)))}
                className={inputClass}
                placeholder="2019"
              />
              <button type="button" onClick={() => setQuals(quals.filter((_, j) => j !== i))} className="px-2 text-slate-400 hover:text-rose-600" title="Remove">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </section>

        <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-slate-900">Weekly availability</h2>
            <button
              type="button"
              onClick={() => setSlots([...slots, { id: newId(), day: 'Mon', start: '17:00', end: '19:00' }])}
              className="inline-flex items-center gap-1 text-sm font-semibold text-teal-700 hover:text-teal-800"
            >
              <Plus className="h-4 w-4" /> Add slot
            </button>
          </div>
          {slots.length === 0 && <p className="text-sm text-slate-500">Add the weekday time ranges you are free to teach.</p>}
          {slots.map((slot, i) => (
            <div key={slot.id} className="grid items-center gap-3 sm:grid-cols-[120px_1fr_1fr_auto]">
              <select
                value={slot.day}
                onChange={(e) => setSlots(slots.map((x, j) => (j === i ? { ...x, day: e.target.value } : x)))}
                className={inputClass}
              >
                {dayOptions.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
              <input
                type="time"
                value={slot.start}
                onChange={(e) => setSlots(slots.map((x, j) => (j === i ? { ...x, start: e.target.value } : x)))}
                className={inputClass}
              />
              <input
                type="time"
                value={slot.end}
                onChange={(e) => setSlots(slots.map((x, j) => (j === i ? { ...x, end: e.target.value } : x)))}
                className={inputClass}
              />
              <button type="button" onClick={() => setSlots(slots.filter((_, j) => j !== i))} className="px-2 text-slate-400 hover:text-rose-600" title="Remove">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </section>

        <div className="flex justify-end gap-3 pb-10">
          <Link to="/dashboard/teacher" className={btnGhost}>
            Cancel
          </Link>
          <button type="submit" disabled={saving} className={btnPrimary}>
            {saving ? 'Saving...' : 'Save profile'}
          </button>
        </div>
      </form>
    </div>
  );
}
