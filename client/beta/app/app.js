window.addEventListener("load", init);
const url = new URL(window.location);
const teamID = localStorage.getItem("team");


/*-- init --
	DESCRIPTION: Presents the user with greeting based on time of day and runs startup functions.
  PARAMS: No perams needed.
	RETURNS: nothing.
*/
function init(){
  let today = new Date()
  let hour = today.getHours()
  if (hour < 12) {
    document.getElementById('greeting').innerHTML ='Good morning <span id="username"></span>';
  } else if (hour < 18) {
    document.getElementById('greeting').innerHTML = 'Good afternoon <span id="username"></span>';
  } else {
    document.getElementById('greeting').innerHTML = 'Good evening <span id="username"></span>';
  }
  document.getElementById('username').textContent = sessionStorage.getItem('fname');
  getTasks();
  getMembers();
}

/*-- Get Tasks --
	DESCRIPTION: get the tasks from the server that a group has
  PARAMS: No perams needed.
	RETURNS: json file from server is passed into populateTasks function
*/
async function getTasks(){
  fetch(host+"tasks", {
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
    populateTasks(parsedJson);
  })
  .catch(error => console.log(error));
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
    membersBox.appendChild(user)
  }
}

/*-- Populate Tasks --
	DESCRIPTION: This presents the user with tasks that have been set,
	PARAMS: tasks (json format)
	RETURNS: nothing
*/
function populateTasks(tasks){
  const wall = document.getElementById('work-wall');
  wall.innerHTML = "";
  if (tasks.length == 0){
    wall.innerHTML = "<h3>No work for you today 🎉<h3><img id='coffee' src='../img/coffee.gif'>"
  }
  else {
    wall.classList.remove("empty");
    wall.classList.add("work-wall");
    for (task of tasks){
      wall.appendChild(createTask(task))
    }
  }
}

function createTask(task){
  let time = (new Date).getTime();
  const container = document.createElement("a");
  const title = document.createElement("h1");
  const date = document.createElement("p");
  const progress = document.createElement("progress");
  container.classList.add("deadline-card");
  container.href = `../task?id=${task.taskID}`;
  title.textContent = task.name;
  date.textContent = `Due: ${epochToDate(task.dateDue)}`;
  date.classList.add("due-date");
  progress.value = ((task.dateDue-task.dateSet)/time)*10000
  container.appendChild(title)
  container.appendChild(date)
  container.appendChild(progress)
  return container
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
