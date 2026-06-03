// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider} from "firebase/auth";
import { getFirestore } from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBXg40mmABRW7AiyZv93abpub7_ys4x2H4",
  authDomain: "chat-app-b8c7f.firebaseapp.com",
  projectId: "chat-app-b8c7f",
  storageBucket: "chat-app-b8c7f.firebasestorage.app",
  messagingSenderId: "643815976197",
  appId: "1:643815976197:web:076b0f04b614a4ce365b6c",
  measurementId: "G-9572CEJS19"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


export const auth = getAuth(app)
export const provider = new GoogleAuthProvider()
export const db = getFirestore(app)