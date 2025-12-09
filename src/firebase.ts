// firebase.ts

import { initializeApp } from "firebase/app";
import { getAuth} from "firebase/auth";

import {getFirestore,collection} from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyB1QwWxSHrtHFdZm0ZgWghYRxoix9cvFKc",
  authDomain: "chatapp-dbfe9.firebaseapp.com",
  projectId: "chatapp-dbfe9",
  storageBucket: "chatapp-dbfe9.appspot.com",
  messagingSenderId: "764548360642",
  appId: "1:764548360642:web:fbf8ac2ae0ed2f77334e5b",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Messages collection
export const messagesCollection = collection(db, "messages");