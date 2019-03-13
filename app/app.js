window.addEventListener("load", init);

const host = "http://localhost/";
const url = new URL(window.location);
const teamID = url.searchParams.get("teamid");

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
}

function getTasks(){
  fetch(host+"tasks", {
    method: 'POST',
    body: JSON.stringify({
      "teamID": teamID
    }),
    headers:{
      'Content-Type': 'application/json'
    }
  }).then(res => res.json())
  .then(response => populateTasks(response))
  .catch(error => console.log(error));
}

function populateTasks(tasks){
  const wall = document.getElementById('work-wall');
  wall.innerHTML = "";
  if (tasks.length == 0){
    wall.classList.remove("work-wall");
    wall.classList.add("empty");
    wall.innerHTML = "<h3>No tasks found. Create one above<h3>"
  }
  else {
    for (task of tasks){
      wall.innerHTML += "<a class='deadline-card' href='../task'><h1>"+task.name+"</h1><p class='due-date'>Due: Data not given</p><progress value='30' max='100'></progress></a>"
    }
  }
}
