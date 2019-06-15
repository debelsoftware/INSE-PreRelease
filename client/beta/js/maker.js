const host = "https://makerapi.host/"; //SET TO LOCALHOST WHEN TESTING
window.addEventListener('load', function(){
  document.head.innerHTML += `<link rel="stylesheet" href="../css/animate.css">
  <style>
  #toast{
    position: fixed;
    bottom: 5px;
    left: 5px;
    font-family: 'Roboto', sans-serif;
    font-size: 10px;
    color: white;
    background-color: rgba(0, 0, 0, 0.5);
    padding: 10px;
    animation-name: flash;
    animation-duration: 3s;
    animation-fill-mode: both;
    animation-timing-function: linear;
    animation-iteration-count: infinite;
  }
  @keyframes flash{
    0%{
      background-color: rgba(0, 0, 0, 0.2);
    }
    50%{
      background-color: rgba(0, 0, 0, 0.9);
    }
    100%{
      background-color: rgba(0, 0, 0, 0.2);
    }
  }
  </style>
  `
  const toast = document.createElement('div');
  toast.textContent = "NOT FOR CONSUMER USE"
  toast.id='toast';
  document.body.appendChild(toast);

})
