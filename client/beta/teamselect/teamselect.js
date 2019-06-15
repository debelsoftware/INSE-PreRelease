// event listeners for clicks and when the page has finished loading
window.addEventListener("load", init);
document.getElementById("username").addEventListener("click", signOut);
document.getElementById("join-button").addEventListener("click", joinTeam);
const url = new URL(window.location);

const token = sessionStorage.getItem('token');

/*-- init --
	DESCRIPTION: starts the google login api to handle sign out and starts the getTeams function
	PARAMS: nothing
	RETURNS: nothing
*/
function init(){
  gapi.load('auth2', function() {
    gapi.auth2.init();
  });
  document.getElementById('username').textContent = sessionStorage.getItem('name'); //gets the users name from local storage
  getRegistered();
}

/*-- getRegistered --
	DESCRIPTION: fetches the isRegistered value from the server
	PARAMS: nothing
	RETURNS: nothing
*/
function getRegistered(){
  fetch(host+"registered", {
    method: 'POST',
    body: JSON.stringify({
      "token": token
    }),
    headers:{
      'Content-Type': 'application/json'
    }
  }).then(res => res.json())
  .then(response => checkRegistered(response))
  .catch(error => errorCatch(error));
}

/*-- checkRegistered --
	DESCRIPTION: redirects the user to the register page if not registered
	PARAMS: data (isRegistered value from server, fetched by getRegistered)
	RETURNS: nothing
*/
function checkRegistered(data){
  if (data.isRegistered == false){
    if (url.searchParams.get("invite") != null){
      window.location.href = `../register?invite=${url.searchParams.get("invite")}`;
    }
    else {
      window.location.href = "../register";
    }
  }
  else {
    handleInvites();
  }
}

function handleInvites(){
  if (url.searchParams.get("invite") != null){
    document.getElementById('join-id').value = url.searchParams.get("invite");
    joinTeam();
  }
  else {
    getTeams();
  }
}

/*-- getTeams --
	DESCRIPTION: Gets the teams that they are linked with from the server
	PARAMS: nothing
	RETURNS: json file from server is passed into populateTeams
*/
function getTeams(){
  fetch(host+"userteams", {
    method: 'POST',
    body: JSON.stringify({
      "token": token
    }),
    headers:{
      'Content-Type': 'application/json'
    }
  }).then(res => res.json())
  .then(response => populateTeams(response))
  .catch(error => errorCatch(error));
}

/*-- errorCatch --
	DESCRIPTION: shows an error message on the page if the server fails to get the data
	PARAMS: err (details about the error)
	RETURNS: nothing
*/
function errorCatch(err){
  console.error("Here's where we went wrong (Sorry): ", err);
  let teamsbox = document.getElementById('teams');
  teamsbox.innerHTML = "<p>Oops... 😞 Our server didn't like what it was given. For security reasons your session may have timed out. Please try signing in again, if that doesn't fix it contact us at seal@teammaker.app</p>"
}

/*-- Populate Teams --
	DESCRIPTION: This presents the user with teams that have been set,
	PARAMS: teams (json format)
	RETURNS: nothing
*/
function populateTeams(teams){
  document.getElementById('join-id').disabled = false;
  document.getElementById('join-button').disabled = false;
  document.getElementById('join-button').classList.remove('disabled')
  document.getElementById('join-id').classList.remove('disabled')
  let teamsbox = document.getElementById('teams');
  teamsbox.innerHTML = "";
  if (teams.length == 0){
    teamsbox.innerHTML = "<p>Nothing here... Join a group below</p>"
  }
  else {
    for (team of teams){
      teamsbox.appendChild(createTeamMenuItem(team));
    }
  }
}

function createTeamMenuItem(team){
  const teamContainer = document.createElement('div');
  const idP = document.createElement('p');
  idP.id = "teamID"
  idP.textContent = team.teamID;
  teamContainer.textContent = team.name;
  teamContainer.addEventListener('click', function(){goToTeam(team.teamID)});
  teamContainer.appendChild(idP);
  if (team.isAdmin == 1){
    teamContainer.classList.add('team');
    teamContainer.classList.add('admin');
  }
  else if (team.verified == 1){
    teamContainer.classList.add('team');
  }
  else {
    teamContainer.classList.add('team');
    teamContainer.classList.add('unverified');
  }
  return teamContainer
}

/*-- goToTeam --
	DESCRIPTION: Goes to the team page that the user has selected if the user is verified to use that team
	PARAMS: teams (json format)
	RETURNS: nothing
*/
function goToTeam(teamID){
  if (teamID == null){
    showError("You are not a member of this team yet, please wait to be verified","I understand");
  }
  else {
    localStorage.setItem("team",teamID);
    window.location.href = "../app";
  }
}

/*-- goToTeam --
	DESCRIPTION: sends a request to register the user to a team as unverified
	PARAMS: nothing
	RETURNS: nothing
*/
function joinTeam(){
  fetch(host+"join", {
    method: 'POST',
    body: JSON.stringify({
      "token": sessionStorage.getItem('token'),
      "teamID": document.getElementById('join-id').value
    }),
    headers:{
      'Content-Type': 'application/json'
    }
  }).then(function(response) {
    if (response.status == 400){
      if (url.searchParams.get("invite") != null){
        window.location.href = "../teamselect";
      }
      else {
        showError("Sorry, that didn't work. Make sure you've entered the ID of an active group and try again","okay, will do");
      }
    }
    else {
      window.location.href = "../teamselect";
    }
  }
  )
  .catch(error => console.log(error));
}

/*-- signOut --
	DESCRIPTION: signs the user out of their google account and clears the data from the session storage
	PARAMS:  nothing
	RETURNS: nothing
*/
function signOut(){
  let auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function () {
    console.log('User signed out.');
    sessionStorage.setItem("token","null");
    sessionStorage.setItem("fname","Not Signed In");
    sessionStorage.setItem("lname","Not Signed In");
    sessionStorage.setItem("name","Click here to sign in");
    document.location.href = "../login";
  });
}

/*-- show error --
	DESCRIPTION: renders the error with a specific message and button
	PARAMS: msg(message to display) button(text to show in button)
	RETURNS: nothing
*/
function showError(msg,button){
  document.getElementById("error-box").style.display = "block";
  document.getElementById("error-msg").textContent = msg;
  document.getElementById("error-btn").textContent = button;
}

/*-- close error --
	DESCRIPTION: closes the error message when the user clicks the errors button
	PARAMS: nothing
	RETURNS: nothing
*/
function closeError(){
  document.getElementById("error-box").style.display = "none";
}
