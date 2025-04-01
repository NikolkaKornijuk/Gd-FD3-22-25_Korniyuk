import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDSCSNOhoEOOv4ElVFKgRFeJ6rolYgc53o",
  authDomain: "erp-korniyuk.firebaseapp.com",
  projectId: "erp-korniyuk",
  storageBucket: "erp-korniyuk.firebasestorage.app",
  messagingSenderId: "597701275476",
  appId: "1:597701275476:web:5e89d0625ca9627f8ca2c1",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
