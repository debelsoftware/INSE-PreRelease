document.getElementById('register-button').addEventListener('click', register);
document.getElementById('back-button').addEventListener('click', back);
const url = new URL(window.location);

/*-- register --
	DESCRIPTION: sends a post request to the server to register them
	PARAMS: nothing
	RETURNS: nothing
*/
function register(){
  if (document.getElementById('privacy-agree').checked == true) {
    fetch(host+"register", {
      method: 'POST',
      body: JSON.stringify({
        "token": sessionStorage.getItem('token')
      }),
      headers:{
        'Content-Type': 'application/json'
      }
    }).then(function(response) {
      if (response.status == 400){
        alert("We encountered an error while attempting to register you. Please try again later");
      }
      else {
        if (url.searchParams.get("invite") != null){
          window.location.href = `../teamselect?invite=${url.searchParams.get("invite")}`;
        }
        else {
          window.location.href = "../teamselect";
        }
      }
    }
    )
    .catch(error => console.log(error));
  }
  else {
    alert("You must agree to our privacy policy to register");
  }

}

function back(){
  window.location.href = "../../"
}
