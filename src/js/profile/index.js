import {authService, storageService, dbService} from '/src/js/fbase.js'
import {updateProfile} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";
import { ref, getDownloadURL, uploadString, deleteObject} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-storage.js";
import {v4 as uuidv4 } from 'https://cdn.skypack.dev/uuid@8'
import {doc, getDoc, collection, getDocs, updateDoc} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js"

console.log(storageService);
function searchParam(key) {
    return new URLSearchParams(location.search).get(key);
}
const resultimg = document.getElementById('profileimg')
if(searchParam('newuser') == 'true') {
    document.querySelector('h1').innerText = 'Hello Codes 사용을 위해 프로필을 설정해주세요.'
} else {
    document.querySelector('h1').innerText = '프로필 변경'
}

function filechange(event) {
    const files = event.target.files;
    const thefile = files[0]
    const reader = new FileReader()
    reader.onloadend = (finishevent) => {
        resultimg.src = finishevent.currentTarget.result
        resultimg.hidden = false
    }
    reader.readAsDataURL(thefile)
}
async function onSubmit(event) {
    event.preventDefault()
    console.log(resultimg.src, location.href);
    if(resultimg.src != location.href + '#')
    {
        console.log('need to update img+nick');
        const fileRef = ref(storageService, `${authService.currentUser.uid}/${uuidv4()}`)
        uploadString(fileRef, resultimg.src , 'data_url').then(() => {
            console.log('upload img to db... done✅');
        })
        let url = '';
        getDownloadURL(fileRef).then(async (d) => {
            if(authService.currentUser.photoURL !== null) {
                const imgRef = ref(storageService, authService.currentUser.photoURL)
                deleteObject(imgRef).then(() => {
                    console.log('delete original img... done✅');
                }).catch((e) => {
                    console.log(e);
                })
            }
            let uid = authService.currentUser.uid;
            const all = await getDocs(collection(dbService, 'userinfo'))
                all.forEach((doc) => {
                    console.log(doc);
                    if(doc.data().displayName === document.getElementById('nickinput').value && doc.data().displayName !== null && doc.id != authService.currentUser.uid)
                    {
                        alert('이미 존재하는 닉네임입니다.')
                        uid = false;
                        return;
                    }
                })
            const docRef = doc(dbService, 'userinfo', uid)
            const docsnap = await getDoc(docRef)
            updateDoc(doc(dbService, 'userinfo', uid), {
                displayName: document.getElementById('nickinput').value
            })
            console.log(docsnap.data());
            updateProfile(authService.currentUser, {
                displayName: document.getElementById('nickinput').value,
                photoURL: d
            })
                .then(() => {
                    console.log('changed user data... done✅', authService.currentUser);
                    console.log(url);
                })
                .catch((e) => {
                    console.log(e);
                })
        })
    } else {
        let uid = authService.currentUser.uid;
        const all = await getDocs(collection(dbService, 'userinfo'))
            all.forEach((doc) => {
                console.log(doc);
                if(doc.data().displayName === document.getElementById('nickinput').value && doc.data().displayName !== null && doc.id != authService.currentUser.uid)
                {
                    alert('이미 존재하는 닉네임입니다.')
                    uid = false;
                    return;
                }
            })
        const docRef = doc(dbService, 'userinfo', uid)
        const docsnap = await getDoc(docRef)
        updateDoc(doc(dbService, 'userinfo', uid), {
            displayName: document.getElementById('nickinput').value
        })
        console.log(docsnap.data());
        updateProfile(authService.currentUser, {
            displayName: document.getElementById('nickinput').value
        })
    }
    if(searchParam('newuser') == 'true')
    {
        location.href = '/'
    }
}
document.getElementById('imgselect').addEventListener('change', filechange);
document.querySelector('form').addEventListener('submit', onSubmit);
setTimeout(() => {
    if(authService.currentUser === null)
    {
        location.href = '/account/login'
    } else {
        document.getElementById('nickinput').value = authService.currentUser.displayName;

        alert("이미 존재하는 아이디 입니다!")
    }
}, 1000)
