

//Socket io client Initialization
var socket = io()

//Getting HTML Elements
const messageInput = document.getElementById('messageInput')
const messageSender = document.getElementById('messageSender')
const messageTime = document.getElementById('messageTime')
const messageBody = document.getElementById('messageBody')
const messageDiv = document.getElementById('chatBox')
const messageForm = document.getElementById('messageForm')
const messageBtn = document.getElementById('messageBtn')
const userName = document.getElementById('uname')
const roomName = document.getElementById('rname')
const memberList = document.getElementById('memberList')
const memberPara = document.getElementById('member')
const messageTone = document.getElementById('messageTone')
const codeInput = document.getElementById('codeInput')
const codeInputBtn = document.getElementById('codeInputButton')
const codeOutput = document.getElementById('codeOutput')




//Function to Scrolll

function scrollChat(heightOfMessage){
    messageDiv.scrollTop=messageDiv.offsetHeight+heightOfMessage
}

//Function to beep
function playSound() {   
    
    messageTone.play()  
} 







//Function to Add a new Message
function generateMessage(data){
  
    //Creating a New Message
    var node=messageDiv.lastElementChild;
    var message=node.cloneNode(true)

    //Setting Message Details to Message
    message.firstElementChild.firstElementChild.innerHTML=data.sender;
    message.firstElementChild.lastElementChild.innerHTML=data.time;
    message.lastElementChild.innerHTML=data.message;
    message.style.whiteSpace="pre";
    message.classList.add('darkBg')

    //Adding Message to CONTAINER
    messageDiv.appendChild(message)

    //Playing Notification Tone
    playSound()

    //Returning Message Height
    return message.offsetHeight

}




//Function to Update Member List
function membersShow(list){


 
    //Removing All Current Members from List
    memberList.innerHTML='';

    //Looping To Add all Updated Members Again
    for(var i=0;i<=list.length;i++){

        //Cloning a Node
        var node=memberPara.cloneNode(true)

        //Adding a Para and Making Changes
        node.innerHTML='<i class="fa fa-user"></i>';
        node.className="memberItem";
        node.innerHTML+=list[i].name;
        node.classList.add("align-content-center")

        //Adding the Member Item
        memberList.appendChild(node)

    }
}



//When User sends a Message server sends this Event
socket.on('userMessageRender',data=>{


    console.log("EVent Received")
   
   //Generating a Message and Getting its Height
   const heightOfMessage=generateMessage(data)

   //Srcolling the Message Sreen Automatically
   scrollChat(heightOfMessage)
 
})






//Updating the Members List
socket.on('memberListRender',(data)=>{

    console.log("Render MemberList Executed")
    console.log(data)
    //Calling the Function to Update HTML 
    membersShow(data) //Defined Above in this File
})


socket.on('codeCompiled',(data)=>{
    codeInputBtn.innerHTML="COMPILE"
    codeOutput.value=data
})





//Getting Time
const date=new Date();

//When User Clicks on Send to Send Message
function sendMessage(element){
    //Only Send Message if it is not empty
    if(element.value!=""){

        //Emitting the Message to Server
        socket.emit('userMessage',{
            message:element.value,
            roomName:roomName.innerText
        })
    }

    //Emptying the value of message Input
    messageInput.value=''
    messageInput.focus()
}



//When User CLicks Compile Button 
function codeCompile(){
    
    codeInputBtn.innerHTML="Loading..."
    //Emitting Code to Server
    socket.emit('codeWritten',{
        code:codeInput.value,
        language:"py",
        input:" ",
    })

}


// This Event Emits When User Joins
socket.emit('joined',{
    username:userName.innerText,
    roomName:roomName.innerText
})


