var KeyEvent = {
    start() {
        document.addEventListener("keydown", (event) => {
            if ((event.key === ' ') || (event.code === 'Space') || (event.code === 'Enter') || (event.code === 'Tab')) {
                LockDialog.hide();
                LoginDialog.show();
            }

            if (event.key === 'Escape') {
                event.preventDefault();

                LockDialog.show();
                LoginDialog.hide();
            }
        });
    }
}

KeyEvent.start();