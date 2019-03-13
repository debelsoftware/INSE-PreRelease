window.addEventListener("load", init);

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
}
