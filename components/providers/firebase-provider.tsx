"use client";
import { PropsWithChildren, useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getStorage, connectStorageEmulator } from "firebase/storage";
import { connectAuthEmulator, getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA7zwPCv0Lmv2vZBJcse_O0Wv-C4-mMHgE",
  authDomain: "wakafyuk-102a0.firebaseapp.com",
  projectId: "wakafyuk-102a0",
  storageBucket: "wakafyuk-102a0.appspot.com",
  messagingSenderId: "776963877118",
  appId: "1:776963877118:web:74b85ccad35a4f011e9daf",
  measurementId: "G-BF3549VVHY",
};

export function FirebaseProvidder({ children }: PropsWithChildren) {
  const [isFirebaseInitialized, setFirebaseInitialized] = useState(false);

  useEffect(() => {
    if (!isFirebaseInitialized) {
      const app = initializeApp(firebaseConfig);
      const db = getFirestore(app);
      const auth = getAuth(app);
      const storage = getStorage(app);

      if (process.env.NODE_ENV === "development") {
        connectAuthEmulator(auth, "http://localhost:9099");
        connectFirestoreEmulator(db, "localhost", 8080);
        connectStorageEmulator(storage, "localhost", 9199);
      }

      setFirebaseInitialized(true);
    }
  }, [isFirebaseInitialized]);

  return isFirebaseInitialized ? <>{children}</> : <p>Loading...</p>;
}
