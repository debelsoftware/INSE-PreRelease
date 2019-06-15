let selectedUsers = []; //LIST OF USERS TO BE REMOVED FROM TEAM

window.addEventListener("load", init);
document.getElementById('remove-members').addEventListener("click", removeMembers);
document.getElementById('delete-team').addEventListener("click", deleteTeam);
document.getElementById('leave-team').addEventListener("click", leaveTeam);

const url = new URL(window.location);
const teamID = localStorage.getItem("team");

/*-- init --
	DESCRIPTION: runs startup functions.
  PARAMS: No perams needed.
	RETURNS: nothing.
*/
function init(){
  getMembers();
  makeInvite();
}

function makeInvite(){
  document.getElementById('invite-link').textContent = `https://teammaker.app/beta/invite?id=${teamID}`
  var qrcode = new QRCode("qrcode", {
    text: `https://teammaker.app/beta/invite?id=${teamID}`,
    width: 100,
    height: 100,
    colorDark : "#2f4054",
    colorLight : "#ffffff",
    correctLevel : QRCode.CorrectLevel.H
  });
}

/*-- Get Members --
	DESCRIPTION: get the members from the server that a group has
  PARAMS: No perams needed.
	RETURNS: json file from server is passed into populateMembers function
*/
function getMembers(){
  fetch(host+"members", {
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
    populateMembers(parsedJson);
  })
  .catch(error => console.log(error));
}

/*-- Populate memebers --
	DESCRIPTION: This presents the user with memeber that are verified,
	PARAMS: members (json format)
	RETURNS: nothing
*/
function populateMembers(members){
  const membersBox = document.getElementById('members');
  for (member of members){
    const user = document.createElement('li');
    const profilePic = document.createElement('img');
    profilePic.src = "../img/makersealonly.svg";
    profilePic.classList.add('profile-pic');
    profilePic.id = "me3";
    user.textContent = member.name;
    user.prepend(profilePic);
    user.addEventListener('click', function(){selectUser(member.userID)})
    membersBox.appendChild(user)
  }
}

/*-- selectUser --
	DESCRIPTION: pushes selected users to an array to be removed from the team
	PARAMS: userID
	RETURNS: nothing
*/
function selectUser(userID){
  event.target.classList.toggle("active");
  let userIndex = selectedUsers.indexOf(userID);
  if (userIndex == -1) {
    selectedUsers.push(userID);
  }
  else {
    selectedUsers.splice(userIndex,1);
  }
}

/*-- Remove Members --
	DESCRIPTION: removes the members that the user has selected from the group
  PARAMS: No perams needed.
	RETURNS: json file from server is passed into populateMembers function
*/
function removeMembers(){
  if (selectedUsers.length > 0) {
    fetch(host+"removemembers", {
      method: 'POST',
      body: JSON.stringify({
        "teamID": teamID,
        "token": sessionStorage.getItem('token'),
        "members": selectedUsers
      }),
      headers:{
        'Content-Type': 'application/json'
      }
    }).then(function(response) {
      if (response.status == 401){ //DETECTS IF USER IS AUTHORISED
        alert("Nice try. This is an admin only feature"); //IF UNAUTHORISED, USER IS INFORMED
      }
      else if (response.status == 400){
        alert("Sorry, our servers encountered an issue. Please try again later");
      }
      else if (response.status == 403){
        alert("As an admin you cant remove yourself");
      }
      else {
        window.location.href = "../settings";
      }
    }
    )
    .catch(error => console.log(error));
  }
}

/*-- Remove Members --
	DESCRIPTION: removes the members that the user has selected from the group
  PARAMS: No perams needed.
	RETURNS: json file from server is passed into populateMembers function
*/
function deleteTeam(){
  if (document.getElementById('team-confirm').value.toLowerCase() == "delete") {
    fetch(host+"deleteteam", {
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
        alert("Nice try. This is an admin only feature"); //IF UNAUTHORISED, USER IS INFORMED
      }
      else if (response.status == 400){
        alert("Sorry, our servers encountered an issue. Please try again later");
      }
      else {
        window.location.href = "../teamselect";
      }
    }
    )
    .catch(error => console.log(error));
  }
  else {
    alert("Please type 'delete' into the confirm box first");
  }
}

/*-- Leave Team --
	DESCRIPTION: removes the members that the user has selected from the group
  PARAMS: No perams needed.
	RETURNS: json file from server is passed into populateMembers function
*/
function leaveTeam(){
  fetch(host+"leaveteam", {
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
    else if (response.status == 403){
      alert("As an admin you cant remove yourself");
    }
    else {
      window.location.href = "../teamselect";
    }
  }
  )
  .catch(error => console.log(error));
}
