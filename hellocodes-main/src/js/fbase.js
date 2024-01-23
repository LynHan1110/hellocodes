import {initializeApp} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js"
import { getAuth} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-storage.js";
import {getFirestore} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js"
const firebaseConfig = {
  apiKey: "AIzaSyCYmZ9Yt1EzlbwGKQJRj1wKXgAn0wcbte4",
  authDomain: "hellocodes.firebaseapp.com",
  projectId: "hellocodes",
  storageBucket: "hellocodes.appspot.com",
  messagingSenderId: "729880555756",
  appId: "1:729880555756:web:6fbca04c953880ec7035c9"
};
export const fbaseapp = initializeApp(firebaseConfig);
export const storageService = getStorage(fbaseapp)
export const authService = getAuth(fbaseapp);
export const dbService = getFirestore(fbaseapp)