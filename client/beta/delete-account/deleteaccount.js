// event listeners for clicks and when the page has finished loading
window.addEventListener("load", init);
document.getElementById("username").addEventListener("click", signOut);
document.getElementById('delete-account').addEventListener("click", deleteAccount);
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
      window.location.href = "../login";
  }
}

/*-- errorCatch --
	DESCRIPTION: shows an error message on the page if the server fails to get the data
	PARAMS: err (details about the error)
	RETURNS: nothing
*/
function errorCatch(err){
  console.error("Here's where we went wrong (Sorry): ", err);
  showError("Oops... 😞 Our server didn't like what it was given. For security reasons your session may have timed out. Please try signing in again, if that doesn't fix it contact us at seal@teammaker.app","okay")
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

/*-- Delete Account --
	DESCRIPTION: removes the members that the user has selected from the group
  PARAMS: No perams needed.
	RETURNS: json file from server is passed into populateMembers function
*/
function deleteAccount(){
  if (document.getElementById('account-confirm').value.toLowerCase() == "delete") {
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
        window.location.href = "../login" //IF UNAUTHORISED, USER RETURNED TO TEAM SELECT PAGE
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
