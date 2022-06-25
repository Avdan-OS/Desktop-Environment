var sleepMenuItem = document.getElementById("sleep-menu-item");
var hibernateMenuItem = document.getElementById("hibernate-menu-item");
var restartMenuItem = document.getElementById("restart-menu-item");
var shutdownMenuItem = document.getElementById("shutdown-menu-item");

var Power = {
  start() {
    sleepMenuItem.addEventListener('click', () => {
      if (lightdm.can_suspend) {
        Transition.fadeOut();
        setTimeout(() => { lightdm.suspend(); }, 1000);
      }
    });
    hibernateMenuItem.addEventListener('click', () => {
      if (lightdm.can_hibernate) {
        Transition.fadeOut();
        setTimeout(() => { lightdm.hibernate(); }, 1000);
      }
    });
    restartMenuItem.addEventListener('click', () => {
      if (lightdm.can_restart) {
        Transition.fadeOut();
        setTimeout(() => { lightdm.restart(); }, 1000);
      }
    });
    shutdownMenuItem.addEventListener('click', () => {
      if (lightdm.can_shutdown) {
        Transition.fadeOut();
        setTimeout(() => { lightdm.shutdown(); }, 1000);
      }
    });
  }
}

Power.start();