var sleepMenuItem = document.getElementById("sleep-menu-item");
var hibernateMenuItem = document.getElementById("hibernate-menu-item");
var restartMenuItem = document.getElementById("restart-menu-item");
var shutdownMenuItem = document.getElementById("shutdown-menu-item");

var leaveGreeterDialogTitle = document.getElementById("leave-greeter-dialog-title");
var leaveGreeterDialogMessage = document.getElementById("leave-greeter-dialog-message");
var leaveGreeterDialogConfirmButton = document.getElementById("leave-greeter-dialog-confirm-button");

const POWER_ACTION = {
  SUSPEND: 0,
  HIBERNATE: 1,
  RESTART: 2,
  SHUTDOWN: 3
}

var Power = {
  start() {
    if (lightdm.can_suspend) {
      sleepMenuItem.classList.remove('disabled');
      sleepMenuItem.addEventListener('click', () => {
        this.startAction(POWER_ACTION.SUSPEND);
      });
    }

    if (lightdm.can_hibernate) {
      hibernateMenuItem.classList.remove('disabled');
      hibernateMenuItem.addEventListener('click', () => {
        this.startAction(POWER_ACTION.HIBERNATE);
      });
    }
    if (lightdm.can_restart) {
      restartMenuItem.classList.remove('disabled');
      restartMenuItem.addEventListener('click', () => {
        this.showDialog(POWER_ACTION.RESTART);
      });
    }
    if (lightdm.can_shutdown) {
      shutdownMenuItem.classList.remove('disabled');
      shutdownMenuItem.addEventListener('click', () => {
        this.showDialog(POWER_ACTION.SHUTDOWN);
      });
    }
  },
  showDialog(type) {
    PopupDialog.switchDialog('leave-greeter');
    PopupDialog.show();

    switch (type) {
      case POWER_ACTION.RESTART:
          leaveGreeterDialogTitle.innerText = 'Restart';
          leaveGreeterDialogMessage.innerText = 'Do you really want to restart your computer?';
          leaveGreeterDialogConfirmButton.innerText = 'Restart';
          leaveGreeterDialogConfirmButton.onclick = (event) => {
            event.stopPropagation();
            this.startAction(type);
          }
          break;

        case POWER_ACTION.SHUTDOWN:
          leaveGreeterDialogTitle.innerText = 'Shutdown';
          leaveGreeterDialogMessage.innerText = 'Do you really want to shutdown your computer?';
          leaveGreeterDialogConfirmButton.innerText = 'Shutdown';
          leaveGreeterDialogConfirmButton.onclick = (event) => {
            event.stopPropagation();
            this.startAction(type);
          }
          break;
    }
  },
  startAction(action) {
    Transition.fadeOut();

    setTimeout(() => {
      switch (action) {
        case POWER_ACTION.SUSPEND:
          lightdm.suspend();
          break;

        case POWER_ACTION.HIBERNATE:
          lightdm.hibernate();
          break;

        case POWER_ACTION.RESTART:
          lightdm.restart();
          break;

        case POWER_ACTION.SHUTDOWN:
          lightdm.shutdown();
          break;
      }
    }, 1000);
  }
}

Power.start();