
function outf(text) { 
    var mypre = document.getElementById("output"); 
    mypre.innerHTML = mypre.innerHTML + text; 
}
function builtinRead(x) {
    if (Sk.builtinFiles === undefined || Sk.builtinFiles['files'][x] === undefined) throw "File not found: '" + x + "'";
    return Sk.builtinFiles['files'][x];
}
function yourFunction(prompt) {
    indexinput++;
    return new Promise((resolve, reject) => {
        let input = document.querySelector('#input').value;
        const inputlines = document.querySelector('#input').value.split('\n')
        resolve(inputlines[indexinput])
    });
}
function runit(autocheck) {
    indexinput = -1;
    var editor = ace.edit("yourcode");
    var prog = editor.getValue();
    var mypre = document.getElementById('output');
    mypre.innerHTML = '';
    Sk.pre = 'output';
    Sk.configure({
        inputfun: yourFunction,
        inputfunTakesPrompt: true,
        output: outf,
        read: builtinRead /* then you need to output the prompt yourself */
    });
    
    // example function with promise
    

    (Sk.TurtleGraphics || (Sk.TurtleGraphics = {})).target = 'mycanvas';
    var myPromise = Sk.misceval.asyncToPromise(function () {
        return Sk.importMainWithBody('<stdin>', false, prog, true);
    });
    myPromise.then(
        function (mod) {
            console.log('success');
        },
        function (err) {
            if(autocheck) {
                document.getElementById('err0r').innerHTML = `<code>${err.toString()}</code>`
            } else {
                document.getElementById('compileerror').innerHTML = `<code>${err.toString()}</code>`
            }

            console.log(err.toString());
        }
    );
}
