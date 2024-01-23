import {initializeApp} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js"
import { createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword,} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";
import {fbaseapp, authService, dbService} from '/src/js/fbase.js'
import {doc, setDoc} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js"

async function onSubmit(event) {
    event.preventDefault(); {
        const requestedUser = {
            email: document.getElementById('email').value,
            pw: document.getElementById('pw').value,
        }
        console.log(requestedUser);
        createUserWithEmailAndPassword(authService, requestedUser.email, requestedUser.pw)
            .then(async (userData) => { 
                try {
                    console.log(dbService);
                    await setDoc(doc(dbService, 'userinfo', authService.currentUser.uid), {
                        displayName: null,
                        tier: null
                    })
                    location.href = "/"
                }
                catch(e) {
                    console.log(e);
                }
            })
            .catch((e) => {
                console.log(e.message)
                alert("이미 존재하는 이메일입니다!");
            })

    }
}
document.getElementById('form').addEventListener('submit', onSubmit);
