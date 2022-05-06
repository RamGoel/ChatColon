//Importing Node Modules
const bodyParser = require('body-parser');
const express = require('express');
const res = require('express/lib/response');
const app = express();
const server = require('http').createServer(app);
const socketio = require('socket.io');
const io = socketio(server);
const axios=require('axios')
const path = require('path');
const port = process.env.PORT || 3000;



//Telling Server to Access these Folders
app.use(express.static(__dirname + '/assets/js'))
app.use(express.static(__dirname + '/views'))
app.use(express.static(__dirname + '/assets/css'))
app.use(express.static(__dirname + '/assets/images'))
app.use(express.static(__dirname + '/assets/audio'))

//Enabling Body Parser
app.use(bodyParser.urlencoded({
    extended: true
}))

//setting View engine to Embedded JavaScript (Google for it if you want to learn More)
app.set('view engine', 'ejs')


//Array for Users
var userArray = []


//Serving Login Page
app.get('/', (req, res) => {

    res.render('index',{nameValue:null,validError:null,roomValue:null})

})


app.get('/:roomName',(req,res)=>{
    var room=String(req.params.roomName)
    res.render('index',{nameValue:null,validError:null,roomValue:room})
})

//Handling Login of User
app.post('/login', (req, res) => {
    var nameOfUser = req.body.userName;
    var nameOfRoom = req.body.roomName;

    if (nameOfUser.length > 2) {

        res.render('dash', {
            code: "print('Hello')",
            output: "Output Comes Here",
            userName: nameOfUser ,
            roomName:nameOfRoom,
            inviteLink:`/${nameOfRoom}`
        })



    } else {
        res.render('index', {
            validError: "Min 3 letter Required",
            nameValue:nameOfUser,
            roomValue:nameOfRoom
        })
    }


})



//SocketIO Connections
io.on("connection", socket => {

    
    //Client EMits Joined Event on Joining
    socket.on('joined', data => {

        

        //Logging Join Message to Server 
        console.log(data.username+" Connected in "+data.roomName)


        //Creating Object of User Details
        var newUser = {
            id: socket.id,
            name: data.username,
            roomName:data.roomName
        };


        //Adding User to Array
        userArray.push(newUser)

        //Joining Socket to Room
        socket.join(data.roomName)
        
        console.log(userArray)

        // //Getting Users of Joined User's Room
        // var roomUsers=userArray.filter(item=>{
        //     return item.roomName == data.roomName;
        // })


        // //Emitting Users List to All Group Members
        // io.to(data.roomName).emit('memberListRender',roomUsers);

        //Getting a Date
        const date = new Date()

        //Emitting User Joined Message to Other Group Members
        socket.to(data.roomName).emit('userMessageRender', {
            message: `${data.username} joined the chat`,
            time: `${date.getHours()}:${date.getMinutes()}`,
            sender: "Admin"
        })

        console.log("CheckPOinyt")

        //Emitting Welcome Message to User
        socket.emit('userMessageRender', {
            message: "Welcome to chat",
            time: `${date.getHours()}:${date.getMinutes()}`,
            sender: "Admin"
        })

        //Above Code Executes when new User Joins.
    })


    //When User Clicks Send Button then Client Sends this Event
    socket.on('userMessage', (data) => {

        //Getting Time
        const date = new Date()

        //Identifying User From Array
        var senderUser = userArray.find(item => {
            return item.id == socket.id
        })

        //Sending Message to all Group Members
        io.to(data.roomName).emit('userMessageRender', {
            message: data.message,
            sender: senderUser.name,
            time: `${date.getHours()}:${date.getMinutes()}`
        })

        //Above Code Executes when user Send Message
    })


    socket.on('codeWritten',(data)=>{

        var dataSend = JSON.stringify({
            "code": data.code,
            "language": data.language,
            "input": data.input
          });
      
        var config = {
          method: 'POST',
          url: 'https://codexweb.netlify.app/.netlify/functions/enforceCode',
          headers: {
            'Content-Type': 'application/json'
          },
          data: dataSend
        };
      
        axios(config)
          .then(function (response) {
            socket.emit("codeCompiled",response.data.output);
            console.log(response.data.output);
          })
          .catch(function (error) {
            console.log(error)
            res.redirect('/loginPost')
          });
    })

    //Emits when User Leaves Chat
    socket.on('disconnect',()=>{

        //Getting Time
        const date = new Date()

        
        //Getting Details of Leaved User
        var userLeave = userArray.find(item => {
            return item.id == socket.id;
        })
        
        //Logging Disconnect Message to Server
        console.log(userLeave.name+ "disconnected")

        //Sending User Leaved Message to All Users
        socket.to(userLeave.roomName).emit('userMessageRender',{
            sender:"Admin",
            message:userLeave.name+` leaved the chat!`,
            time:`${date.getHours()}:${date.getMinutes()}`
        })

         //Removing User from Array
         userArray.pop(userLeave);

         //Checking How many User Remains
         console.log(userArray)

        // //Getting Users of Joined User's Room
        // var roomUsersDel=userArray.filter(item=>{
        //     return item.roomName == data.roomName;
        // })


        // //Emitting Users List to All Group Members
        // io.to(data.roomName).emit('memberListRender',roomUsersDel);


       
    })


   


})





//Listening the Server on port 3000
server.listen(port, () => {
    console.log(`Running at port ${port}`)
})