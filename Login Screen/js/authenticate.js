class Authenticate {
	constructor() {
		this._emailBox = document.querySelector('#input-email-box');
		this._emailInput = document.querySelector('#input-email');

		this._apikeyBox = document.querySelector('#input-key-box');
		this._apikeyInput = document.querySelector('#input-key');

		this._passwordBox = document.querySelector('#input-password-box');
		this._passwordInput = document.querySelector('#input-password');

		this._buttonAuthenticate = document.querySelector('#button-authenticate');

		this._emailInputContainer = document.querySelector('#input-email-container');
		this._apikeyInputContainer = document.querySelector('#input-key-container');
		this._passwordInputContainer = document.querySelector('#input-password-container');

		this._tooltipPassword = document.querySelector('#tooltip-password');
		this._password = '';
		this._init();
	}

	_returnRandomErrorMessages() {
		const errorMessages = [
			'Authentication failed!',
			'You look stoopid.',
			'This incident will be reported.',
			'This will self-destruct in 5 seconds!',
			'Uhhh... are you sure you know what you are doing?',
			'Get out of there, it\'s gonna blow!',
			'I can do this all day.',
			'PAM will lock you out...'
		];
		return errorMessages[Math.floor(Math.random() * errorMessages.length)];	
	}

	_returnRandomSuccessfulMessages() {
		const errorMessages = [
			'Authentication success! Logging in!',
			'Logging in!',
			'Looking good today~',
			'You are someone\'s reason to smile.',
			'Finally, someone with a good amount of IQ!',
		];
		return errorMessages[Math.floor(Math.random() * errorMessages.length)];
	}

	// Start authentication
	async startAuthentication() {
		try {
			this._tooltipPassword.classList.remove('tooltip-error');
			this._passwordBox.classList.remove('authentication-failed');
			this._apikeyBox.classList.remove('authentication-failed');
		}
		catch (e) {
			console.log(e);
		}
		const userData = {
			email: this._emailInput.value,
			password: this._passwordInput.value,
			apiKey: this._apikeyInput.value
		}
		const email = userData.email;
		const pass = userData.password;
		const key = userData.apiKey;
		try {
			if(email.length>0 && pass.length>0 && key.length>0){
				
				console.log("Sending request");
				const request = await fetch('https://enigmapr0ject.tech/api/avdan/login.php', {
				method: 'POST',
				body: `Email=${userData.email}&Password=${userData.password}&apikey=${userData.apiKey}`,
			})
			if (request.status !== 200) return this._authenticationFailed(true);

			console.log(request);

			const data = await request.text();

			console.log("data :",data);

			switch (data) {
				case '401':
					this._authenticationFailed(false, true);
					break;
				case '403':
					this._authenticationFailed();
					break;
				case '200':
					lightdm.respond("avdan");
					this._authenticationComplete();
					break;
				default:
					this._authenticationFailed(true);
					break;
			}
		} else {
			console.log("Empty fields text sent");
			this._tooltipPassword.innerText = 'Empty fields.';
			this._apikeyBox.classList.add('authentication-failed');
			this._tooltipPassword.classList.add('tooltip-error');
			this._apikeyInputContainer.classList.add('shake');
			setTimeout(
				() => {
					// Stop shaking
					this._apikeyInputContainer.classList.remove('shake');
				},
				500
				);
			}
		}
	catch (e) {
		console.log(e);
		}
	} 

	// Timer expired, create new authentication session
	_autologinTimerExpired() {
		window.autologin_timer_expired = () => {
			lightdm.authenticate(String(accounts.getDefaultUserName()));
		};
	}

	// Authentication completed callback
	_authenticationComplete() {
		console.log("Is authenticated: " + lightdm.is_authenticated);
		window.authentication_complete = () => {
			if (lightdm.is_authenticated) {
				this._authenticationSuccess();
			} else {
				this._authenticationFailed();
			}
		};
	}

	// You passed to authentication
	_authenticationSuccess() {
		this._password = null;

		// Make password input read-only
		this._passwordInput.readOnly = true;
		this._passwordInput.blur();
		
		// Success messages
		this._passwordBox.classList.add('authentication-success');
		this._tooltipPassword.innerText = this._returnRandomSuccessfulMessages();
		this._tooltipPassword.classList.add('tooltip-success');

		setTimeout(
			() => {
				loginFade.showLoginFade();
			},
			500
		);

		// Add a delay before unlocking
		setTimeout(
			() => {
				this._buttonAuthenticate.classList.remove('authentication-success');
				lightdm.start_session_sync(String(sessions.getDefaultSession()));
				this._tooltipPassword.classList.remove('tooltip-success');
			},
			1000
		);
	}

	// Remove authentication failure messages
	_authFailedRemove() {
		this._tooltipPassword.classList.remove('tooltip-error');
		this._passwordBox.classList.remove('authentication-failed');
	}

	// You failed to authenticate
	_authenticationFailed(isServerIssue = false, isAPIIssue = false) {
		this._password = null;

		// New authentication session
		this.startAuthentication();
		this._passwordInput.value = '';

		// Error messages/UI
		if (isServerIssue) {
			this._tooltipPassword.innerText = 'Avdan OS has had some trouble reaching the authentication server. Please update your OS or contact your IT manager.';
			this._apikeyBox.classList.add('authentication-failed');
			this._tooltipPassword.classList.add('tooltip-error');
			this._apikeyInputContainer.classList.add('shake');
			setTimeout(
				() => {
					// Stop shaking
					this._apikeyInputContainer.classList.remove('shake');
				},
				500
			);
		} else if (isAPIIssue) {
			this._tooltipPassword.innerText = 'Incorrect API key.';
			this._apikeyBox.classList.add('authentication-failed');
			this._tooltipPassword.classList.add('tooltip-error');
			this._apikeyInputContainer.classList.add('shake');
			setTimeout(
				() => {
					// Stop shaking
					this._apikeyInputContainer.classList.remove('shake');
				},
				500
			);
		} else {
			this._passwordBox.classList.add('authentication-failed');
			this._tooltipPassword.innerText = this._returnRandomErrorMessages();
			this._tooltipPassword.classList.add('tooltip-error');
	
			// Shake animation
			this._passwordInputContainer.classList.add('shake');
			setTimeout(
				() => {
					// Stop shaking
					this._passwordInputContainer.classList.remove('shake');
				},
				500
			);
		}
	}

	// Register keyup event
	_buttonAuthenticateClickEvent() {
		this._buttonAuthenticate.addEventListener(
			'click',
			() => {
				console.log("In Authentication: " + lightdm.in_authentication);
				this._authFailedRemove();
				this.startAuthentication();
			}
		);
	}

	// Register keydown event
	_passwordInputKeyDownEvent() {
		this._passwordInput.addEventListener(
			'keydown',
			e => {
				console.log("In Authentication: " + lightdm.in_authentication);
				this._authFailedRemove();
				this._password = this._passwordInput.value;
				if (e.key === 'Enter') {
					this.startAuthentication();
				}
			}
		);
	}

	_init() {
		this._autologinTimerExpired();
		this._authenticationComplete();
		this._buttonAuthenticateClickEvent();
		this._passwordInputKeyDownEvent();
		if (!lightdm) {
			lightdm.onload = function() {
				console.log('Start authentication');
				lightdm.authenticate(String(accounts.getDefaultUserName()));
			};
		} else {
			console.log('Start authentication');
			lightdm.authenticate(String(accounts.getDefaultUserName()));
		}
	}
}
