document.getElementById('menu-icon').addEventListener('click', openMobileNav)
document.getElementById('close-menu').addEventListener('click', closeMobileNav)

function openMobileNav(){
  const nav = document.getElementById('mobile-nav');
  nav.style.display = "block";
}

function closeMobileNav(){
  const nav = document.getElementById('mobile-nav');
  nav.style.display = "none";
}
