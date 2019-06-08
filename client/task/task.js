window.addEventListener("load", init);
const url = new URL(window.location);
const teamID = localStorage.getItem("team");
const taskID = url.searchParams.get("id");

document.getElementById("delete").addEventListener("click", deleteTask)

/*-- init --
	DESCRIPTION: runs startup functions.
  PARAMS: No perams needed.
	RETURNS: nothing.
*/
function init(){
  getTaskMembers();
  getTaskDetails();
  getTaskFiles();
  checkIfAdmin();
}

function checkIfAdmin(){
  fetch(host+"isadmin", {
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
    showDelete(parsedJson)
  })
  .catch(error => console.log(error));
}

/*-- Get Members --
	DESCRIPTION: get the members from the server that a group has
  PARAMS: No perams needed.
	RETURNS: json file from server is passed into populateMembers function
*/
function getTaskMembers(){
  fetch(host+"taskmembers", {
    method: 'POST',
    body: JSON.stringify({
      "teamID": teamID,
      "taskID": taskID,
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
    showDelete(parsedJson)
  })
  .catch(error => console.log(error));
}

/*-- Get Task Details --
	DESCRIPTION: get the task details from the server
  PARAMS: No perams needed.
	RETURNS: json file from server is passed into populateTaskDetails function
*/
function getTaskDetails(){
  fetch(host+"taskdetails", {
    method: 'POST',
    body: JSON.stringify({
      "teamID": teamID,
      "taskID": taskID,
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
    }
    else {
      return response.json();
    }
  }
  )
  .then(function(parsedJson) {
    populateTaskDetails(parsedJson);
  })
  .catch(error => console.log(error));
}

/*-- Get Task Files --
	DESCRIPTION: get the files from the server that a task has
  PARAMS: No perams needed.
	RETURNS: json file from server is passed into populateTaskDetails function
*/
function getTaskFiles(){
  fetch(host+"taskfiles", {
    method: 'POST',
    body: JSON.stringify({
      "teamID": teamID,
      "taskID": taskID,
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
    }
    else {
      return response.json();
    }
  }
  )
  .then(function(parsedJson) {
    populateTaskFiles(parsedJson);
  })
  .catch(error => console.log(error));
}

function deleteTask(){
  document.getElementById("delete").disabled = true;
  fetch(host+"deleteTask", {
    method: 'POST',
    body: JSON.stringify({
      "token": sessionStorage.getItem('token'),
      "taskID": taskID
    }),
    headers:{
      'Content-Type': 'application/json'
    }
  }).then(function(response) {
    if (response.status == 401){ //DETECTS IF USER IS AUTHORISED
      window.location.href = "../login" //IF UNAUTHORISED, USER RETURNED TO TEAM SELECT PAGE
    }
    else if (response.status == 400){
    }
    else {
      window.location.href = "../app"
    }
  })
  .catch(error => console.log(error));
}

/*-- PopulateTaskDetails --
	DESCRIPTION: This presents the user with the task details from the server,
	PARAMS: task (json format)
	RETURNS: nothing
*/
function populateTaskDetails(task){
  let time = (new Date).getTime();
  document.getElementById('task-name').textContent = task[0].name;
  document.getElementById('task-details').textContent = task[0].details;
  document.getElementById('task-due').textContent = epochToDate(task[0].dateDue);
  document.getElementById('task-created').textContent = epochToDate(task[0].dateSet);
  document.getElementById('task-progress').value = ((task[0].dateDue-task[0].dateSet)/time)*10000
}

/*-- populateTaskFiles --
	DESCRIPTION: This presents the user with the files for a task,
	PARAMS: files (json format)
	RETURNS: nothing
*/
function populateTaskFiles(files){
  const attachment = document.getElementById('task-files');
  for (file of files) {
    attachment.innerHTML += '<a href="'+file.url+'" target="_blank"><div class="file"><img src="../img/file.svg" alt=""><p>'+file.name+'</p></div></a>'
  }
}

/*-- Populate members --
	DESCRIPTION: This presents the user with members that are verified,
	PARAMS: members (json format)
	RETURNS: nothing
*/
function populateMembers(members){
  const membersBox = document.getElementById('members');
  for (member of members.users){
    membersBox.innerHTML += '<li><img class="profile-pic" src="../img/makersealonly.svg" id="me3" alt="">'+member.name+'</li>'
  }
}

function showDelete(data){
  if (data.containsSelf || data.isAdmin){
    document.getElementById("delete").style.display = "inline-block";
  }
}

/*-- epoch to date --
	DESCRIPTION: converts an epoch date value to a readable date
	PARAMS: epoch (unix timecode)
	RETURNS: readable date
*/
function epochToDate(epoch){
  let dateVal ="/Date("+epoch+")/";
  let date = new Date( parseFloat( dateVal.substr(6 )));
  return(
      date.getDate() + "/" +
      (date.getMonth() + 1) + "/" +
      date.getFullYear() + " "
  );
}
