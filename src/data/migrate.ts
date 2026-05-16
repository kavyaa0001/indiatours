import { db } from "../lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { packages } from "./packages";

export async function migratePackages() {
  console.log("Starting migration...");
  for (const pkg of packages) {
    try {
      await setDoc(doc(db, "packages", pkg.id), pkg);
      console.log(`Migrated: ${pkg.title}`);
    } catch (error) {
      console.error(`Error migrating ${pkg.title}:`, error);
    }
  }
  console.log("Migration complete!");
}
