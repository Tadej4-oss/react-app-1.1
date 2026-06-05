// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBtOyomt7Dr0-CCsyDxJLyCoHOeLg9Oqis",
  authDomain: "gym-tracker-project-86815.firebaseapp.com",
  projectId: "gym-tracker-project-86815",
  storageBucket: "gym-tracker-project-86815.firebasestorage.app",
  messagingSenderId: "141807646544",
  appId: "1:141807646544:web:125dff18a434e5455e9e55",
  measurementId: "G-CFY73RVFV6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);