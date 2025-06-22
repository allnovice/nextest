import { initializeApp } from "firebase/app";
import {
  initializeFirestore,
  persistentLocalCache
} from "firebase/firestore";
import { getStorage } from "firebase/storage";
import {
  getAuth,
  setPersistence,
  browserLocalPersistence
} from "firebase/auth";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDYyll6wHRcJuZUWdAXXm2U8ANgza4ZDyo",
  authDomain: "intpwa.firebaseapp.com",
  projectId: "intpwa",
  messagingSenderId: "956363867900",
  appId: "1:956363867900:web:b0f5edbba60674306df979"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ New way to enable offline cache
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache()
});

export const storage = getStorage(app);
export const auth = getAuth(app);
setPersistence(auth, browserLocalPersistence).catch((err) =>
  console.error("Auth persistence error:", err)
);
