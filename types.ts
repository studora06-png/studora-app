export type Role = 'student' | 'teacher';

export type GradeBand = 'primary' | 'middle' | 'secondary' | 'senior';

export interface Qualification {
  id: string;
  degree: string;
  institution: string;
  year: number;
}

export interface AvailabilitySlot {
  id: string;
  day: string; // Mon..Sun
  start: string; // HH:mm 24h
  end: string; // HH:mm 24h
}

export interface TeacherProfile {
  uid: string;
  role: 'teacher';
  fullName: string;
  photoUrl: string;
  headline: string;
  bio: string;
  subjects: string[];
  grades: number[]; // 1..12 taught
  languages: string[];
  experienceYears: number;
  hourlyRate: number; // INR
  city: string;
  qualifications: Qualification[];
  availability: AvailabilitySlot[];
  rating: number;
  ratingCount: number;
  trialFree: boolean;
  createdAt: number;
}

export interface StudentProfile {
  uid: string;
  role: 'student';
  fullName: string;
  photoUrl: string;
  grade: number | null; // grade the student is in (1..12)
  city: string;
  createdAt: number;
}

export type BookingStatus = 'pending' | 'accepted' | 'declined' | 'completed';

export interface Booking {
  id: string;
  teacherUid: string;
  teacherName: string;
  studentUid: string;
  studentName: string;
  subject: string;
  grade: number;
  date: string; // yyyy-mm-dd
  time: string; // HH:mm
  notes: string;
  status: BookingStatus;
  isTrial: boolean;
  createdAt: number;
}

export type BookingRoleView = 'student' | 'teacher';

export const SUBJECTS = [
  'Mathematics',
  'Science',
  'Physics',
  'Chemistry',
  'Biology',
  'English',
  'Hindi',
  'Social Studies',
  'Computer Science',
  'Economics',
  'Accountancy',
  'Sanskrit',
] as const;

export const LANGUAGES = ['English', 'Hindi', 'Marathi', 'Tamil', 'Telugu', 'Bengali', 'Kannada'] as const;

export const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;

export const ALL_GRADES = Array.from({ length: 12 }, (_, i) => i + 1);

export function gradeBand(grade: number): GradeBand {
  if (grade <= 5) return 'primary';
  if (grade <= 8) return 'middle';
  if (grade <= 10) return 'secondary';
  return 'senior';
}

export const GRADE_BAND_LABEL: Record<GradeBand, string> = {
  primary: 'Primary (1-5)',
  middle: 'Middle (6-8)',
  secondary: 'Secondary (9-10)',
  senior: 'Senior (11-12)',
};
