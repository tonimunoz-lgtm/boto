import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth } from 'firebase/auth';


// Tu configuración de Firebase (CORRECTA)
const firebaseConfig = {
  apiKey: "AIzaSyDWuvGrjArZMWr2U3VRNM4SAdwbVDGTG3Q",
  authDomain: "quinto-streaming.firebaseapp.com",
  databaseURL: "https://quinto-streaming-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "quinto-streaming",
  storageBucket: "quinto-streaming.firebasestorage.app",
  messagingSenderId: "1080141028662",
  appId: "1:1080141028662:web:4b3b548c949ca30c80a797"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Obtener referencias a los servicios que necesitamos
export const database = getDatabase(app);
export const auth = getAuth(app);
