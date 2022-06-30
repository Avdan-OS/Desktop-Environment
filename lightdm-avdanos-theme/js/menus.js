var powerMenu = document.getElementById("power-menu");
var powerButton = document.getElementById("power-button");

var batteryMenu = document.getElementById("battery-menu");
var batteryButton = document.getElementById("battery-button");

var brightnessMenu = document.getElementById("brightness-menu");
var brightnessButton = document.getElementById("brightness-button");
var brightnessSlider = document.getElementById("brightness-slider");

var layoutMenu = document.getElementById("layout-menu");
var layoutButton = document.getElementById("layout-button");
var layoutName = document.getElementById("layout-name");

var sessionMenu = document.getElementById("session-menu");
var sessionButton = document.getElementById("session-button");
var sessionName = document.getElementById("session-name");
var sessionIcon = document.getElementById("session-icon");

var clockMenu = document.getElementById("clock-menu");
var clockButton = document.getElementById("clock-button");

var loginScreen = document.getElementById("login-screen");

const Menus = {
  start() {
    loginScreen.addEventListener("click", this.closeAllMenus);
    clockMenu.addEventListener("click", (event) => {
      event.stopPropagation();
    });
    powerButton.addEventListener("click", (event) => {
      event.stopPropagation();
      this.toggleMenus(powerMenu);
    });
    batteryButton.addEventListener("click", (event) => {
      if (lightdm.can_access_battery) {
        event.stopPropagation();
        this.toggleMenus(batteryMenu);
      }
    });
    brightnessButton.addEventListener('click', (event) => {
      if (lightdm.can_access_brightness) {
        event.stopPropagation();
        this.toggleMenus(brightnessMenu);
      }
    });
    layoutButton.addEventListener("click", (event) => {
      event.stopPropagation();
      this.toggleMenus(layoutMenu);
    });
    sessionButton.addEventListener("click", (event) => {
      event.stopPropagation();
      this.toggleMenus(sessionMenu);
    });
    clockButton.addEventListener("click", (event) => {
      event.stopPropagation();
      this.toggleMenus(clockMenu);
    });

    this._setBrightness(lightdm.brightness, false);
    brightnessSlider.addEventListener('input', () => {
      this._setBrightness(brightnessSlider.value, true);
    })
    brightnessSlider.addEventListener('click', (event) => {
      event.stopPropagation();
    })

    this._loadLayouts();
    this._setLayout(
      lightdm.layouts.find((layout) => {
        if (typeof lightdm.layout == "object") {
          return layout.name == lightdm.layout.name;
        } else {
          return layout.name == lightdm.layout;
        }
      }),
      false
    );

    this._loadSessions();
    this._setSession(
      Utils.checkDefaultSessionAvailability(lightdm.default_session) ?
        lightdm.sessions.find((session) => {
          return session.key == lightdm.default_session;
        })
      : lightdm.sessions[0],
      false
    );
  },
  closeAllMenus() {
    powerMenu.classList.remove("show");
    batteryMenu.classList.remove("show");
    brightnessMenu.classList.remove('show');
    layoutMenu.classList.remove("show");
    sessionMenu.classList.remove("show");
    clockMenu.classList.remove("show");
  },
  toggleMenus(menus) {
    if (!menus.classList.contains("show")) {
      this.closeAllMenus();
      menus.classList.add("show");
    } else {
      menus.classList.remove("show");
    }
  },

  _setBrightness(value, update = true) {
    brightnessSlider.value = value;

    if (update) {
        lightdm.brightness = value;
    }
  },

  _loadLayouts() {
    lightdm.layouts.forEach((layout) => {
      let item = document.createElement("span");
      item.innerText = `${layout.description} (${layout.name.replace(" ", "_")})`;
      item.classList.add("item");

      item.addEventListener("click", () => {
        this.closeAllMenus();
        this._setLayout(layout);
      });

      layoutMenu.appendChild(item);
    });
  },
  _setLayout(layout, update = true) {
    layoutName.innerText = layout.name.replace(" ", "_").toUpperCase();

    if (update) {
      lightdm.layout = layout;
    }
  },

  _loadSessions() {
    lightdm.sessions.forEach((session) => {
      let item = document.createElement("div");
      item.classList.add("item");

      let icon = document.createElement("img");
      icon.classList.add("icon");
      icon.src = `img/sessions/${session.key}.png`;
      item.appendChild(icon);

      let name = document.createElement("span");
      name.innerText = session.name;
      item.appendChild(name);

      item.addEventListener("click", () => {
        this.closeAllMenus();
        this._setSession(session);
      });

      sessionMenu.appendChild(item);
    });
  },
  _setSession(session, update = true) {
    sessionName.innerText = session.name;
    sessionIcon.src = `img/sessions/${session.key}.png`;

    if (update) {
      lightdm.default_session = session.key;
    }
  },
};

Menus.start();