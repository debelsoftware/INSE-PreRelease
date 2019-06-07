const url = new URL(window.location);
/*-- onSignIn --
	DESCRIPTION: gets the user details after they have signed into google
	PARAMS: googleUser
	RETURNS: nothing
*/
function onSignIn(googleUser) {
  let profile = googleUser.getBasicProfile();
  //profile.getId());
  //profile.getName());
  //profile.getGivenName());
  //profile.getFamilyName());
  //profile.getImageUrl());
  let id_token = googleUser.getAuthResponse().id_token;
  console.log(id_token);
  sessionStorage.setItem('token', id_token);
  sessionStorage.setItem('name', profile.getName());
  sessionStorage.setItem('fname', profile.getGivenName());
  sessionStorage.setItem('lname', profile.getFamilyName());
  sessionStorage.setItem('email', profile.getEmail());
  if (url.searchParams.get("invite") != null) {
    window.location.href = `../teamselect?invite=${url.searchParams.get("invite")}`
  }
  else {
    window.location.href = "../teamselect"
  }
};
