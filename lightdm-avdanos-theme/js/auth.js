function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

class Auth {
  constructor () {
    this.currentAuthenticating = "unknown";
    if (typeof lightdm.authentication_complete == 'object') {
      lightdm.authentication_complete.connect(this._onAuthComplete.bind(this));
    } else {
      lightdm.authentication_complete = this._onAuthComplete.bind(this);
    }
  }

  _onAuthComplete() {
    if (lightdm.is_authenticated) {
      this.setMessage(`Loading session...`, document.getElementById(`user-message_${this.currentAuthenticating}`));
      this.success();
    } else {
      this.failed();
    }
  }

  async startAuth(username, password) {
    console.log("Start authentication");
    lightdm.authenticate(username);
    await wait(100);
    lightdm.respond(password);

    // Call authentication_complete manually to login to session properly
    if (typeof lightdm.authentication_complete != 'object') {
      await wait(100);
      lightdm.authentication_complete();
    }
  }

  failed() {
    let passwordInput = document.getElementById(`user-password-field_${this.currentAuthenticating}`);
    let loginButton = document.getElementById(`user-login-button_${this.currentAuthenticating}`);

    passwordInput.value = '';

    // Error messages/UI
    this.setMessage("Incorrect password.", document.getElementById(`user-message_${this.currentAuthenticating}`));
    this.animateShake(passwordInput);

    lightdm.cancel_authentication();

    passwordInput.disabled = false;
    loginButton.disabled = false;
  }

  setMessage(message = "", userMessageElement) {
    if (message) {
      userMessageElement.classList.add('reveal');
      userMessageElement.innerText = message;
    } else {
      userMessageElement.classList.remove('reveal');
    }

  }

  animateShake(element) {
    element.classList.add('fail');
    element.classList.add('shake');

    setTimeout(() => {
      element.classList.remove('shake');
    }, 500);

    element.addEventListener('input', () => {
      element.classList.remove('fail');
    })
  }

  checkInputAvailability(userData) {
    if (userData.password.length == 0) {
      this.animateShake(document.getElementById(`user-password-field_${userData.username}`));
      this.setMessage('Password must be filled.', document.getElementById(`user-message_${userData.username}`));
      return false;
    }

    return true;
  }

  success() {
    let passwordInput = document.getElementById(`user-password-field_${this.currentAuthenticating}`);

    // Make password input read-only
    passwordInput.readOnly = true;
    passwordInput.blur();

    setTimeout(() => {
      Transition.fadeOut();
    }, 500);

    // Add a delay before unlocking
    setTimeout(() => {
      if (lightdm.start_session) {
        lightdm.start_session(Utils.getLastUsedSession().key);
      } else {
        lightdm.start_session_sync(Utils.getLastUsedSession().key);
      }
    }, 1000);
  }

  async startAuthentication(username) {
    const userData = {
      username: username,
      password: document.getElementById(`user-password-field_${username}`).value
    }

    let availability = this.checkInputAvailability(userData);

    if (!availability) { return; }

    document.getElementById(`user-password-field_${userData.username}`).disabled = true;
    document.getElementById(`user-login-button_${userData.username}`).disabled = true;

    this.setMessage("", document.getElementById(`user-message_${userData.username}`));

    if (userData.password.length > 0) {
      this.currentAuthenticating = username;
      this.startAuth(userData.username, userData.password);
    } else {
      this.failed();
    }
  }
}

var auth = new Auth();