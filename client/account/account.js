window.addEventListener("load", addUserDetails);

function addUserDetails(){
  document.getElementById('name').textContent = sessionStorage.getItem('name');
  document.getElementById('email').textContent = sessionStorage.getItem('email');
}
