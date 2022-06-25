var lockScreen = document.getElementById("lock-screen");
var loginScreenContent = document.getElementById("login-content");

var backButton = document.getElementById("back-button");
var loginButton = document.getElementById("user-input-submit");

var batteryData = document.getElementById("battery-data");
var brightnessData = document.getElementById("brightness-data");

var batteryBar = document.getElementById("battery-bar");

var emailInput = document.getElementById('user-input-email');
var passwordInput = document.getElementById('user-input-password');
var apiInput = document.getElementById('user-input-api');

var LoginDialog = {
    start() {
        lockScreen.addEventListener("click", Transition.showLogin);
        backButton.addEventListener("click", Transition.hideLogin);
        loginButton.addEventListener("click", auth.startAuthentication.bind(auth));

        emailInput.addEventListener("keydown", (event) => {
            if (event.code === 'Enter') { passwordInput.focus(); }
        });
        passwordInput.addEventListener("keydown", (event) => {
            if (event.code === 'Enter') { apiInput.focus(); }
        });
        apiInput.addEventListener("keydown", (event) => {
            if (event.code === 'Enter') { auth.startAuthentication() }
        });

        this.updateBatteryData();
        this.updateBrightnessData();

        lightdm.battery_update.connect(this.updateBatteryData);
        lightdm.brightness_update.connect(this.updateBrightnessData);
    },
    updateBatteryData() {
        batteryData.innerText = `${lightdm.batteryData.level}%`;
        batteryBar.style.width = `${17 * (lightdm.batteryData.level / 100)}px`;
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