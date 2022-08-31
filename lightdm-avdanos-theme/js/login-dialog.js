var lockScreen = document.getElementById("lock-screen");
var loginScreenContent = document.getElementById("login-content");

var usersContainer = document.getElementById("users");

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

var toggleButtons = document.getElementsByClassName('toggle-button');

function createElementFromString(data) {
  const template = document.createElement("template");
  template.innerHTML = data;
  return template.content.firstElementChild;
}

function createUserItem(user, index) {
    let displayName = user.display_name;
    let userName = user.username;
    let userPicture = user.image;

    let itemContainer = document.createElement("div");
    itemContainer.id = `user_${userName}`;
    itemContainer.classList.add("user");


    let userPictureElement = document.createElement("img");
    userPictureElement.classList.add("user-picture");
    userPictureElement.src = userPicture;
    itemContainer.appendChild(userPictureElement);


    // User Details Container
    let userDetailsContainer = document.createElement("div");
    userDetailsContainer.classList.add("user-details");
    itemContainer.appendChild(userDetailsContainer);

    let userDetailsUserName = document.createElement("span");
    userDetailsUserName.classList.add("user-name");
    userDetailsUserName.innerText = displayName;
    userDetailsContainer.appendChild(userDetailsUserName);

    let userDetailsUserState = document.createElement("span");
    userDetailsUserState.classList.add("user-state");
    userDetailsContainer.appendChild(userDetailsUserState);


    // User Inputs Container
    let userInputsContainer = document.createElement("div");
    userInputsContainer.classList.add("inputs");
    itemContainer.appendChild(userInputsContainer);

    let userInputPasswordWarper = document.createElement("div");
    userInputPasswordWarper.classList.add("user-input");
    userInputPasswordWarper.classList.add("warper");
    userInputsContainer.appendChild(userInputPasswordWarper)

    let userInputPasswordField = document.createElement("input");
    userInputPasswordField.id = "user-password-field_" + userName;
    userInputPasswordField.classList.add("user-input");
    userInputPasswordField.type = "password";
    userInputPasswordField.placeholder = "Password";
    userInputPasswordField.autocomplete = "off";
    userInputPasswordWarper.appendChild(userInputPasswordField);

    let userInputPasswordToggle = createElementFromString(`
      <span class="toggle-button">
        <img src="./img/show.png" class="onShow">
        <img src="./img/hide.png" class="onHide">
      </span>
    `);
    userInputPasswordWarper.appendChild(userInputPasswordToggle);


    // User Message Container
    let userMessage = document.createElement("span");
    userMessage.classList.add("user-message");
    userMessage.id = "user-message_" + userName;
    itemContainer.appendChild(userMessage);


    // User Login Controls Container
    let userLoginControlsContainer = document.createElement("div");
    userLoginControlsContainer.classList.add("login-controls");
    userInputsContainer.appendChild(userLoginControlsContainer);

    let userLoginControlsBackButton = createElementFromString(`
      <div class="button">
        <img src="img/back.png">
      </div>
    `);
    userLoginControlsBackButton.addEventListener("click", Transition.hideLogin);
    userLoginControlsContainer.appendChild(userLoginControlsBackButton);

    let userLoginControlsLoginButton = createElementFromString(`
    <input id="user-login-button_${userName}" type='button' class="user-input" value='Log In'/>
    `);
    userLoginControlsLoginButton.addEventListener(
      "click",
      auth.startAuthentication.bind(auth, userName)
    );
    userLoginControlsContainer.appendChild(userLoginControlsLoginButton);

    usersContainer.appendChild(itemContainer);

    itemContainer.onclick = () => {
      console.log("item click");
      usersContainer.style.transform = `translateX(-${parseInt(100 / lightdm.users.length * index)}%)`;
      lightdm.users.forEach((user) => {
          document.getElementById(`user_${user.username}`).classList.add("inactive");
      })
      itemContainer.classList.remove("inactive")
    };

    return itemContainer;
}

var LoginDialog = {
  start() {
    lockScreen.addEventListener("click", Transition.showLogin);

    lightdm.users.forEach((user, index) => {
      let userContainer = createUserItem(user, index);
      if (index != 0) {
        userContainer.classList.add("inactive");
      }
    })

    Array.from(toggleButtons).forEach((button) => {
      button.addEventListener("click", () => {
        button.classList.toggle('active');
        button.parentElement.children[0].type =
          button.classList.contains('active') ? 'text' : 'password';
      })
    })

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