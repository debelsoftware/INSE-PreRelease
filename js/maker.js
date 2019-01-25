document.getElementById('chat-button').addEventListener('click', toggleChat);
document.getElementById('chat-close').addEventListener('click', toggleChat);
document.getElementById('menu-icon').addEventListener('click', openMobileNav)

function toggleChat(){
  const chat = document.getElementById('chat');
  if (chat.style.display == "grid"){
    chat.style.display = 'none';
  }
  else{
    chat.style.display = 'grid';
  }
}

function openMobileNav(){
  const nav = document.getElementById('mobile-nav');
  nav.style.display = "block";
}

let developerKey = 'AIzaSyDLgVzfFEI-nJtVbH7hYH-xlZl3pfuTR6Y';
let clientId = "353118485015-qerafpisj7krrpuhsuivb7066j3q06d0.apps.googleusercontent.com"
let appId = "353118485015";
let scope = ['https://www.googleapis.com/auth/drive'];
let pickerApiLoaded = false;
let oauthToken;

function loadPicker() {
  gapi.load('auth', {'callback': onAuthApiLoad});
  gapi.load('picker', {'callback': onPickerApiLoad});
}

function onAuthApiLoad() {
  window.gapi.auth.authorize(
      {
        'client_id': clientId,
        'scope': scope,
        'immediate': false
      },
      handleAuthResult);
}

function onPickerApiLoad() {
  pickerApiLoaded = true;
  createPicker();
}

function handleAuthResult(authResult) {
  if (authResult && !authResult.error) {
    oauthToken = authResult.access_token;
    createPicker();
  }
}

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

function pickerCallback(data){
  if (data.action == google.picker.Action.PICKED) {
    let fileId = data.docs[0].id;
    alert('The user selected: ' + fileId);
  }
}
