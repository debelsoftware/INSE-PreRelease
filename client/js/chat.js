document.getElementById('chat-button').addEventListener('click', toggleChat);
document.getElementById('chat-close').addEventListener('click', toggleChat);
let loadedMessages = false;

/*-- TOGGLE CHAT --
	DESCRIPTION: Makes the chat show when the user clicks the chat button
	PARAMS: nothing
	RETURNS: nothing
*/
function toggleChat(){
  const chat = document.getElementById('chat');
  if (chat.style.display == "grid"){
    chat.style.display = 'none';
  }
  else{
    chat.style.display = 'grid';
    if (!loadedMessages) {
      initChat();
    }
  }
}

let socket = io.connect('https://makerapi.host');
let room = localStorage.getItem("team");
let canSend = false;

checkSend();

document.getElementById('send-button').addEventListener('click',send);
document.getElementById('message-input').addEventListener('input', checkSend)
document.getElementById('message-input').addEventListener('keyup', function(event) {
    event.preventDefault();
    if (event.keyCode === 13) {
        document.getElementById('send-button').click();
    }
});

/*-- TOGGLE CHAT --
	DESCRIPTION: checks that the user is able to send a message. for example they cant send if the textbox
              empty. if the user cant send, the global variable 'canSend' is sent to false.
	PARAMS: nothing
	RETURNS: nothing
*/
function checkSend(){
  if (document.getElementById('message-input').value == ""){
    canSend = false;
  }
  else {
    canSend = true
  }
}

/*-- charLimitCheck --
	DESCRIPTION: checks the the length of data for a text message is under the system limit
	PARAMS: data
	RETURNS: BOOLEAN value (whether or not the text has passed validation)
*/
function charLimitCheck(data){
  if (data.length > 100){
    return false;
  }
  else{
    return true;
  }
}

function getMessages(){
  fetch(host+"messages", {
    method: 'POST',
    body: JSON.stringify({
      "teamID": room,
      "token": sessionStorage.getItem('token')
    }),
    headers:{
      'Content-Type': 'application/json'
    }
  }).then(function(response) {
    if (response.status == 401){ //DETECTS IF USER IS AUTHORISED
      window.location.href = "../login" //IF UNAUTHORISED, USER RETURNED TO TEAM SELECT PAGE
    }
    else if (response.status == 400){
      alert("Sorry, our servers couldn't fetch your chat messages");
    }
    else {
      return response.json();
    }
  }
  )
  .then(function(parsedJson) {
    populateMessages(parsedJson);
  })
  .catch(error => console.log(error));
}

function populateMessages(messages){
  document.getElementById('messages').innerHTML = "";
  for (message of messages){
    if (message.messageType == "txt"){
      if (message.isSelf == "true") {
        let e = document.createElement('div');
        e.innerHTML = "<div class='message self'><p class='message-text'></p></div>";
        e.getElementsByClassName("message-text")[0].textContent = message.messageText;
        document.getElementById('messages').appendChild(e.firstChild);
      }
      else {
        let e = document.createElement('div');
        e.innerHTML = "<div class='message'><img class='profile-pic' src='../img/makersealonly.svg' id='me3'><p class='message-text'></p><span class='message-info'>Anon</span></div>";
        e.getElementsByClassName("message-text")[0].textContent = message.messageText;
        e.getElementsByClassName("message-info")[0].textContent = message.name;
        document.getElementById('messages').appendChild(e.firstChild);
      }
    }
    else {
      if (message.isSelf == "true") {
        let e = document.createElement('div');
        e.innerHTML = "<div class='message self'><img class='self-message-image'><span class='message-info'>Powered by GIPHY</span></div>";
        e.getElementsByClassName("self-message-image")[0].src = message.messageText;
        document.getElementById('messages').appendChild(e.firstChild);
      }
      else {
        let e = document.createElement('div');
        e.innerHTML = "<div class='message'><img class='profile-pic' src='../img/makersealonly.svg' id='me3'><img class='message-image'><span class='message-info'>Anon Powered by GIPHY</span></div>";
        e.getElementsByClassName("message-image")[0].src = message.messageText;
        e.getElementsByClassName("message-info")[0].textContent = message.name + " Powered by GIPHY";
        document.getElementById('messages').appendChild(e.firstChild);
      }
    }
  }
  document.getElementById('messages').scrollTo(0,document.getElementById('messages').scrollHeight);
}

/*-- charLimitCheck --
	DESCRIPTION: establishes a socket connection to our chat server
	PARAMS: nothing
	RETURNS: nothing
*/
function initChat(){
  getMessages();
  loadedMessages = true;
  socket.connect();
  socket.emit('joinroom', {
    room: room,
    user: sessionStorage.getItem('token')
  });
}

/*-- sendImage --
	DESCRIPTION: handles the sending and rendering on the client of a gif from the GIPHY API
	PARAMS: nothing
	RETURNS: nothing
*/
function sendImage(url){
  socket.emit('image', {
    room: room,
    data: url,
    user: sessionStorage.getItem('token')
  });
  let e = document.createElement('div');
  e.innerHTML = "<div class='message self'><img class='self-message-image'><span class='message-info'>Powered by GIPHY</span></div>";
  e.getElementsByClassName("self-message-image")[0].src = url;
  document.getElementById('messages').appendChild(e.firstChild);
  document.getElementById('messages').scrollTop = document.getElementById('messages').scrollHeight;
  document.getElementById('message-input').value = "";
}

/*-- send --
	DESCRIPTION: Run when the user sends a message. checks if the message being sent is a request
              for a gif, if so then we request a random gif from the GIPHY API (info at: https://developers.giphy.com/).
              if the message is just text then the message if sent as plain text after passing
              validation
	PARAMS: nothing
	RETURNS: nothing
*/
function send(){
  let message = document.getElementById('message-input').value;
  if (message.toLowerCase().startsWith("giphy")) {
    fetch('https://api.giphy.com/v1/gifs/random?api_key=dgVZUC6x9W9oxcuciT07xrWd9TykE1EH&tag=' + message.substr(message.indexOf(" ") + 1))
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
          data: document.getElementById('message-input').value,
          user: sessionStorage.getItem('token')
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

// THE CONNECTIONS BELOW WAIT FOR A SIGNAL FROM THE CHAT SERVER FOR INCOMING MESSAGES AND RENDERS THEM IN THE CLIENT

socket.on('message',function(data){
  let e = document.createElement('div');
  e.innerHTML = "<div class='message'><img class='profile-pic' src='../img/makersealonly.svg' id='me3'><p class='message-text'></p><span class='message-info'>Anon</span></div>";
  e.getElementsByClassName("message-text")[0].textContent = data.data;
  e.getElementsByClassName("message-info")[0].textContent = data.user;
  document.getElementById('messages').appendChild(e.firstChild);
  document.getElementById('messages').scrollTop = document.getElementById('messages').scrollHeight;
});

socket.on('image',function(data){
  let e = document.createElement('div');
  e.innerHTML = "<div class='message'><img class='profile-pic' src='../img/makersealonly.svg' id='me3'><img class='message-image'><span class='message-info'>Anon Powered by GIPHY</span></div>";
  e.getElementsByClassName("message-image")[0].src = data.data;
  e.getElementsByClassName("message-info")[0].textContent = data.user + " Powered by GIPHY";
  document.getElementById('messages').appendChild(e.firstChild);
  document.getElementById('messages').scrollTop = document.getElementById('messages').scrollHeight;
});
