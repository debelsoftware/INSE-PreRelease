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
  window.location.href = "../teamselect"
};
