const all = document.getElementById('all')

async function load() {
    const json = await fetch('/problem.json')
    const data = json.json()
    data.then((d) => {
        for(let i=0;i<d.number.length;i++)
        {
            const h4 = document.createElement('h4')
            const a = document.createElement('a')
            a.href = `/problem/?id=${d.number[i]}`
            a.innerText = `${d.number[i]} : ${d.name[i]}`
            h4.appendChild(a)
            all.appendChild(h4)
        }
    })
}

load()