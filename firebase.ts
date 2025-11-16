// firebase.ts
// Firebase Configuration for Heritage Grand

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCFUysfRf2tA1UKOyuxETueTFT1tvI945A",
  authDomain: "heritage-grand.firebaseapp.com",
  projectId: "heritage-grand",
  storageBucket: "heritage-grand.firebasestorage.app",
  messagingSenderId: "520643710810",
  appId: "1:520643710810:web:f211d61e2fbecb7f262d63"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

console.log("✅ Firebase connected to Heritage Grand!");