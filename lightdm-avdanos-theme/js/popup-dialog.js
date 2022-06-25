var popupScreen = document.getElementById("popup-screen");
var popupCloseButton = document.getElementById("popup-close");

var PopupDialog = {
  start() {
    popupScreen.addEventListener('click', (event) => {
      if (event.target.id == "popup-screen") {
        this.hide();
      }
    })
    popupCloseButton.addEventListener('click', (event) => {
      this.hide();
    })
  },
  hide() {
    popupScreen.classList.add('hide');
  },
  show() {
    popupScreen.classList.remove('hide');
  }
}

PopupDialog.start();