//if no user already, creates one.
if (!localStorage.getItem("username")){
  var username = prompt("Enter a username : " , "your username");
  localStorage.setItem('username',username);
}

var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port)

document.addEventListener("DOMContentLoaded", function(event){

  set_username()

  //adds a channel if does not exists!
  document.getElementById('btn-add-channel').addEventListener("click", function(){
    var name = document.getElementById('txt-name-channel').value
    if(!name.trim()){
      alert('channel name can´t be empty')
    }else{
        socket.emit('add_channel',{'name':name})
        document.getElementById('txt-name-channel').value = ''
    }
  })

  //adds a message.
  document.getElementById("btn-send-message").addEventListener("click", function(){
    var message = document.getElementById("txt-message").value
    if (message.trim()){
      channel = localStorage.getItem("channel")
      username = localStorage.getItem("username")
      socket.emit('add_message',{'message':message,'channel':channel,'username':username})
      document.getElementById("txt-message").value = ''
    }
  })

  //select a channel
  document.getElementById("channels").addEventListener("change", function(){
    var channel = document.getElementById("channels").value
    localStorage.setItem("channel",channel)
    socket.emit("load_messages",{"channel":channel})
  })

  socket.on('error', data =>{
    alert(data.message)
  })

  socket.on('add_channel', data => {
    add_channel(data)
  })

  socket.on('load_channels', data => {
    load_channels(data)
  })

  socket.on('add_message', data => {
    if(data.channel == localStorage.getItem("channel")){
        add_message(data.message)
    }
  })

  socket.on('load_messages', data => {
    load_messages(data)
  })

})

window.addEventListener('load', function(event){
  socket.emit('load_channels',{})
})

function set_username(){
  var e = document.getElementById("username")
  e.innerHTML = localStorage.getItem("username")
}

function set_current_channel(){
  var channel = localStorage.getItem("channel")
  document.getElementById("channels").value = channel
  socket.emit('load_messages',{"channel":channel})
}

function add_channel(channel){
  var o = document.createElement("option")
  o.innerHTML = channel.name
  o.setAttribute("value",channel.name)
  document.getElementById("channels").appendChild(o)
  if(document.getElementById("channels").options.length == 1 && !localStorage.getItem("channel")){
    localStorage.setItem("channel",channel.name)
  }
}

function load_channels(channels){
  document.getElementById("channels").innerHTML = ''
  for(var i = 0; i < channels.length; i++){
    add_channel(channels[i])
  }
  set_current_channel()
}

function add_message(message){
  var p = document.createElement("p")
  var d = document.createElement("datetime")
  p.innerHTML = message.text
  d.innerHTML = message.username + " " + message.datetime
  var messages = document.getElementById("messages")
  messages.appendChild(p)
  messages.appendChild(d)
}

function load_messages(messages){
  document.getElementById("messages").innerHTML = ''
  for(var i = 0; i < messages.length; i++){
    add_message(messages[i])
  }
}
