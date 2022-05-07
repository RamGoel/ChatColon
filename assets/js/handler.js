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



    document.getElementById('inputfile').addEventListener('change', function() {
            
        var fr=new FileReader();
        fr.onload=function(){
            document.getElementById('codeInput').textContent=fr.result; }
              
        fr.readAsText(this.files[0]);

    })


