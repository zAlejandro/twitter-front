import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDRY_XSojsfz8iFU0AjqHK7_AhxtDTyzSM",
  authDomain: "eleccio-9585f.firebaseapp.com",
  projectId: "eleccio-9585f",
  storageBucket: "eleccio-9585f.firebasestorage.app",
  messagingSenderId: "552240548674",
  appId: "1:552240548674:web:b9745b127d45d7617296db"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export default db;