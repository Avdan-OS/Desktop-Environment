var popupScreen = document.getElementById("popup-screen");
var popupCloseButtons = document.getElementsByClassName("popup-close");

var PopupDialog = {
  inShown: false,
  start() {
    popupScreen.addEventListener('click', (event) => {
      if (event.target.id == "popup-screen") {
        this.hide();
      }
    })
    Array.from(popupCloseButtons).forEach((button) => {
      button.addEventListener('click', (event) => {
        event.stopPropagation();
        this.hide();
      })
    })
  },
  hide() {
    popupScreen.classList.add('hide');
    this.inShown = false;
  },
  show() {
    popupScreen.classList.remove('hide');
    this.inShown = true;
  },
  switchDialog(name) {
    Array.from(popupScreen.children).forEach((dialog) => {
      dialog.classList.remove('show');
    });

    let selectedDialog = document.getElementById(`${name}-dialog`);
    selectedDialog.classList.add('show');
  }
}

PopupDialog.start();