import { useMemo, useState } from 'react';
import { SearchX, SlidersHorizontal } from 'lucide-react';
import { useTutors } from './dataService';
import { LANGUAGES, SUBJECTS, gradeBand, GRADE_BAND_LABEL, ALL_GRADES } from './types';
import TutorCard from './TutorCard';
import { EmptyState, Field, Spinner, btnGhost, inputClass } from './ui';

interface Filters {
  q: string;
  subjects: string[];
  band: string;
  minRating: number;
  languages: string[];
  minExp: number;
  maxPrice: number;
  sort: 'rating' | 'priceAsc' | 'priceDesc' | 'experience';
}

const initialFilters: Filters = {
  q: '',
  subjects: [],
  band: 'all',
  minRating: 0,
  languages: [],
  minExp: 0,
  maxPrice: 1500,
  sort: 'rating',
};

export default function Tutors() {
  const { tutors, loading } = useTutors();
  const [f, setF] = useState<Filters>(initialFilters);

  const toggle = (key: 'subjects' | 'languages', value: string) => {
    setF((prev) => ({
      ...prev,
      [key]: prev[key].includes(value) ? prev[key].filter((v) => v !== value) : [...prev[key], value],
    }));
  };

  const results = useMemo(() => {
    let list = tutors.filter((t) => {
      const hay = `${t.fullName} ${t.headline} ${t.city} ${t.subjects.join(' ')}`.toLowerCase();
      if (f.q && !hay.includes(f.q.toLowerCase())) return false;
      if (f.subjects.length && !f.subjects.some((s) => t.subjects.includes(s))) return false;
      if (f.band !== 'all' && !t.grades.some((g) => gradeBand(g) === f.band)) return false;
      if (t.rating < f.minRating) return false;
      if (f.languages.length && !f.languages.some((l) => t.languages.includes(l))) return false;
      if (t.experienceYears < f.minExp) return false;
      if (t.hourlyRate > f.maxPrice) return false;
      return true;
    });
    switch (f.sort) {
      case 'priceAsc':
        list = [...list].sort((a, b) => a.hourlyRate - b.hourlyRate);
        break;
      case 'priceDesc':
        list = [...list].sort((a, b) => b.hourlyRate - a.hourlyRate);
        break;
      case 'experience':
        list = [...list].sort((a, b) => b.experienceYears - a.experienceYears);
        break;
      default:
        list = [...list].sort((a, b) => b.rating - a.rating);
    }
    return list;
  }, [tutors, f]);

  const activeCount =
    (f.q ? 1 : 0) +
    f.subjects.length +
    (f.band !== 'all' ? 1 : 0) +
    (f.minRating > 0 ? 1 : 0) +
    f.languages.length +
    (f.minExp > 0 ? 1 : 0) +
    (f.maxPrice < 1500 ? 1 : 0);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Find your CBSE tutor</h1>
          <p className="mt-1 text-slate-600">
            {loading ? 'Loading tutors...' : `${results.length} tutor${results.length === 1 ? '' : 's'} available for Grades 1-12`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select value={f.sort} onChange={(e) => setF({ ...f, sort: e.target.value as Filters['sort'] })} className={inputClass}>
            <option value="rating">Sort: Highest rated</option>
            <option value="priceAsc">Sort: Price low to high</option>
            <option value="priceDesc">Sort: Price high to low</option>
            <option value="experience">Sort: Most experienced</option>
          </select>
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[280px_1fr]">
        {/* Filters */}
        <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:sticky lg:top-24">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-semibold text-slate-900">
              <SlidersHorizontal className="h-4 w-4" /> Filters
            </h2>
            {activeCount > 0 && (
              <button onClick={() => setF(initialFilters)} className="text-xs font-semibold text-teal-700 hover:text-teal-800">
                Clear all ({activeCount})
              </button>
            )}
          </div>

          <div className="mt-4 space-y-5">
            <Field label="Search">
              <input
                value={f.q}
                onChange={(e) => setF({ ...f, q: e.target.value })}
                placeholder="Name, subject, city..."
                className={inputClass}
              />
            </Field>

            <Field label="Subject">
              <div className="flex flex-wrap gap-1.5">
                {SUBJECTS.map((s) => (
                  <button
                    key={s}
                    onClick={() => toggle('subjects', s)}
                    className={`rounded-full border px-2.5 py-1 text-xs font-medium transition ${
                      f.subjects.includes(s)
                        ? 'border-teal-700 bg-teal-700 text-white'
                        : 'border-slate-300 bg-white text-slate-600 hover:border-teal-600 hover:text-teal-700'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </Field>

            <Field label="Grade">
              <select value={f.band} onChange={(e) => setF({ ...f, band: e.target.value })} className={inputClass}>
                <option value="all">All grades (1-12)</option>
                {ALL_GRADES.length > 0 &&
                  Object.entries(GRADE_BAND_LABEL).map(([k, label]) => (
                    <option key={k} value={k}>
                      {label}
                    </option>
                  ))}
              </select>
            </Field>

            <Field label="Minimum rating">
              <div className="flex gap-1.5">
                {[0, 4, 4.5, 4.8].map((r) => (
                  <button
                    key={r}
                    onClick={() => setF({ ...f, minRating: r })}
                    className={`flex-1 rounded-lg border px-2 py-1.5 text-xs font-medium transition ${
                      f.minRating === r ? 'border-teal-700 bg-teal-700 text-white' : 'border-slate-300 text-slate-600 hover:border-teal-600'
                    }`}
                  >
                    {r === 0 ? 'Any' : `${r}+`}
                  </button>
                ))}
              </div>
            </Field>

            <Field label="Language">
              <div className="flex flex-wrap gap-1.5">
                {LANGUAGES.map((l) => (
                  <button
                    key={l}
                    onClick={() => toggle('languages', l)}
                    className={`rounded-full border px-2.5 py-1 text-xs font-medium transition ${
                      f.languages.includes(l)
                        ? 'border-teal-700 bg-teal-700 text-white'
                        : 'border-slate-300 bg-white text-slate-600 hover:border-teal-600 hover:text-teal-700'
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </Field>

            <Field label="Experience">
              <div className="flex gap-1.5">
                {[0, 3, 5, 10].map((e) => (
                  <button
                    key={e}
                    onClick={() => setF({ ...f, minExp: e })}
                    className={`flex-1 rounded-lg border px-2 py-1.5 text-xs font-medium transition ${
                      f.minExp === e ? 'border-teal-700 bg-teal-700 text-white' : 'border-slate-300 text-slate-600 hover:border-teal-600'
                    }`}
                  >
                    {e === 0 ? 'Any' : `${e}+ yrs`}
                  </button>
                ))}
              </div>
            </Field>

            <Field label={`Max price: ₹${f.maxPrice}/hr`} hint={`${results.length} tutors within budget`}>
              <input
                type="range"
                min={300}
                max={1500}
                step={50}
                value={f.maxPrice}
                onChange={(e) => setF({ ...f, maxPrice: Number(e.target.value) })}
                className="w-full accent-teal-700"
              />
            </Field>
          </div>
        </aside>

        {/* Results */}
        <main>
          {loading ? (
            <Spinner label="Loading tutors" />
          ) : results.length === 0 ? (
            <EmptyState title="No tutors match these filters">
              Try widening your price range or clearing a few filters.
              <div className="mt-3">
                <button onClick={() => setF(initialFilters)} className={btnGhost}>
                  Clear filters
                </button>
              </div>
            </EmptyState>
          ) : (
            <div className="grid gap-5 md:grid-cols-2">
              {results.map((t) => (
                <TutorCard key={t.uid} tutor={t} />
              ))}
            </div>
          )}
          {!loading && results.length === 0 && (
            <div className="mt-6 flex justify-center">
              <span className="inline-flex items-center gap-2 text-sm text-slate-400">
                <SearchX className="h-4 w-4" /> Adjust filters and search again
              </span>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
