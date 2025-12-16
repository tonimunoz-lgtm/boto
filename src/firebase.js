import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth } from 'firebase/auth';

// REEMPLAZA ESTO CON TU CONFIGURACIÓN DE FIREBASE
const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "tu-proyecto.firebaseapp.com",
  databaseURL: "https://tu-proyecto-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "tu-proyecto",
  storageBucket: "tu-proyecto.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Obtener referencias a servicios
export const database = getDatabase(app);
export const auth = getAuth(app);
