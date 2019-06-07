// event listeners for clicks and when the page has finished loading
window.addEventListener("load", init);

const token = sessionStorage.getItem('token');
const teamID = localStorage.getItem("team");

function init(){
  getNotif();
}

/*-- getNotif --
	DESCRIPTION: checks if authorised and then gets the teams notifications
	PARAMS: nothing
	RETURNS: nothing
*/
function getNotif(){
  fetch(host+"notifications", {
    method: 'POST',
    body: JSON.stringify({
      "teamID": teamID,
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
      alert("Sorry, our servers encountered an issue. Please try again later");
    }
    else {
      return response.json();
    }
  }
  )
  .then(function(parsedJson) {
    populateNotif(parsedJson);
  })
  .catch(error => console.log(error));
}

/*-- populateNotif --
	DESCRIPTION: adds the notifications from the server to the notifications page
	PARAMS: notifs (JSON string of notifications)
	RETURNS: nothing
*/
function populateNotif(notifs){
  const newNotif = document.getElementById('new-notif');
  const oldNotif = document.getElementById('old-notif');
  if (notifs.length == 0) {
    newNotif.innerHTML = "<h2>Nothing here...</h2>"
  }
  else {
    newNotif.innerHTML = "";
    document.getElementById('maker-friend').style.display = "block";
    for (i=0; i<notifs.length; i++){
      if (i == 0){
        if (notifs[i].notificationName == "NEW USER REQUEST") {
          newNotif.innerHTML += '<div class="card"><h2>NEW USER REQUEST</h2><p id="notificatoin-text">'+JSON.parse(notifs[i].details).username+' would like to join your team</p><button id="accept-button" type="button" name="button" onclick="respondRequest(true,'+JSON.parse(notifs[i].details).userID+','+notifs[i].notificationID+')">Accept</button><button id="decline-button" type="button" name="button" onclick="respondRequest(false,'+JSON.parse(notifs[i].details).userID+','+notifs[i].notificationID+')">Decline</button></div>';
        }
      }
      else {
        if (notifs[i].notificationName == "NEW USER REQUEST") {
          oldNotif.innerHTML += '<div class="card"><h2>NEW USER REQUEST</h2><p id="notificatoin-text">'+JSON.parse(notifs[i].details).username+' would like to join your team</p><button id="accept-button" type="button" name="button" onclick="respondRequest(true,'+JSON.parse(notifs[i].details).userID+','+notifs[i].notificationID+')">Accept</button><button id="decline-button" type="button" name="button" onclick="respondRequest(false,'+JSON.parse(notifs[i].details).userID+','+notifs[i].notificationID+')">Decline</button></div>';
        }
      }
    }
  }
}

/*-- populateNotif --
	DESCRIPTION: Tells the server whether or not the user has accepted the request or not
	PARAMS: isAccepted(BOOLEAN), userID(id of user making request), notifID(id of notification to be deleted upon completion)
	RETURNS: nothing
*/
function respondRequest(isAccepted, userID, notifID){
  fetch(host+"respondrequest", {
    method: 'POST',
    body: JSON.stringify({
      "isAccepted": isAccepted,
      "notifID": notifID,
      "userID": userID,
      "teamID": teamID,
      "token": sessionStorage.getItem('token')
    }),
    headers:{
      'Content-Type': 'application/json'
    }
  }).then(function(response) {
    if (response.status == 401){ //DETECTS IF USER IS AUTHORISED
      alert("Sorry, only admins can make this choice") //IF UNAUTHORISED, USER CAN NOT ACCEPT OR DECLINE
    }
    else if (response.status == 400){
      alert("Sorry, our servers encountered an issue. Please try again later");
    }
    else {
      window.location.href = "../notification";
    }
  }
  )
  .catch(error => console.log(error));
}
