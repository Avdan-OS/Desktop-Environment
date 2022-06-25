var lockScreen = document.getElementById("lock-screen");
var backgroundScreen = document.getElementById("background-screen");

var LockDialog = {
  start() {
    lockScreen.addEventListener("click", Transition.showLogin);
  },
  hide() {
    lockScreen.classList.add('hide');
    backgroundScreen.classList.add('blur');
  },
  show() {
    lockScreen.classList.remove('hide');
    backgroundScreen.classList.remove('blur');

    // Close all menus
    Menus.closeAllMenus();
  }
}

LockDialog.start();