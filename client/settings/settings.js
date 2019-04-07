let selectedUsers = []; //LIST OF USERS TO BE REMOVED FROM TEAM

window.addEventListener("load", init);
document.getElementById('remove-members').addEventListener("click", removeMembers);
document.getElementById('delete-team').addEventListener("click", deleteTeam);
document.getElementById('leave-team').addEventListener("click", leaveTeam);
document.getElementById('delete-account').addEventListener("click", deleteAccount);

const url = new URL(window.location);
const teamID = localStorage.getItem("team");

/*-- init --
	DESCRIPTION: runs startup functions.
  PARAMS: No perams needed.
	RETURNS: nothing.
*/
function init(){
  getMembers();
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
      window.location.href = "../teamselect" //IF UNAUTHORISED, USER RETURNED TO TEAM SELECT PAGE
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
    membersBox.innerHTML += '<li onclick="selectUser(`'+member.userID+'`)"><img class="profile-pic" src="../img/makersealonly.svg" id="me3" alt="">'+member.name+'</li>'
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
  if (document.getElementById('team-confirm').value == "delete") {
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
      window.location.href = "../teamselect" //IF UNAUTHORISED, USER RETURNED TO TEAM SELECT PAGE
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

/*-- Delete Account --
	DESCRIPTION: removes the members that the user has selected from the group
  PARAMS: No perams needed.
	RETURNS: json file from server is passed into populateMembers function
*/
function deleteAccount(){
  if (document.getElementById('account-confirm').value == "delete") {
    fetch(host+"deleteaccount", {
      method: 'POST',
      body: JSON.stringify({
        "token": sessionStorage.getItem('token')
      }),
      headers:{
        'Content-Type': 'application/json'
      }
    }).then(function(response) {
      if (response.status == 401){ //DETECTS IF USER IS AUTHORISED
        window.location.href = "../teamselect" //IF UNAUTHORISED, USER RETURNED TO TEAM SELECT PAGE
      }
      else if (response.status == 400){
        alert("Sorry, our servers encountered an issue. Please try again later");
      }
      else {
        window.location.href = "../login";
      }
    }
    )
    .catch(error => console.log(error));
  }
  else {
    alert("Please type 'delete' into the confirm box first");
  }
}
