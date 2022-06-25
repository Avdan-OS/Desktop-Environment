var lockScreen = document.getElementById("lock-screen");
var loginScreenContent = document.getElementById("login-content");

var backButton = document.getElementById("back-button");
var loginButton = document.getElementById("user-input-submit");

var batteryData = document.getElementById("battery-data");
var brightnessData = document.getElementsByClassName("brightness-data");
var brightnessSlider = document.getElementById("brightness-slider");

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

    lightdm.battery_update = this.updateBatteryData;
    lightdm.brightness_update = this.updateBrightnessData;
  },
  updateBatteryData() {
    batteryData.innerText = `${lightdm.batteryData.level}%`;
    batteryBar.style.width = `${17 * (lightdm.batteryData.level / 100)}px`;
  },
  updateBrightnessData() {
    let value = lightdm.brightness;

    Array.from(brightnessData).forEach((data) => {
      data.innerText = `${value}%`;
    });

    brightnessSlider.value = value;
  },
  hide() {
    loginScreenContent.classList.add('hide');
  },
  show() {
    loginScreenContent.classList.remove('hide');
  }
}

LoginDialog.start();