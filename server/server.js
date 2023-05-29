const express= require("express")
const socket=require("socket.io")
const app=express();

const server= require("http").createServer(app)


app.use(express.static('public'));


app.get('/', function(req, res) {
    res.sendFile(__dirname + '/public/index.html');
  });

const io=socket(server,{
    cors:{
        origin: "*",
        methods: ["GET","POST"]
    }
})

let port=3000;

server.listen(port, ()=>{
    console.log("listening to port: "+port)
})


const users=[];

io.on("connection", (socket)=>{
    console.log("Connected to "+socket.id)

    socket.on("ping",(data)=>{
        console.log(data, ": from the ping event")
    })

    io.sockets.emit("message",   {
    message: "I love you",
    })
     
    socket.on("add user", (username)=>{
        socket.user= username;
        users.push(username)
        io.sockets.emit("users", users)

    })
    socket.on("message", (message)=>{
        io.sockets.emit("message_client", {
        message,
        user: socket.user
        })

        socket.on("disconnect", ()=>{
            console.log("we are disconeccting ", socket.user)

            if(socket.user){
                users.splice(users.indexOf(socket.user),1)

                io.sockets.emit("users", users)

                console.log("reimaning user: ",users)
            }

        })
    })
})