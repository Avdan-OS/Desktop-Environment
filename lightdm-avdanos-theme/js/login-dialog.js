var lockScreen = document.getElementById("lock-screen");
var loginScreenContent = document.getElementById("login-content");
var loginButton = document.getElementById("user-input-submit");

var LoginDialog = {
    start() {
        lockScreen.addEventListener("click", this.show);
        loginButton.addEventListener("click", auth.startAuthentication.bind(auth));
    },
    hide() {
        loginScreenContent.classList.add('hide');
    },
    show() {
        loginScreenContent.classList.remove('hide');
    }
}

LoginDialog.start();