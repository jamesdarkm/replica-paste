// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

//Auth
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: import.meta.env.VITE_APIKEY,
//   authDomain: import.meta.env.VITE_AUTHDOMAIN,
//   projectId: import.meta.env.VITE_PROJECTID,
//   storageBucket: import.meta.env.VITE_STORAGEBUCKET,
//   messagingSenderId: import.meta.env.VITE_MESSAGINGSENDERID,
//   appId: import.meta.env.VITE_APPID
// };

const firebaseConfig = {
  apiKey: 'AIzaSyAm_wD4xO38VKZki6Pf8VRQY3AETiyk7ME',
  authDomain: 'replica-paste.firebaseapp.com',
  projectId: 'replica-paste',
  storageBucket: 'replica-paste.appspot.com',
  messagingSenderId: '923298378577',
  appId: '1:923298378577:web:b04dc0f0d9462e52439970'
};


// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore();
const storage = getStorage();

const auth = getAuth(app);
export { app,db,storage,auth }