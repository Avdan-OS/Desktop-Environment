var lockScreen = document.getElementById("lock-screen");
var loginScreenContent = document.getElementById("login-content");

var backButton = document.getElementById("back-button");
var loginButton = document.getElementById("user-input-submit");

var batteryData = document.getElementById("battery-data");
var brightnessData = document.getElementById("brightness-data");

var LoginDialog = {
    start() {
        lockScreen.addEventListener("click", Transition.showLogin);
        backButton.addEventListener("click", Transition.hideLogin);
        loginButton.addEventListener("click", auth.startAuthentication.bind(auth));

        this.updateBatteryData();
        this.updateBrightnessData();

        lightdm.battery_update.connect(this.updateBatteryData);
        lightdm.brightness_update.connect(this.updateBrightnessData);
    },
    updateBatteryData() {
        batteryData.innerText = `${lightdm.batteryData.level}%`;
    },
    updateBrightnessData() {
        brightnessData.innerText = `${lightdm.brightness}%`;
    },
    hide() {
        loginScreenContent.classList.add('hide');
    },
    show() {
        loginScreenContent.classList.remove('hide');
    }
}

LoginDialog.start();