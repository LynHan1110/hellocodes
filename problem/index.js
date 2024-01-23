import {dbService, authService} from '/src/js/fbase.js'
import {doc, getDoc, collection, getDocs, updateDoc} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js"
const dialog = document.querySelector('dialog');
function firework() {
    var duration = 15 * 100;
    var animationEnd = Date.now() + duration;
    var defaults = { startVelocity: 25, spread: 360, ticks: 50, zIndex: 0 };
    //  startVelocity: 범위, spread: 방향, ticks: 갯수
  
    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }
  
    var interval = setInterval(function () {
      var timeLeft = animationEnd - Date.now();
  
      if (timeLeft <= 0) {
        return clearInterval(interval);
      }
  
      var particleCount = 50 * (timeLeft / duration);
      // since particles fall down, start a bit higher than random
      confetti(
        Object.assign({}, defaults, {
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
        })
      );
      confetti(
        Object.assign({}, defaults, {
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
        })
      );
    }, 250);
  }
const example = document.getElementById('example')
function searchParam(key) {
    return new URLSearchParams(location.search).get(key);
}
console.log(searchParam('id'));
let val = ''
async function load() {
    // 파일 읽어 오기
    const data = await fetch('/problem.json');
    // JSON으로 해석
    const obj = await data.json();
    const objIndex = obj.number.indexOf(searchParam('id'))
    document.querySelector('#prob-name').innerHTML = `${obj.number[obj.number.indexOf(searchParam('id'))]} : ${
        obj.name[objIndex]
    }`;
    if(objIndex === -1)
    {
        location.href = '/'
    }
    document.getElementById(obj.problemtierid[objIndex]).hidden = false
    document.getElementById('tier').innerHTML = `<img src="/src/img/${obj.problemtierid[objIndex]}.png" alt='tier' width='20px' height='20px'/> ${obj.problemteirdisplayName[objIndex]}` //src/img/star.png
    document.querySelector('#prob').innerHTML = `${marked.parse(obj.description[objIndex])}`;
    if(obj.doesinput[objIndex] == 0)
    {
        document.getElementById('input').hidden = true;
    }
    console.log(obj);
    val = obj
    for(let i=0;i<obj.tc_output[objIndex].length;i++)
    {
        const div = document.createElement('div')
        if(obj.doesinput[objIndex] == 1) {
            const newh4_1 = document.createElement('h4')
            const newcod_1 = document.createElement('code')
            newh4_1.innerText = `입력 ${obj.tc_output[objIndex].length > 1 ? '예시' : ''} ${i+1}`
            newcod_1.innerText = obj.tc_input[objIndex][i]
            div.appendChild(newh4_1)
            div.appendChild(newcod_1)
        }
        const newh4 = document.createElement('h4')
        const newcod = document.createElement('code')
        newh4.innerText = `출력 ${obj.tc_output[objIndex].length > 1 ? '예시' : ''} ${i+1}`
        newcod.innerText = obj.tc_output[objIndex][i]
        div.appendChild(newh4)
        div.appendChild(newcod)
        example.appendChild(div)
    }
    for(let i=0;i<obj.tag.tagname[objIndex].length;i++)
    {
        const area = document.getElementById('tag')
        const span1 = document.createElement('span')
        const span2 = document.createElement('span')
        const span = document.createElement('span')
        span.className = 'tag_all'
        span1.innerHTML = `${obj.tag.tagname[objIndex][i]}`
        span2.className = 'icon'
        span1.className = 'text'
        span2.innerHTML = obj.tag.tagicon[objIndex][i]
        span.style.marginRight = '10px'
        span.appendChild(span2)
        span.appendChild(span1)
        area.appendChild(span)
        // area.innerHTML += '&nbsp;&nbsp;&nbsp;'
    }
}
document.getElementById('autocheckbtn').addEventListener('click', async (event) => {
    event.preventDefault()
    if(authService.currentUser != null)
    {
        document.getElementById('compileerror').innerText = ""
        if(document.getElementById('err0r').innerText != "") {
            document.getElementById('err0r').innerText = ""
        }
        let correctnum = 0;
        const data = await fetch('/problem.json')
        const obj = await data.json()
        let complete;
        document.getElementById('compilearea').hidden = true;
        document.getElementById('autocheckloading').hidden = false
        const objIndex = obj.number.indexOf(searchParam('id'))
        let i;
        for(i=0;i<obj.hidden_tc_output[objIndex].length;i++)
        {
            complete = false
            if(obj.doesinput[objIndex] == 1) {
                console.log(obj.hidden_tc_input[objIndex][i]); //print(int(input()) + int(input()))
                document.getElementById('input').value = obj.hidden_tc_input[objIndex][i];
            }
            runit(true)
            let timeout = setTimeout(() => {
                console.log(document.getElementById('output').innerText, obj.hidden_tc_output[objIndex][i], i,document.getElementById('input').value);
                if(document.getElementById('output').innerText == `${obj.hidden_tc_output[objIndex][i-1]}\n`) {
                    console.log(`${i}번째 채점 통과 : ${document.getElementById('output').innerText}`);
                    correctnum++;
                } else {
                    console.log(`${i}번째 채점 실패 : ${document.getElementById('output').innerText}`);
                }
                
            }, 40)
            complete = true
        }
        let interval = setInterval( async () => {
            console.log(val);
            if(complete === true && i==obj.hidden_tc_output[objIndex].length) {
                const resultarea = document.getElementById('autocheckresult')
                if(correctnum === obj.hidden_tc_output[objIndex].length)
                {
                    let editor = ace.edit("yourcode");
                    editor.setValue("");
                    // resultarea.querySelector('h2').innerText = '맞았습니다!';
                    dialog.querySelector('h1').style.color = 'GREEN'
                    resultarea.hidden = false
                    document.getElementById('autocheckloading').hidden = true;
                    dialog.querySelector('h1').innerText = `티어 획득 : ${val.problemteirdisplayName[val.number.indexOf(searchParam('id'))]} `
                    dialog.showModal()
                    dialog.querySelector('img').hidden = false
                    dialog.querySelector('img').src = `/src/img/${val.problemtierid[val.number.indexOf(searchParam('id'))]}.png`
                    updateDoc(doc(dbService, 'userinfo', authService.currentUser.uid), {
                        tier: val.problemtierid[val.number.indexOf(searchParam('id'))]
                    })
                    firework()
                } else {
                    dialog.querySelector('h1').innerText = '틀렸습니다...';
                    dialog.querySelector('h1').style.color = 'RED'
                    dialog.showModal()
                    dialog.querySelector('img').hidden = true
                    resultarea.hidden = false
                    document.getElementById('autocheckloading').hidden = true;
                }
                document.getElementById('compilearea').hidden = false;
                document.getElementById('output').innerText = "";
                document.getElementById('input').value = "";
                clearInterval(interval)
            }
        }, 40)
    } else {
        window.alert('로그인하세요.')
    }



});
document.getElementById('article').style.display = "none"
window.onload = load;
document.getElementById("change").addEventListener('click', () => {
    if(document.getElementById('article').style.display === "none") {
        document.getElementById('article').style.display = "block";
        document.getElementById('terminal').style.display = "none"
        document.getElementById('compilearea').hidden = false
        document.getElementById('prob').hidden = true
        document.querySelectorAll('.examplearea').forEach((element) => {
            element.hidden = true
        })
        document.getElementById('autocheckresult').hidden = true
    } else {
        document.getElementById('article').style.display = "none";
        document.getElementById('terminal').style.display = "block"
        document.getElementById('compilearea').hidden = true
        document.getElementById('prob').hidden = false
        document.querySelectorAll('.examplearea').forEach((element) => {
            element.hidden = false
        })
    }
    dialog.close()
    document.getElementById('err0r').innerHTML = ""
    document.getElementById('autocheckresult').hidden = true
})

document.getElementById('dialogtogle').addEventListener('click', () => {
    dialog.close()
})