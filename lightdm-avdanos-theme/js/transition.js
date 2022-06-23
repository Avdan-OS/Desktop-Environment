var Transition = {
    fadeIn() {
        let blankScreen = document.getElementById("blank-screen");
        blankScreen.classList.add('hide')
    },
    fadeOut() {
        let blankScreen = document.getElementById("blank-screen");
        blankScreen.classList.remove('hide')
    }
}

window.addEventListener("load", Transition.fadeIn);