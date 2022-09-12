var Debug = {
	start() {
		this._debugModePass = 'avdan';
		this._loadDebugObjects();
	},
	_loadDebugObjects() {
		if (!window.greeter_config) {
			window.greeter_config = {};
			window.greeter_config.branding = {
				background_images_dir: "/usr/share/backgrounds",
				logo: "/usr/share/web-greeter/themes/default/img/antergos-logo-user.png",
				user_image: "/usr/share/web-greeter/themes/default/img/antergos.png",
			};
		}

		if (!window.theme_utils) {
			window.theme_utils = {};
			window.theme_utils.dirlist = function(path, images_only, callback) {
				if ("" === path || "string" !== typeof path) {
					console.error(`theme_utils.dirlist(): path must be a non-empty string!`);
					return callback([]);
				}
				if (null !== path.match(/\/\.+(?=\/)/)) {
					// No special directory names allowed (eg ../../)
					path = path.replace(/\/\.+(?=\/)/g, "");
				}

				if (!callback) { callback = () => {}; }

				try {
					// Should be changed here
					return callback([]);
				} catch (err) {
					console.error(`theme_utils.dirlist(): ${err}`);
					return callback([]);
				}
			};
		}

		if (!window.lightdm) {
			window.lightdm = {
				is_authenticated: false,
				authentication_user: null,
				default_session: 'awesome',
				can_suspend: true,
				can_hibernate: true,
				can_shutdown: true,
				can_restart: true,
				batteryData: {
					name: "Battery 0",
					level: 85,
					state: "Discharging"
				},
				brightness: 50,
				sessions: [
					{
						name: 'awesome wm',
						key: 'awesome'
					},
					{
						name: 'bspwm',
						key: 'bspwm'
					},
					{
						name: 'KDE Plasma',
						key: 'plasma'
					},
					{
						name: 'Gnome 3',
						key: 'gnome'
					},
					{
						name: 'XFCE 4',
						key: 'xfce'
					},
					{
						name: 'Cinnamon',
						key: 'cinnamon'
					},
					{
						name: 'i3wm',
						key: 'i3'
					},
					{
						name: 'xmonad',
						key: 'xmonad'
					},
					{
						name: 'Deepin',
						key: 'deepin'
					},
					{
						name: 'Budgie',
						key: 'budgie'
					}
				],
				users: [
					{
						display_name: 'Advendra Deswanta',
						username: 'adeswanta08',
						image: 'user-picture.png'
					},
					{
						display_name: 'Jeffery Holley',
						username: 'jeffrey12',
						image: 'user-picture.png'
					},
					{
						display_name: 'Chris Glasser',
						username: 'chris11',
						image: 'user-picture.png'
					}
				],
				languages: [
					{
						name: 'American English',
						code: 'en_US.utf8'
					}
				],
				layout: {
					name: "us",
					description: "English (US)",
					short_description: "en"
				},
				layouts: [
					{
						name: "us",
						description: "English (US)",
						short_description: "en"
					},
					{
						name: "at",
						description: "German (Austria)",
						short_description: "de"
					},
					{
						name: "uk",
						description: "English (UK)",
						short_description: "en"
					}
				],
				language: 'American English',
				battery_update: {
					connect: (callback) => { lightdm.__battery_update_signal = callback; }
				},
				brightness_update:  {
					connect: (callback) => { lightdm.__brightness_update_signal = callback; }
				},
				autologin_timer_expired: {
					connect: (callback) => { lightdm.__autologin_timer_expired_signal = callback; }
				},
				authentication_complete: {
					connect: (callback) => { lightdm.__authentication_complete_signal = callback; }
				},
				can_access_battery: true,
				can_access_brightness: true,
				authenticate: username => {
					console.log(`Starting authenticating user: '${username}'`);
				},
				cancel_authentication: () => {
					console.log('Auth cancelled');
				},
				respond: password => {
					console.log(`Password provided: '${password}'`);
					if (password === this._debugModePass) {
						lightdm.is_authenticated = true;
					}
					else {
						let now = new Date().getTime();
						while (new Date().getTime() < now + 2000);
					}
					window.lightdm.__authentication_complete_signal();
				},
				start_session: session => {
					alert(`Logged with session: '${session}'!`);
					location.reload();
				},
				shutdown: () => {
					alert('System is shutting down...');
					location.reload();
				},
				restart: () => {
					alert('System is rebooting...');
					location.reload();
				},
				hibernate: () => {
					alert('System is hibernating...');
				},
				suspend: () => {
					alert('System is suspending...');
				}
			};

			window.lightdm = new Proxy(window.lightdm, {
				set: function (target, key, value) {
					target[key] = value;

					if (key == 'brightness') {
						window.lightdm.__brightness_update_signal();
					}

					return true;
				}
			});
			window.lightdm.batteryData = new Proxy(window.lightdm.batteryData, {
				set: function (target, key, value) {
					target[key] = value;

					if (key == 'level') {
						window.lightdm.__battery_update_signal();
					}

					return true;
				}
			});
		}
	}
}

Debug.start();