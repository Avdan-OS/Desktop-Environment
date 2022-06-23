var lockScreen = document.getElementById("lock-screen");
var backgroundScreen = document.getElementById("background-screen");

var LockDialog = {
    start() {
        lockScreen.addEventListener("click", this.hide);
    },
    hide() {
        lockScreen.classList.add('hide');
        backgroundScreen.classList.add('blur');
    },
    show() {
        lockScreen.classList.remove('hide');
        backgroundScreen.classList.remove('blur');
    }
}

LockDialog.start();