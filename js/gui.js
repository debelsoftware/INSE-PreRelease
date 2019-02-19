window.addEventListener("load", renderMenu);

function renderMenu(){
  console.log("fin");
  document.getElementById('menu-render').innerHTML += '<nav class="desktop-nav"><div class="navigation"><img id="menu-icon" src="../img/menu.svg" alt=""><img src="../img/makertextonly.svg" class="nav-logo" alt="Team Maker Logo"><a href="../useful">Useful Apps</a><a href="#">Timetable</a><a id="create-task" onclick="loadPicker()" href="#">Create a task</a></div><div class="user-options"><img src="../img/notif.svg" alt=""><img src="../img/settings.svg" alt=""><img src="../img/account.svg" alt=""></div></nav><nav id="mobile-nav" class="mobile-nav"><button type="button" id="close-menu" class="mobile-nav-exit" name="button">Close</button><a href="#">Create a Task</a><a href="#">Members</a><a href="#">Timetable</a></nav>'
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
