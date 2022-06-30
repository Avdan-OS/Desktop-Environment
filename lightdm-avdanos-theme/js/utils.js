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
  }
}