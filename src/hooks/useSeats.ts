import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { doc, onSnapshot, setDoc, getDoc, increment, updateDoc, runTransaction } from "firebase/firestore";

export interface SeatData {
  totalSeats: number;
  bookedSeats: number;
  availableSeats: number;
  isSoldOut: boolean;
  percentage: number;
}

// Default seats per package
const DEFAULT_SEATS = 20;

// Real-time seat data hook
export function useSeats(packageId: string) {
  const [seatData, setSeatData] = useState<SeatData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!packageId) {
      setLoading(false);
      return;
    }

    const ref = doc(db, "packageSeats", packageId);

    // Real-time listener with automatic default fallback
    const unsubscribe = onSnapshot(ref, (snap) => {
      const data = snap.exists() ? snap.data() : { totalSeats: DEFAULT_SEATS, bookedSeats: 0 };
      const total = data.totalSeats ?? DEFAULT_SEATS;
      const booked = data.bookedSeats ?? 0;
      const available = Math.max(0, total - booked);
      
      setSeatData({
        totalSeats: total,
        bookedSeats: booked,
        availableSeats: available,
        isSoldOut: available === 0,
        percentage: Math.round((booked / total) * 100),
      });
      setLoading(false);
    }, (error) => {
      console.error("Error listening to seats:", error);
      // Fallback on permission/network error
      setSeatData({
        totalSeats: DEFAULT_SEATS,
        bookedSeats: 0,
        availableSeats: DEFAULT_SEATS,
        isSoldOut: false,
        percentage: 0,
      });
      setLoading(false);
    });

    return unsubscribe;
  }, [packageId]);

  return { seatData, loading };
}

// Book seats (called on booking confirmation)
export async function bookSeats(packageId: string, count: number): Promise<boolean> {
  const ref = doc(db, "packageSeats", packageId);

  try {
    let success = false;
    await runTransaction(db, async (transaction) => {
      const snap = await transaction.get(ref);
      
      if (!snap.exists()) {
        // Document does not exist yet; initialize with default seats minus booked amount
        if (DEFAULT_SEATS < count) {
          throw new Error("Not enough seats available");
        }
        transaction.set(ref, { totalSeats: DEFAULT_SEATS, bookedSeats: count });
        success = true;
      } else {
        const data = snap.data();
        const total = data.totalSeats ?? DEFAULT_SEATS;
        const booked = data.bookedSeats ?? 0;
        const available = total - booked;

        if (available < count) {
          throw new Error("Not enough seats available");
        }

        transaction.update(ref, { bookedSeats: increment(count) });
        success = true;
      }
    });
    return success;
  } catch (err) {
    console.error("Seat booking failed:", err);
    return false;
  }
}

// Admin: update total seats for a package
export async function updateTotalSeats(packageId: string, totalSeats: number) {
  const ref = doc(db, "packageSeats", packageId);
  await setDoc(ref, { totalSeats }, { merge: true });
}
