// firebase.js
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

// Configuració de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDWuvGrjArZMWr2U3VRNM4SAdwbVDGTG3Q",
  authDomain: "quinto-streaming.firebaseapp.com",
  databaseURL: "https://quinto-streaming-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "quinto-streaming",
  storageBucket: "quinto-streaming.firebasestorage.app",
  messagingSenderId: "1080141028662",
  appId: "1:1080141028662:web:4b3b548c949ca30c80a797"
};

// Inicialitzar app només un cop
const app = initializeApp(firebaseConfig);

// Exportar serveis
export const database = getDatabase(app);
export const auth = getAuth(app);
