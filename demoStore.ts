import type { Booking, StudentProfile, TeacherProfile } from './types';
import { seedTutors } from './seed';

export interface DemoAccount {
  email: string;
  password: string;
  role: 'student' | 'teacher';
  fullName: string;
  city: string;
  grade: number | null;
}

const KEY = 'tutormatch-demo-v1';

interface DemoData {
  accounts: DemoAccount[];
  bookings: Booking[];
  myTeachers: TeacherProfile[];
  myStudents: StudentProfile[];
  sessionEmail: string | null;
  nextId: number;
}

function blank(): DemoData {
  return { accounts: [], bookings: [], myTeachers: [], myStudents: [], sessionEmail: null, nextId: 1 };
}

function load(): DemoData {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as DemoData;
      return { blank: undefined, ...blank(), ...parsed } as unknown as DemoData;
    }
  } catch {
    // fall through to blank
  }
  return blank();
}

function save(d: DemoData): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(d));
  } catch {
    // storage unavailable; demo data stays in memory for the session
  }
}

export const demoStore = {
  createAccount(a: DemoAccount): void {
    const d = load();
    if (d.accounts.some((x) => x.email === a.email)) {
      throw new Error('An account with this email already exists. Try signing in instead.');
    }
    d.accounts.push(a);
    save(d);
  },

  signIn(email: string, password: string): void {
    const d = load();
    const acct = d.accounts.find((x) => x.email === email);
    if (!acct || acct.password !== password) {
      throw new Error('Incorrect email or password.');
    }
    d.sessionEmail = email;
    save(d);
  },

  signOut(): void {
    const d = load();
    d.sessionEmail = null;
    save(d);
  },

  currentAccount(): DemoAccount | null {
    const d = load();
    return d.accounts.find((a) => a.email === d.sessionEmail) ?? null;
  },

  myTeacher(email: string): TeacherProfile | null {
    const d = load();
    return d.myTeachers.find((t) => t.uid === email) ?? null;
  },

  myStudent(email: string): StudentProfile | null {
    const d = load();
    return d.myStudents.find((s) => s.uid === email) ?? null;
  },

  updateMyTeacher(uid: string, patch: Partial<TeacherProfile>): void {
    const d = load();
    const i = d.myTeachers.findIndex((t) => t.uid === uid);
    if (i >= 0) {
      d.myTeachers[i] = { ...d.myTeachers[i], ...patch };
    } else {
      const base = seedTutors()[0];
      d.myTeachers.push({ ...base, uid, ...patch });
    }
    save(d);
    window.dispatchEvent(new Event('demo-data-changed'));
  },

  addBooking(b: Omit<Booking, 'id'>): void {
    const d = load();
    d.bookings.push({ ...b, id: `bk-${d.nextId++}` });
    save(d);
    window.dispatchEvent(new Event('demo-data-changed'));
  },

  setBookingStatus(id: string, status: Booking['status']): void {
    const d = load();
    const b = d.bookings.find((x) => x.id === id);
    if (b) b.status = status;
    save(d);
    window.dispatchEvent(new Event('demo-data-changed'));
  },

  myBookings(email: string): { asStudent: Booking[]; asTeacher: Booking[] } {
    const d = load();
    return {
      asStudent: d.bookings.filter((b) => b.studentUid === email),
      asTeacher: d.bookings.filter((b) => b.teacherUid === email),
    };
  },

  subscribe(cb: () => void): () => void {
    window.addEventListener('demo-data-changed', cb);
    return () => window.removeEventListener('demo-data-changed', cb);
  },
};
