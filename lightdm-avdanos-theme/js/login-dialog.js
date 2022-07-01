var lockScreen = document.getElementById("lock-screen");
var loginScreenContent = document.getElementById("login-content");

var backgroundScreen = document.getElementById("background-screen");

var backButton = document.getElementById("back-button");
var loginButton = document.getElementById("user-input-submit");

var userPicture = document.getElementById("user-picture");

var batteryButton = document.getElementById("battery-button");
var batteryData = document.getElementsByClassName("battery-data");
var batteryState = document.getElementById("battery-state");

var brightnessButton = document.getElementById("brightness-button");
var brightnessData = document.getElementsByClassName("brightness-data");
var brightnessSlider = document.getElementById("brightness-slider");

var batteryBar = document.getElementById("battery-bar");
var batteryBarLarge = document.getElementById("battery-bar-large");

var emailInput = document.getElementById('user-input-email');
var passwordInput = document.getElementById('user-input-password');
var apiInput = document.getElementById('user-input-api');

var LoginDialog = {
  start() {
    lockScreen.addEventListener("click", Transition.showLogin);
    backButton.addEventListener("click", Transition.hideLogin);
    loginButton.addEventListener("click", auth.startAuthentication.bind(auth));

    if (lightdm.users[0].image) { userPicture.src = lightdm.users[0].image; }
    if (lightdm.users[0].background) { Backgrounds.setBackground(lightdm.users[0].background); }

    emailInput.addEventListener("keydown", (event) => {
      if ((event.code === 'Enter') || (event.code === 'NumpadEnter')) { passwordInput.focus(); }
    });
    passwordInput.addEventListener("keydown", (event) => {
      if ((event.code === 'Enter') || (event.code === 'NumpadEnter')) { apiInput.focus(); }
    });
    apiInput.addEventListener("keydown", (event) => {
      if ((event.code === 'Enter') || (event.code === 'NumpadEnter')) { auth.startAuthentication() }
    });

    if (lightdm.can_access_battery) {
      this.updateBatteryData();
      lightdm.battery_update.connect(this.updateBatteryData);
    } else {
      batteryButton.classList.add('disabled');
    }

    if (lightdm.can_access_brightness) {
      this.updateBrightnessData();
      lightdm.brightness_update.connect(this.updateBrightnessData);
    } else {
      brightnessButton.classList.add('disabled');
    }
  },
  updateBatteryData() {
    Array.from(batteryData).forEach((data) => {
      data.innerText = `${lightdm.batteryData.level}%`;
    })

    batteryState.innerText = lightdm.batteryData.state;

    batteryBar.style.width = `${16 * (lightdm.batteryData.level / 100)}px`;
    batteryBarLarge.style.width = `${32 * (lightdm.batteryData.level / 100)}px`;
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