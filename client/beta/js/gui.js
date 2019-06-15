window.addEventListener("load", renderMenu);

function renderMenu(){
  document.getElementById('menu-render').innerHTML += '<nav class="desktop-nav"><div class="navigation"><img id="menu-icon" src="../img/menu.svg" alt=""><a id="logolink" href="../app"><img src="../img/makertextonly.svg" class="nav-logo" alt="Team Maker Logo"></a><a id="create-task" href="../createtask">Create a task</a></div><div class="user-options"><a href="../notification"><img src="../img/notif.svg" alt=""></a><a href="../settings"><img src="../img/settings.svg" alt=""></a><a href="../account"><img src="../img/account.svg" alt=""></a></div></nav><nav id="mobile-nav" class="mobile-nav"><button type="button" id="close-menu" class="mobile-nav-exit" name="button">Close</button><a href="../createtask">Create a Task</a><a href="../notification">Notifications</a><a href="../account">My Account</a><a href="../settings">Settings</a></nav>'
  document.getElementById('menu-icon').addEventListener('click', openMobileNav)
  document.getElementById('close-menu').addEventListener('click', closeMobileNav)
}

function openMobileNav(){
  const nav = document.getElementById('mobile-nav');
  nav.style.display = "block";
}

function closeMobileNav(){
  const nav = document.getElementById('mobile-nav');
  nav.style.display = "none";
}
