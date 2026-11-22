import { useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as fbSignOut,
  updateProfile,
  type User,
} from 'firebase/auth';
import { auth, isFirebaseConfigured } from './firebase';
import { db } from './firebase';
import {
  addDoc,
  collection,
  doc,
  getDoc,
  setDoc,
} from 'firebase/firestore';
import { demoStore } from './demoStore';
import type { Role, StudentProfile, TeacherProfile } from './types';

export interface AppState {
  ready: boolean;
  fbUser: User | null;
  demoEmail: string | null;
  role: Role | null;
  teacher: TeacherProfile | null;
  student: StudentProfile | null;
}

export interface SignUpInput {
  role: Role;
  fullName: string;
  email: string;
  password: string;
  city?: string;
  grade?: number | null;
  headline?: string;
  subjects?: string[];
  grades?: number[];
  languages?: string[];
  experienceYears?: number;
  hourlyRate?: number;
}

export async function signUp(input: SignUpInput): Promise<void> {
  if (isFirebaseConfigured) {
    const cred = await createUserWithEmailAndPassword(auth, input.email, input.password);
    await updateProfile(cred.user, { displayName: input.fullName });
    if (input.role === 'teacher') {
      await setDoc(doc(db, 'tutors', cred.user.uid), teacherDoc(input, cred.user.uid));
    } else {
      await setDoc(doc(db, 'students', cred.user.uid), studentDoc(input, cred.user.uid));
    }
    return;
  }
  demoStore.createAccount({
    email: input.email.toLowerCase(),
    password: input.password,
    role: input.role,
    fullName: input.fullName,
    city: input.city ?? '',
    grade: input.grade ?? null,
  });
  demoStore.signIn(input.email.toLowerCase(), input.password);
  window.dispatchEvent(new Event('demo-auth-changed'));
}

export async function signIn(email: string, password: string): Promise<void> {
  if (isFirebaseConfigured) {
    await signInWithEmailAndPassword(auth, email, password);
    return;
  }
  demoStore.signIn(email.toLowerCase(), password);
  window.dispatchEvent(new Event('demo-auth-changed'));
}

export async function signOut(): Promise<void> {
  if (isFirebaseConfigured) {
    await fbSignOut(auth);
    return;
  }
  demoStore.signOut();
  window.dispatchEvent(new Event('demo-auth-changed'));
}

function teacherDoc(input: SignUpInput, uid: string): Omit<TeacherProfile, 'uid'> & { uid: string } {
  return {
    uid,
    role: 'teacher',
    fullName: input.fullName,
    photoUrl: '',
    headline: input.headline ?? 'CBSE tutor',
    bio: '',
    subjects: input.subjects ?? [],
    grades: input.grades ?? [],
    languages: input.languages ?? ['English'],
    experienceYears: input.experienceYears ?? 0,
    hourlyRate: input.hourlyRate ?? 500,
    city: input.city ?? '',
    qualifications: [],
    availability: [],
    rating: 0,
    ratingCount: 0,
    trialFree: true,
    createdAt: Date.now(),
  };
}

function studentDoc(input: SignUpInput, uid: string): Omit<StudentProfile, 'uid'> & { uid: string } {
  return {
    uid,
    role: 'student',
    fullName: input.fullName,
    photoUrl: '',
    grade: input.grade ?? null,
    city: input.city ?? '',
    createdAt: Date.now(),
  };
}

async function loadProfiles(fbUser: User | null): Promise<AppState> {
  if (!fbUser) {
    return { ready: true, fbUser: null, demoEmail: null, role: null, teacher: null, student: null };
  }
  if (isFirebaseConfigured) {
    const [t, s] = await Promise.all([
      getDoc(doc(db, 'tutors', fbUser.uid)),
      getDoc(doc(db, 'students', fbUser.uid)),
    ]);
    if (t.exists()) return { ready: true, fbUser, demoEmail: null, role: 'teacher', teacher: t.data() as TeacherProfile, student: null };
    if (s.exists()) return { ready: true, fbUser, demoEmail: null, role: 'student', student: s.data() as StudentProfile, teacher: null };
    return { ready: true, fbUser, demoEmail: null, role: null, teacher: null, student: null };
  }
  const acct = demoStore.currentAccount();
  if (!acct) return { ready: true, fbUser: null, demoEmail: null, role: null, teacher: null, student: null };
  return {
    ready: true,
    fbUser: null,
    demoEmail: acct.email,
    role: acct.role,
    teacher: acct.role === 'teacher' ? demoStore.myTeacher(acct.email) : null,
    student: acct.role === 'student' ? demoStore.myStudent(acct.email) : null,
  };
}

export function useAuthState(): AppState {
  const [state, setState] = useState<AppState>({
    ready: false,
    fbUser: null,
    demoEmail: null,
    role: null,
    teacher: null,
    student: null,
  });

  useEffect(() => {
    let active = true;

    const refresh = async (fbUser: User | null) => {
      const extra = await loadProfiles(fbUser);
      if (active) setState({ ...extra });
    };

    if (isFirebaseConfigured) {
      const unsub = onAuthStateChanged(auth, refresh);
      return () => {
        active = false;
        unsub();
      };
    }

    const listener = () => refresh(null);
    window.addEventListener('demo-auth-changed', listener);
    refresh(null);
    return () => {
      active = false;
      window.removeEventListener('demo-auth-changed', listener);
    };
  }, []);

  return state;
}

export async function updateMyTeacher(uid: string, patch: Partial<TeacherProfile>): Promise<void> {
  if (isFirebaseConfigured) {
    await setDoc(doc(db, 'tutors', uid), { ...patch }, { merge: true });
    return;
  }
  demoStore.updateMyTeacher(uid, patch);
}

export async function createBookingRequest(b: Omit<Booking, 'id' | 'status' | 'createdAt'>): Promise<void> {
  if (isFirebaseConfigured) {
    await addDoc(collection(db, 'bookings'), { ...b, status: 'pending', createdAt: Date.now() });
    return;
  }
  demoStore.addBooking({ ...b, status: 'pending', createdAt: Date.now() });
}

export async function setBookingStatus(bookingId: string, status: Booking['status']): Promise<void> {
  if (isFirebaseConfigured) {
    await setDoc(doc(db, 'bookings', bookingId), { status }, { merge: true });
    return;
  }
  demoStore.setBookingStatus(bookingId, status);
}

import type { Booking } from './types';
