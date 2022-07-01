var Utils = {
  getAvailableSession() {
    if (lightdm) {
      if (this.checkDefaultSessionAvailability(lightdm.default_session)) {
        return lightdm.default_session
      } else {
        return lightdm.sessions[0].key
      }
    }
  },
  checkDefaultSessionAvailability(session) {
    return (session && session != 'default');
  },

  isPromise(value) {
    return (typeof value === 'object' && typeof value.then === 'function');
  },
  isImageFile(path) {
    return path.match(/\.(gif|jpe?g|tiff?|png|webp|bmp|svg)$/i) !== null;
  }
}