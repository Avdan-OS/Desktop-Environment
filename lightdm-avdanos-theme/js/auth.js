var emailInput = document.getElementById('user-input-email');
var passwordInput = document.getElementById('user-input-password');
var apiInput = document.getElementById('user-input-api');
var userMessage = document.getElementById('user-message');

const LoginFailedIssue = {
    "SERVER": 0,
    "API": 1,
    "AUTH": 2
}

class Auth {
    constructor () {}

    failed(failedIssue) {
        passwordInput.value = '';

		// Error messages/UI
        switch (failedIssue) {
            case LoginFailedIssue.SERVER:
                userMessage.innerText = 'Avdan OS has had some trouble reaching the authentication server. Please update your OS or contact your IT manager.';
                this.animateShake(apiInput);
                break;

            case LoginFailedIssue.API:
                userMessage.innerText = 'Incorrect API key.';
                this.animateShake(apiInput);
                break;

            case LoginFailedIssue.AUTH:
                userMessage.innerText = 'Incorrect Password.';
                this.animateShake(passwordInput);
                break;

            default:
                userMessage.innerText = 'An error occurred.';
                this.animateShake(emailInput);
                this.animateShake(passwordInput);
                this.animateShake(apiInput);
        }
    }

    animateShake(element) {
        console.log("shake");
        element.classList.add('fail');

        element.addEventListener('input', () => {
            element.classList.remove('fail');
        })
    }

    checkInputAvailability(userData) {
        if (userData.email.length == 0) {
            this.animateShake(emailInput);
            userMessage.innerText = 'Email must be filled.';
            return false;
        }
        if (userData.password.length == 0) {
            this.animateShake(passwordInput);
            userMessage.innerText = 'Password must be filled.';
            return false;
        }
        if (userData.apiKey.length == 0) {
            this.animateShake(apiInput);
            userMessage.innerText = 'API key must be filled.';
            return false;
        }

        return true;
    }

    complete() {
        console.log("isAuthenticated?: " + lightdm.is_authenticated);
		window.authentication_complete = () => {
			if (lightdm.is_authenticated) {
				this.success();
			} else {
				this.failed(LoginFailedIssue.AUTH);
			}
		};
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
            lightdm.start_session_sync("plasma");
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

		const email = userData.email;
		const pass = userData.password;
		const key = userData.apiKey;

        userMessage.innerText = '';

		try {
			if (email.length > 0 && pass.length > 0 && key.length > 0) {
				console.log("Sending request");
				const request = await fetch('https://enigmapr0ject.tech/api/avdan/login.php', {
                    method: 'POST',
                    body: `Email=${userData.email}&Password=${userData.password}&apikey=${userData.apiKey}`,
                })

                if (request.status !== 200) return this.failed(LoginFailedIssue.SERVER);

                console.log(request);

                const data = await request.text();

                console.log("data :",data);

                switch (data) {
                    case '405':
                        this.failed(LoginFailedIssue.API);
                        break;
                    case '403':
                        this.failed(LoginFailedIssue.AUTH);
                        break;
                    case '200':
                        this.complete();
                        lightdm.respond("avdan");
                        break;
                    default:
                        this.failed();
                        break;
                }
            } else {
                console.log("Empty fields text sent");
                // this._tooltipPassword.innerText = 'Empty fields.';
                // this._apikeyBox.classList.add('authentication-failed');
                // this._tooltipPassword.classList.add('tooltip-error');
                // this._apikeyInputContainer.classList.add('shake');
                setTimeout(() => {
                    // Stop shaking
                    // this._apikeyInputContainer.classList.remove('shake');
                }, 500 )
            }
		} catch (e) {
            console.log(e);
		}
	}
}

var auth = new Auth();