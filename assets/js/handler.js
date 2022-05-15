function dkMode() {


    var elem2 = document.getElementsByClassName('darkBg');


    for (var i = 0; i < elem2.length; i++) {
        elem2[i].classList.toggle("bg-light")
        elem2[i].classList.toggle("text-dark")
    }

    var elem = document.getElementById('bodyMain');


    if (elem.classList[0] == "bodyDark" || elem.classList[1] == "bodyDark") {
        elem.classList.remove('bodyDark')
        elem.classList.toggle('bodyLight');
    } else {
        elem.classList.remove('bodyLight');
        elem.classList.toggle('bodyDark')
    }
}

function sidebarView() {
    document.getElementById('teamDetails').classList.toggle('show');
    document.getElementById('teamDetails').classList.toggle('openBar');
    console.log(document.getElementById('teamDetails').classList)


}



document.getElementById('inputfile').addEventListener('change', function () {

    console.log("Done")
    var fr = new FileReader();
    fr.onload = function () {
        document.getElementById('codeInput').textContent = fr.result;
    }

    fr.readAsText(this.files[0]);

    this.value=null

})



document.getElementById('messageInput').addEventListener('keypress', function (e) {


    console.log(e.target.value)
    socket.emit('checkEmotion',{
        text:messageInput.value
    })
    

})




function loadMessages(){
    setTimeout(()=>{

        let messages=JSON.parse(localStorage.getItem(`${userName.innerHTML}@${roomName.innerHTML}`))
        console.log(messages)
        messages.map(element => {
            return generateMessage(JSON.parse(element))
        });

    },1000)
}


function saveMessage(){
    let lastMsgArray=[]
    for(let i=messageArray.length;i>=messageArray.length-7;i--){
        lastMsgArray.push(messageArray[i])
    }

    lastMsgArray.reverse()
    localStorage.setItem(`${userName.innerHTML}@${roomName.innerHTML}`,JSON.stringify(lastMsgArray))
}