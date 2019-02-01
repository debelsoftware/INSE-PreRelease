document.getElementById('chat-button').addEventListener('click', toggleChat);
document.getElementById('chat-close').addEventListener('click', toggleChat);

function toggleChat(){
  const chat = document.getElementById('chat');
  if (chat.style.display == "grid"){
    chat.style.display = 'none';
  }
  else{
    chat.style.display = 'grid';
  }
}

let socket = io.connect('https://makerapi.host');
let room = "demoroom";
let canSend = false;

checkSend();

document.getElementById('send-button').addEventListener('click',send);
window.addEventListener('load',init);
document.getElementById('message-input').addEventListener('input', checkSend)
document.getElementById('message-input').addEventListener('keyup', function(event) {
    event.preventDefault();
    if (event.keyCode === 13) {
        document.getElementById('send-button').click();
    }
});

function checkSend(){
  if (document.getElementById('message-input').value == ""){
    canSend = false;
  }
  else {
    canSend = true
  }
}

function charLimitCheck(data){
  if (data.length > 100){
    return false;
  }
  else{
    return true;
  }
}

function init(){
  socket.connect();
  socket.emit('joinroom', room);
}

function sendImage(url){
  socket.emit('image', {
    room: room,
    data: url
  });
  let e = document.createElement('div');
  e.innerHTML = "<div class='message self'><img class='message-image'></div>";
  e.getElementsByClassName("message-image")[0].src = url;
  document.getElementById('messages').appendChild(e.firstChild);
  document.getElementById('messages').scrollTop = document.getElementById('messages').scrollHeight;
  document.getElementById('message-input').value = "";
}

function send(){
  let message = document.getElementById('message-input').value;
  if (message.startsWith("giphy")) {
    fetch('http://api.giphy.com/v1/gifs/random?api_key=dgVZUC6x9W9oxcuciT07xrWd9TykE1EH&tag=' + message.substr(message.indexOf(" ") + 1))
      .then(
        function(response) {
          if (response.status !== 200) {
            console.log('Looks like there was a problem. Status Code: ' +
              response.status);
            return;
          }

          response.json().then(function(data) {
            if (data.data.image_original_url) {
              sendImage(data.data.image_original_url);
            }
            else {
              alert("Failed to get that GIF");
              document.getElementById('message-input').value = "";
            }

          });
        }
      )
      .catch(function(err) {
        console.log('Fetch Error :-S', err);
      });
  }
  else {
    if (canSend == true){
      if (charLimitCheck(message)){
        socket.emit('message', {
          room: room,
          data: document.getElementById('message-input').value
        });
        let e = document.createElement('div');
        e.innerHTML = "<div class='message self'><p class='message-text'></p></div>";
        e.getElementsByClassName("message-text")[0].textContent = document.getElementById('message-input').value;
        document.getElementById('messages').appendChild(e.firstChild);
        document.getElementById('messages').scrollTop = document.getElementById('messages').scrollHeight;
        document.getElementById('message-input').value = "";
        canSend = false;
      }
      else {
        alert('messages must be less than 100 characters');
      }
    }
  }
}

socket.on('message',function(data){
  let e = document.createElement('div');
  e.innerHTML = "<div class='message'><img class='profile-pic' src='../img/makersealonly.svg' id='me4'><p class='message-text'></p><span class='message-info'>Anon</span></div>";
  e.getElementsByClassName("message-text")[0].textContent = data;
  document.getElementById('messages').appendChild(e.firstChild);
  document.getElementById('messages').scrollTop = document.getElementById('messages').scrollHeight;
});

socket.on('image',function(data){
  let e = document.createElement('div');
  e.innerHTML = "<div class='message'><img class='profile-pic' src='../img/makersealonly.svg' id='me4'><img class='message-image'><span class='message-info'>Anon Powered by GIPHY</span></div>";
  e.getElementsByClassName("message-image")[0].src = data;
  document.getElementById('messages').appendChild(e.firstChild);
  document.getElementById('messages').scrollTop = document.getElementById('messages').scrollHeight;
});
