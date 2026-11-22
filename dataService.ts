import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db, isFirebaseConfigured } from './firebase';
import { demoStore } from './demoStore';
import { seedTutors } from './seed';
import type { Booking, TeacherProfile } from './types';

/** List tutors: live from Firestore when configured, otherwise the seeded directory. */
export function useTutors(): { tutors: TeacherProfile[]; loading: boolean } {
  const [tutors, setTutors] = useState<TeacherProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    if (isFirebaseConfigured) {
      getDocs(collection(db, 'tutors'))
        .then((snap) => {
          if (!active) return;
          setTutors(snap.docs.map((d) => ({ ...(d.data() as TeacherProfile), uid: d.id })));
        })
        .catch(() => {
          if (active) setTutors(seedTutors());
        })
        .finally(() => {
          if (active) setLoading(false);
        });
      return () => {
        active = false;
      };
    }
    setTutors(seedTutors());
    setLoading(false);
    return () => {
      active = false;
    };
  }, []);

  return { tutors, loading };
}

export function findTutor(tutors: TeacherProfile[], uid: string | undefined): TeacherProfile | undefined {
  return tutors.find((t) => t.uid === uid);
}

/** Bookings for the signed-in user; polls demo store in demo mode. */
export function useBookings(
  email: string | null,
  uid: string | null,
): { bookings: { asStudent: Booking[]; asTeacher: Booking[] } | null; loading: boolean } {
  const [bookings, setBookings] = useState<{ asStudent: Booking[]; asTeacher: Booking[] } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!email && !uid) {
      setBookings(null);
      setLoading(false);
      return;
    }
    let active = true;

    if (isFirebaseConfigured) {
      const loadAll = async () => {
        const snap = await getDocs(collection(db, 'bookings'));
        const all = snap.docs.map((d) => ({ ...(d.data() as Booking), id: d.id }));
        return {
          asStudent: all.filter((b) => b.studentUid === uid),
          asTeacher: all.filter((b) => b.teacherUid === uid),
        };
      };
      const tick = () => {
        loadAll()
          .then((r) => {
            if (active) setBookings(r);
          })
          .catch(() => {
            if (active) setBookings({ asStudent: [], asTeacher: [] });
          })
          .finally(() => {
            if (active) setLoading(false);
          });
      };
      tick();
      const iv = setInterval(tick, 8000);
      return () => {
        active = false;
        clearInterval(iv);
      };
    }

    const key = email ?? '';
    const tick = () => {
      if (!active) return;
      setBookings(demoStore.myBookings(key));
      setLoading(false);
    };
    tick();
    const unsub = demoStore.subscribe(tick);
    return () => {
      active = false;
      unsub();
    };
  }, [email, uid]);

  return { bookings, loading };
}
