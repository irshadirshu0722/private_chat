// firebase.js
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";


const firebaseConfig = {
  apiKey: "AIzaSyAFm81iJaX1tqtDqX3QzJGmScOXA0pxcxM",
  authDomain: "privatechat-6d854.firebaseapp.com",
  databaseURL: "https://privatechat-6d854-default-rtdb.firebaseio.com",
  projectId: "privatechat-6d854",
  storageBucket: "privatechat-6d854.firebasestorage.app",
  messagingSenderId: "371742672851",
  appId: "1:371742672851:web:b8b58e19d5311deaffd126"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
