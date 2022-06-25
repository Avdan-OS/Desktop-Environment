var Transition = {
  fadeIn() {
    let blankScreen = document.getElementById("blank-screen");
    blankScreen.classList.add('hide')
  },
  fadeOut() {
    let blankScreen = document.getElementById("blank-screen");
    blankScreen.classList.remove('hide')
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