window.addEventListener("load", getTeams);

const url = new URL(window.location);
const token = url.searchParams.get("token");
const host = "http://localhost/";

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
  .catch(error => console.error('Error:', error));
}

function populateTeams(teams){
  let teamsbox = document.getElementById('teams');
  teamsbox.innerHTML = "";
  for (team of teams){
    if (team.verified == 1){
      teamsbox.innerHTML += "<div class='team'>"+team.Name+"<p id='teamID'>"+team.teamID+"</p></div>";
    }
    else {
      teamsbox.innerHTML += "<div class='team unverified'>"+team.Name+"<p id='teamID'>PENDING VERIFICATION</p></div>";
    }
  }
}
