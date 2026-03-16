import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAaHebqqr3j3QnbDP4tFpElkh-lisbGX5Q",
  authDomain: "savekaro-d340d.firebaseapp.com",
  projectId: "savekaro-d340d",
  storageBucket: "savekaro-d340d.firebasestorage.app",
  messagingSenderId: "403614895229",
  appId: "1:403614895229:web:9d84553ba1518e26e9b514"
};

const app = initializeApp(firebaseConfig);

export const db        = getFirestore(app);
export const auth      = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

/* ─── Helper: save user data to Firestore ───────────────
   Call this whenever wishlist / tracker / points changes.
   Data is stored under: users/{userId}/data/{key}
──────────────────────────────────────────────────────── */
export async function saveToCloud(userId, key, value) {
  if (!userId) return;
  try {
    await setDoc(
      doc(db, "users", userId, "data", key),
      { value, updatedAt: Date.now() },
      { merge: true }
    );
  } catch (err) {
    console.warn("Firebase save failed:", err.message);
  }
}

/* ─── Helper: load user data from Firestore ─────────────
   Call this on login to restore user's wishlist etc.
──────────────────────────────────────────────────────── */
export async function loadFromCloud(userId, key) {
  if (!userId) return null;
  try {
    const snap = await getDoc(doc(db, "users", userId, "data", key));
    return snap.exists() ? snap.data().value : null;
  } catch (err) {
    console.warn("Firebase load failed:", err.message);
    return null;
  }
}