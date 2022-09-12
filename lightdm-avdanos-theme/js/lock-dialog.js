var lockScreen = document.getElementById("lock-screen");
var backgroundScreen = document.getElementById("background-screen");
var blankScreen = document.getElementById("blank-screen");

var LockDialog = {
  start() {
    lockScreen.addEventListener("click", Transition.showLogin);
    blankScreen.addEventListener("click", this._unBlank);
    blankScreen.addEventListener("mousemove", this._unBlank);
  },
  _unBlank() {
    if (Power.inBlank) {
      Transition.fadeIn();
      Transition.hideLogin();

      Power.inBlank = false;

      blankScreen.removeEventListener('mousemove', this._unBlank);
    }
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