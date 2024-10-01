// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD1QpRUyenFjzkC9IfKNgZexYY7g_7dVzE",
  authDomain: "asistevoz.firebaseapp.com",
  projectId: "asistevoz",
  storageBucket: "asistevoz.appspot.com",
  messagingSenderId: "890722622801",
  appId: "1:890722622801:web:63bca54808b9ccbdebc770"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export default app;
