// INITIATING API KEYS AND SCOPE VARIABLES
let developerKey = 'AIzaSyDLgVzfFEI-nJtVbH7hYH-xlZl3pfuTR6Y';
let clientId = "353118485015-qerafpisj7krrpuhsuivb7066j3q06d0.apps.googleusercontent.com"
let appId = "353118485015";
let scope = ['https://www.googleapis.com/auth/drive'];
let pickerApiLoaded = false;
let oauthToken;
let selectedUsers = []; //LIST OF USERS TO BE ADDED TO A TASK
let selectedFiles = []; //LIST OF FILES TO BE ADDED TO A TASK

window.addEventListener("load", init);
document.getElementById('create-task-button').addEventListener('click', createTask);
document.getElementById('cancel').addEventListener('click', back);

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

/*-- Load picker --
	DESCRIPTION: Loads up the Google Drive picker
	PARAMS: nothing
	RETURNS: nothing
*/
function loadPicker() {
  gapi.load('auth', {'callback': onAuthApiLoad});
  gapi.load('picker', {'callback': onPickerApiLoad});
}

/*-- onAuthApiLoad --
	DESCRIPTION: Adds settings such as the scope to the API
	PARAMS: nothing
	RETURNS: nothing
*/
function onAuthApiLoad() {
  window.gapi.auth.authorize(
      {
        'client_id': clientId,
        'scope': scope,
        'immediate': false
      },
      handleAuthResult);
}

/*-- onPickerApiLoad --
	DESCRIPTION: sets global varibale to true and starts createPicker()
	PARAMS: nothing
	RETURNS: nothing
*/
function onPickerApiLoad() {
  pickerApiLoaded = true;
  createPicker();
}

/*-- handleAuthResult --
	DESCRIPTION: Checks that there is no error in authentication
	PARAMS: authResult (holds the status of the auth request)
	RETURNS: nothing
*/
function handleAuthResult(authResult) {
  if (authResult && !authResult.error) {
    oauthToken = authResult.access_token;
    createPicker();
  }
}

/*-- createPicker --
	DESCRIPTION: sets up and renders the Google Drive Picker
	PARAMS: nothing
	RETURNS: nothing
*/
function createPicker() {
  if (pickerApiLoaded && oauthToken) {
    let view = new google.picker.View(google.picker.ViewId.DOCS);
    view.setMimeTypes("");
    let picker = new google.picker.PickerBuilder()
        .enableFeature(google.picker.Feature.NAV_HIDDEN)
        .enableFeature(google.picker.Feature.MULTISELECT_ENABLED)
        .setAppId(appId)
        .setOAuthToken(oauthToken)
        .addView(view)
        .addView(new google.picker.DocsUploadView())
        .setDeveloperKey(developerKey)
        .setCallback(pickerCallback)
        .build();
     picker.setVisible(true);
  }
}

/*-- pickerCallback --
	DESCRIPTION: Handles the files that the user has selected
	PARAMS: data (info about selected files)
	RETURNS: nothing
*/
function pickerCallback(data){
  if (data.action == google.picker.Action.PICKED) {
    let files = data.docs;
    attachToTask(files);
    //window.open('https://drive.google.com/file/d/'+fileId, '_blank');
  }
}

/*-- attachToTask --
	DESCRIPTION: Appends the files to the files part of the task view
	PARAMS: files (array of files seleted by the user)
	RETURNS: nothing
*/
function attachToTask(files){
  const attachment = document.getElementById('files');
  for (file of files) {
    attachment.innerHTML += '<a href="'+file.url+'" target="_blank"><div class="file"><img src="../img/file.svg" alt=""><p>'+file.name+'</p></div></a>'
    selectedFiles.push([file.name,file.url]);
  }
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
    membersBox.innerHTML += '<li onclick="selectUser(`'+member.userID+'`)"><img class="profile-pic" src="../img/makersealonly.svg" id="me3" alt="">'+member.name+'</li>'
  }
}

/*-- selectUser --
	DESCRIPTION: pushes selected users to an array to be part of the created task
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

/*-- createTask --
	DESCRIPTION: Send the user data to the server to be made into a task on the DB
	PARAMS: nothing
	RETURNS: nothing
*/
function createTask(){
  const name = document.getElementById('task-name').value;
  const details = document.getElementById('task-details').value;
  let date = document.getElementById('duedate').value;
  date=date.split("-");
  let finalDate = date[1]+"/"+date[2]+"/"+date[0];
  let timestamp = new Date(finalDate).getTime();
  let validationResults = validateInputs(name,details,date);
  if (validationResults == "pass") {
    document.getElementById('create-task-button').disabled = true;
    fetch(host+"createtask", {
      method: 'POST',
      body: JSON.stringify({
        "teamID": teamID,
        "token": sessionStorage.getItem('token'),
        "name": name,
        "details": details,
        "dateDue": timestamp,
        "dateSet": new Date().getTime(),
        "files": selectedFiles,
        "users": selectedUsers
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
        document.getElementById('create-task-button').disabled = false;
      }
      else {
        window.location.href = "../app"
      }
    }
    )
    .catch(error => console.log(error));
  }
  else {
    alert(validationResults)
  }
}

/*-- validateInputs --
	DESCRIPTION: Validates the inputs given by the user to create a task with
	PARAMS: name,details,date
	RETURNS: String (error message or pass)
*/
function validateInputs(name,details,date){
  let finalDate = date[1]+"/"+date[2]+"/"+date[0];
  let timestamp = new Date(finalDate).getTime();
  if (name.length > 0 && name.length <= 20){
    if (details.length <= 1000) {
      if (date != "") {
        if (timestamp > new Date().getTime()) {
          if (selectedUsers.length>0) {
            return "pass"
          }
          else {
            return "You must select at least one user"
          }
        }
        else {
          return "Due date must be in the future"
        }
      }
      else {
        return "You must set a due date"
      }
    }
    else {
      return "Task details must be less than 1000 characters"
    }
  }
  else{
    return "Task name must be greater than 0 and less than 20 characters"
  }
}

function back(){
  window.location.href = "../app"
}
