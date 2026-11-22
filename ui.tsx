import { Star } from 'lucide-react';

export function Avatar({ name, url, size = 'md' }: { name: string; url?: string; size?: 'sm' | 'md' | 'lg' }) {
  const dims = size === 'lg' ? 'h-24 w-24 text-3xl' : size === 'sm' ? 'h-9 w-9 text-xs' : 'h-12 w-12 text-lg';
  if (url) {
    return <img src={url} alt={name} className={`${dims} rounded-full object-cover ring-2 ring-white`} />;
  }
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('');
  return (
    <div
      className={`${dims} flex items-center justify-center rounded-full bg-teal-600 font-semibold text-white ring-2 ring-white`}
      aria-hidden
    >
      {initials || '?'}
    </div>
  );
}

export function Stars({ rating, count }: { rating: number; count?: number }) {
  return (
    <span className="inline-flex items-center gap-1 text-sm">
      <span className="flex">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${i <= Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'fill-slate-200 text-slate-200'}`}
          />
        ))}
      </span>
      <span className="font-medium text-slate-700">{rating > 0 ? rating.toFixed(1) : 'New'}</span>
      {typeof count === 'number' && count > 0 && <span className="text-slate-400">({count})</span>}
    </span>
  );
}

const badgeStyles = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium';

export function Badge({ children, tone = 'slate' }: { children: React.ReactNode; tone?: 'slate' | 'teal' | 'amber' | 'rose' | 'sky' }) {
  const tones: Record<string, string> = {
    slate: 'bg-slate-100 text-slate-700',
    teal: 'bg-teal-50 text-teal-700 ring-1 ring-inset ring-teal-600/20',
    amber: 'bg-amber-50 text-amber-800 ring-1 ring-inset ring-amber-600/20',
    rose: 'bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-600/20',
    sky: 'bg-sky-50 text-sky-700 ring-1 ring-inset ring-sky-600/20',
  };
  return <span className={`${badgeStyles} ${tones[tone]}`}>{children}</span>;
}

export function statusBadgeTone(status: string): 'amber' | 'teal' | 'rose' | 'sky' {
  switch (status) {
    case 'pending':
      return 'amber';
    case 'accepted':
      return 'teal';
    case 'declined':
      return 'rose';
    default:
      return 'sky';
  }
}

export function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-slate-700">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-slate-400">{hint}</span>}
    </label>
  );
}

export const inputClass =
  'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 shadow-sm outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20';

export const btnPrimary =
  'inline-flex items-center justify-center gap-2 rounded-lg bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 disabled:cursor-not-allowed disabled:opacity-60';

export const btnGhost =
  'inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400';

export function Spinner({ label = 'Loading' }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-3 py-16 text-slate-500">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-teal-700" />
      <span className="text-sm">{label}...</span>
    </div>
  );
}

export function EmptyState({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
      <p className="font-semibold text-slate-700">{title}</p>
      {children && <div className="mt-2 text-sm text-slate-500">{children}</div>}
    </div>
  );
}

export function rupees(n: number): string {
  return `₹${n.toLocaleString('en-IN')}`;
}
