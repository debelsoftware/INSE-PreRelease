const url = new URL(window.location);

document.getElementById('create-button').addEventListener('click', createTeam);
document.getElementById('back-button').addEventListener('click', goBack);

/*-- createTeam --
	DESCRIPTION: sends a request to the server to create a team
	PARAMS: nothing
	RETURNS: nothing
*/
function createTeam(){
  let name = document.getElementById('name').value;
  let validationResults = validateTeamInputs(name);
  if (validationResults == "pass") {
    fetch(host+"createteam", {
      method: 'POST',
      body: JSON.stringify({
        "token": sessionStorage.getItem('token'),
        "name": name
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
        window.location.href = "../teamselect"
      }
    }
    )
    .catch(error => console.log(error));
  }
  else {
    alert(validationResults);
  }
}

/*-- validateTeamInputs --
	DESCRIPTION: Validates the inputs given by the user to create a team with
	PARAMS: teamID, name
	RETURNS: String (error message or pass)
*/
function validateTeamInputs(name){
  const regex = /^[a-zA-Z0-9\s]+$/g
  if (name.length == 0) {
    return "Please give your team a name";
  }
  else if (!name.match(regex)) {
    return "Name must not have special characters";
  }
  else if (name.length>20) {
    return "name must be less than 20 characters";
  }
  else {
    return "pass";
  }
}

function goBack(){
  window.location.href = "../teamselect";
}
