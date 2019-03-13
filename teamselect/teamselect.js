window.addEventListener("load", init);
document.getElementById("username").addEventListener("click", signOut);

const token = sessionStorage.getItem('token');
const host = "http://localhost/";

function init(){
  gapi.load('auth2', function() {
    gapi.auth2.init();
  });
  document.getElementById('username').textContent = sessionStorage.getItem('name');
  getTeams();
}

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

function errorCatch(err){
  console.error("Here's where we went wrong (Sorry): ", err);
  let teamsbox = document.getElementById('teams');
  teamsbox.innerHTML = "<p>Oops... 😞 Our server didn't like what it was given. Please try signing in again, if that doesn't fix it contact us at seal@teammaker.app</p>"
}

function populateTeams(teams){
  let teamsbox = document.getElementById('teams');
  teamsbox.innerHTML = "";
  if (teams.length == 0){
    teamsbox.innerHTML = "<p>Nothing here... Join a group below</p>"
  }
  else {
    for (team of teams){
      if (team.isAdmin == 1){
        teamsbox.innerHTML += "<div class='team admin' onclick='goToTeam(`"+team.teamID+"`)'>"+team.name+"<p id='teamID'>"+team.teamID+"</p></div>";
      }
      else if (team.verified == 1){
        teamsbox.innerHTML += "<div class='team' onclick='goToTeam(`"+team.teamID+"`)'>"+team.name+"<p id='teamID'>"+team.teamID+"</p></div>";
      }
      else {
        teamsbox.innerHTML += "<div class='team unverified' onclick='goToTeam(null)'>"+team.name+"<p id='teamID'>PENDING VERIFICATION</p></div>";
      }
    }
  }
}

function goToTeam(teamID){
  if (teamID == null){
    showError("You are not a member of this team yet, please wait to be verified","I understand");
  }
  else {
    window.location.href = "../app?teamid="+teamID;
  }
}

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

function showError(msg,button){
  document.getElementById("error-box").style.display = "block";
  document.getElementById("error-msg").textContent = msg;
  document.getElementById("error-btn").textContent = button;
}

function closeError(){
  document.getElementById("error-box").style.display = "none";
}
