import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";


const firebaseConfig = {
    apiKey: "AIzaSyBuGX3-3RaKNvxJnrMrpQeqhsoKAjfyeo0",
    authDomain: "face-payment-1a96e.firebaseapp.com",
    projectId: "face-payment-1a96e",
    storageBucket: "face-payment-1a96e.firebasestorage.app",
    messagingSenderId: "659179008579",
    appId: "1:659179008579:web:d29609bf6be8d262c81af6",
    measurementId: "G-FJ9PE4W236"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const db = getFirestore(app);
const auth = getAuth(app);

export { storage, db, auth };
export default app;