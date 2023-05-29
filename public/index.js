console.log("I am here")

const socket=io("http://localhost:3000");


const messages=[]
let users=[]

socket.on("message_client", (message)=>{
    messages.push(message)
    updateMessages();
})

socket.on("users", (_users)=>{
    users=_users;
    updateUsers();
})

socket.emit("ping",{
    message: "Hi there friend"
})


socket.on("message", (data)=>{
    console.log(data)
})

const messageform=document.querySelector(".chatbox form");
const messageList=document.querySelector("#messagelist");
const userlist= document.querySelector("ul#users");
const chatboxInput=document.querySelector(".chatbox input");
const useraddform=document.querySelector(".modal")
const backdrop=document.querySelector(".backdrop")
const useraddinput= document.querySelector(".modal input")

messageform.addEventListener("submit",messageSubmitHandler)

useraddform.addEventListener("submit", userAddHandler)

function messageSubmitHandler(e){
  e.preventDefault();

  let message=chatboxInput.value;

  if(!message){
    return alert("Message not be empty")
  }

  socket.emit("message", message)

  chatboxInput.value=""
}

function updateMessages(){
   messageList.textContent="";

   for(let x=0; x<messages.length;x++){
    messageList.innerHTML+=`<li>
                            <p>  ${messages[x].user}        </p>
                            <p>  ${messages[x].message}        </p>
                            </li>
    `
   }
}

function updateUsers(){
    userlist.textContent=""

    for(let x=0;x<users.length;x++){
        let node=document.createElement("li")

        let textnode = document.createTextNode(users[x]);
        node.appendChild(textnode)

        userlist.appendChild(node)
    }
}
function userAddHandler(e){
    e.preventDefault();

    let username= useraddinput.value;

    if(!username){
        return alert("You must add a user name")
    }

    socket.emit("add user", username)

    useraddform.classList.add("disappear")
    backdrop.classList.add("disappear")

}
