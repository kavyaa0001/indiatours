import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { Package, packages as staticPackages } from "@/data/packages";

export function usePackages() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "packages"), orderBy("title", "asc"));
    const unsubscribe = onSnapshot(q, (snap) => {
      const firestorePackages = snap.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id
      })) as Package[];

      // Merge: Start with static packages, then override/add from Firestore
      const mergedMap = new Map<string, Package>();
      
      // 1. Add static packages first
      staticPackages.forEach(pkg => mergedMap.set(pkg.id, pkg));
      
      // 2. Override or add from Firestore (Firestore takes priority)
      firestorePackages.forEach(pkg => mergedMap.set(pkg.id, pkg));

      setPackages(Array.from(mergedMap.values()));
      setLoading(false);
    }, (error) => {
      console.error("Error fetching packages:", error);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return { packages, loading };
}
