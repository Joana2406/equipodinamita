import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Tu configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyD1QpRUyenFjzkC9IfKNgZexYY7g_7dVzE",
  authDomain: "asistevoz.firebaseapp.com",
  projectId: "asistevoz",
  storageBucket: "asistevoz.appspot.com",
  messagingSenderId: "890722622801",
  appId: "1:890722622801:web:63bca54808b9ccbdebc770"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Configurar el proveedor de Google
export const googleProvider = new GoogleAuthProvider();

export default app;
