var backgroundScreen = document.getElementById("background-screen");

var Backgrounds = {
  defaultBackgrounds: ["background.png"],
  _defaultBackgroundDir: "/usr/share/backgrounds",

  start() {
    if (localStorage.getItem('background') != null) {
      this.setBackground(localStorage.getItem('background'));
    } else {
      this.setBackground(this.defaultBackgrounds[0]);
    }
  },
  async _getBackgroundsPerDirectory(dirPath, arr) {
    let arrayBackground;

    if (Utils.isPromise(theme_utils.dirlist(this._defaultBackgroundDir))) {
      arrayBackground = await new Promise((resolve) => {
        theme_utils.dirlist(dirPath, false, (result) => { resolve(result);});
      })
    } else {
      arrayBackground = theme_utils.dirlist(dirPath);
    }

    arrayBackground.forEach((path) => {
      if (Utils.isImageFile(path)) {
        arr.push(path);
      } else {
        this._getBackgroundsPerDirectory(path, arr);
      }
    })
  },
  async getBackgrounds(path, arr) {
    if (!greeter_config || !theme_utils) {
      if (Utils.isPromise(theme_utils.dirlist(this._defaultBackgroundDir))) {
        arr = await new Promise((resolve) => resolve([]));
      } else {
        arr = [];
      }

      return;
    }

    this.defaultBackgrounds.forEach((path) => { arr.push(path); })

    let backgroundPath = path ? path : this._defaultBackgroundDir;
    this._getBackgroundsPerDirectory(backgroundPath, arr);
  },

  setBackground(path) {
    backgroundScreen.style.background = `url(${path})`;
    localStorage.setItem('background', path);
  }
}

Backgrounds.start();