var KeyEvent = {
  start() {
    document.addEventListener("keydown", (event) => {
      if (
        (event.key === ' ') || (event.code === 'Space') || (event.code === 'Enter') ||
        (event.code === 'NumpadEnter') || (event.code === 'Tab')
      ) {
        Transition.showLogin();
      }

      if (event.key === 'Escape') {
        event.preventDefault();

        if (PopupDialog.inShown) {
          PopupDialog.hide();
        } else {
          Transition.hideLogin();
        }
      }
    });
  }
}

window.addEventListener("load", KeyEvent.start);