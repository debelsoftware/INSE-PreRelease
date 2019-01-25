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

function send(){
  let message = document.getElementById('message-input').value;
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

socket.on('message',function(data){
  let e = document.createElement('div');
  e.innerHTML = "<div class='message'><img class='profile-pic' src='../img/makersealonly.svg' id='me4'><p class='message-text'></p><span class='message-info'>Anon</span></div>";
  e.getElementsByClassName("message-text")[0].textContent = data;
  document.getElementById('messages').appendChild(e.firstChild);
  document.getElementById('messages').scrollTop = document.getElementById('messages').scrollHeight;
});
