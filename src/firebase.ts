// Import the functions you need from the SDKs you need
import { getAuth } from 'firebase/auth'
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCHYhGpfHjstLMFf61hcevvQPjyhVBKvKw",
  authDomain: "reactsns-v1.firebaseapp.com",
  projectId: "reactsns-v1",
  storageBucket: "reactsns-v1.appspot.com",
  messagingSenderId: "100340548993",
  appId: "1:100340548993:web:adb9c5979508a8436ed480"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app)