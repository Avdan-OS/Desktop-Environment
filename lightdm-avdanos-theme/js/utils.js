var Utils = {
  getLastUsedSession() {
    let lastUsedSession = localStorage.getItem('last-used-session');
    return (lastUsedSession != null) ?
      lightdm.sessions.filter((session) => { return session.key == lastUsedSession })[0]
    : lightdm.sessions[0];
  },

  isPromise(value) {
    return (typeof value === 'object' && typeof value.then === 'function');
  },
  isImageFile(path) {
    return path.match(/\.(gif|jpe?g|tiff?|png|webp|bmp|svg)$/i) !== null;
  }
}