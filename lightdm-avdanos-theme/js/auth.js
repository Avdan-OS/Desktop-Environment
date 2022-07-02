var emailInput = document.getElementById('user-input-email');
var passwordInput = document.getElementById('user-input-password');
var apiInput = document.getElementById('user-input-api');
var userMessage = document.getElementById('user-message');

var loginButton = document.getElementById("user-input-submit");

const LoginFailedIssue = {
  "SERVER": 0,
  "API": 1,
  "AUTH": 2,
  "INTERNAL_AUTH": 3,
  "UNKNOWN": 10
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

class Auth {
  constructor () {
    if (typeof lightdm.authentication_complete == 'object') {
      lightdm.authentication_complete.connect(this._onAuthComplete.bind(this));
    } else {
      lightdm.authentication_complete = this._onAuthComplete.bind(this);
    }
  }

  _onAuthComplete() {
    if (lightdm.is_authenticated) {
      this.setMessage(`Authenticated as ${emailInput.value}`);
      this.success();
    } else {
      this.failed(LoginFailedIssue.INTERNAL_AUTH);
    }
  }

  async startAuth() {
    console.log("Start authentication");
    lightdm.authenticate(String(lightdm.users[0].username));
    await wait(100);
    lightdm.respond(
      (localStorage.getItem('user-password') != null) ?
        localStorage.getItem('user-password') : "avdan"
    );

    // Call authentication_complete manually to login to session properly
    if (typeof lightdm.authentication_complete != 'object') {
      await wait(100);
      lightdm.authentication_complete();
    }
  }

  failed(failedIssue, message = "") {
    passwordInput.value = '';

    // Error messages/UI
    switch (failedIssue) {
      case LoginFailedIssue.SERVER:
        this.setMessage("An error occurred when reaching the authentication server. Please update your OS or contact your IT manager.");
        this.animateShake(emailInput);
        this.animateShake(passwordInput);
        this.animateShake(apiInput);
        break;

      case LoginFailedIssue.API:
        this.setMessage("Incorrect API key.");
        this.animateShake(apiInput);
        break;

      case LoginFailedIssue.AUTH:
        this.setMessage("Incorrect email or password.");
        this.animateShake(emailInput);
        this.animateShake(passwordInput);
        break;

      case LoginFailedIssue.INTERNAL_AUTH:
        this.setMessage("Incorrect or unset internal password.");
        this.animateShake(emailInput);
        this.animateShake(passwordInput);
        this.animateShake(apiInput);
        break;

      case LoginFailedIssue.UNKNOWN:
        this.setMessage(`An error occurred:\n${message}`);
        this.animateShake(emailInput);
        this.animateShake(passwordInput);
        this.animateShake(apiInput);
    }

    lightdm.cancel_authentication();

    emailInput.disabled = false;
    passwordInput.disabled = false;
    apiInput.disabled = false;
    loginButton.disabled = false;
  }

  setMessage(message = "") {
    if (message) {
      userMessage.classList.add('reveal');
      userMessage.innerText = message;
    } else {
      userMessage.classList.remove('reveal');
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
    if (userData.email.length == 0) {
      this.animateShake(emailInput);
      this.setMessage('Email must be filled.');
      return false;
    }
    if (userData.password.length == 0) {
      this.animateShake(passwordInput);
      this.setMessage('Password must be filled.');
      return false;
    }
    if (userData.apiKey.length == 0) {
      this.animateShake(apiInput);
      this.setMessage('API key must be filled.');
      return false;
    }

    return true;
  }

  success() {
    // Make password input read-only
    passwordInput.readOnly = true;
    passwordInput.blur();

    setTimeout(() => {
      Transition.fadeOut();
    }, 500);

    // Add a delay before unlocking
    setTimeout(() => {
      if (lightdm.start_session) {
        lightdm.start_session(Utils.getAvailableSession());
      } else {
        lightdm.start_session_sync(Utils.getAvailableSession());
      }
    }, 1000);
  }

  async startAuthentication() {
    const userData = {
      email: emailInput.value,
      password: passwordInput.value,
      apiKey: apiInput.value
    }

    let availability = this.checkInputAvailability(userData);

    if (!availability) { return; }

    emailInput.disabled = true;
    passwordInput.disabled = true;
    apiInput.disabled = true;
    loginButton.disabled = true;

    const email = userData.email;
    const pass = userData.password;
    const key = userData.apiKey;

    this.setMessage();

    try {
      if (email.length > 0 && pass.length > 0 && key.length > 0) {
        this.setMessage("Sending request to the server...");
        const request = await fetch('https://enigmapr0ject.tech/api/avdan/login.php/', {
          method: 'POST',
          body: `Email=${userData.email}&Password=${userData.password}&apikey=${userData.apiKey}`
        })

        console.log(request);

        const data = await request.text();
        console.log("data :",data);

        switch (data) {
          case '401':
            this.failed(LoginFailedIssue.API);
            break;
          case '403':
            this.failed(LoginFailedIssue.AUTH);
            break;
          case '200':
            this.startAuth();
            break;
          default:
            this.failed(LoginFailedIssue.SERVER);
            break;
        }
      }
    } catch (e) {
      console.log(e);
      this.failed(LoginFailedIssue.UNKNOWN, e);
    }
  }
}

var auth = new Auth();