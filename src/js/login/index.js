import {initializeApp} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js"
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";
function searchParam(key) {
    return new URLSearchParams(location.search).get(key);
}
const firebaseConfig = {
  apiKey: "AIzaSyCYmZ9Yt1EzlbwGKQJRj1wKXgAn0wcbte4",
  authDomain: "hellocodes.firebaseapp.com",
  projectId: "hellocodes",
  storageBucket: "hellocodes.appspot.com",
  messagingSenderId: "729880555756",
  appId: "1:729880555756:web:6fbca04c953880ec7035c9"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

document.getElementById('loginform').addEventListener('submit', (event) => {
    event.preventDefault()
    const requestedUser = {
        email: document.getElementById('loginemail').value,
        pw: document.getElementById('loginpw').value
    }
    signInWithEmailAndPassword(auth, requestedUser.email, requestedUser.pw)
        .then((userCredential) => {
            console.log(userCredential);
            location.href = '../../index.html'
            if(searchParam('next') != null) {
                location.href = searchParam('next')
            } else {

            }
        })
        .catch((e) => {
            console.log(e.message);
        });
});

