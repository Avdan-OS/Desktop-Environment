var Transition = {
  fadeIn() {
    let blankScreen = document.getElementById("blank-screen");
    let backgroundScreen = document.getElementById("background-screen");
    blankScreen.classList.add('hide');
    backgroundScreen.classList.remove('blur');
  },
  fadeOut() {
    let blankScreen = document.getElementById("blank-screen");
    let backgroundScreen = document.getElementById("background-screen");
    blankScreen.classList.remove('hide');
    backgroundScreen.classList.add('blur');

    LockDialog.hide();
    LoginDialog.hide();

  },
  showLogin() {
    LockDialog.hide();
    LoginDialog.show();
  },
  hideLogin() {
    LockDialog.show();
    LoginDialog.hide();
  }
}

window.addEventListener("load", Transition.fadeIn);