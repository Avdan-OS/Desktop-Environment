var lockScreen = document.getElementById("lock-screen");
var backgroundScreen = document.getElementById("background-screen");

var time = document.getElementById("time");
var clock = document.getElementById("clock");
var timeMidday = document.getElementById("time-midday");
var date = document.getElementById("date");

const TIME_FORMAT = {
    "12": 0,
    "24": 1
}

function _padZero(data) {
    return String(data).padStart(2, "0");
}

function getTime(is12) {
    const date = new Date();

    let hourReminder = date.getHours() % 12;
    let hour = (is12) ? ((hourReminder) ? hourReminder : 12) : date.getHours();
    let minute = date.getMinutes();
    let midDay = (date.getHours() >= 12) ? 'PM' : 'AM';

    if (is12) {
        return {
            hour: _padZero(hour),
            minute: _padZero(minute),
            midDay: midDay
        }
    } else {
        return {
            hour: _padZero(hour),
            minute: _padZero(minute)
        }
    }
}

function getDate() {
    const date = new Date();

    const DAY = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
    ];

    const MONTH = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
    ];

    return {
        day: DAY[date.getDay() - 1],
        date: date.getDate(),
        month: MONTH[date.getMonth() - 1]
    }
}

var LockDialog = {
    start() {
        lockScreen.addEventListener("click", Transition.showLogin);
        this.startClock();
    },
    setTime() {
        let timeVal = getTime(true);

        let midday = (timeVal.midDay) ? timeVal.midDay : '';
        time.innerText = `${timeVal.hour}:${timeVal.minute}`;
        clock.innerText = `${timeVal.hour}:${timeVal.minute}${String(midday).padStart(3, ' ')}`;
        timeMidday.innerText = midday;

        let dateVal = getDate();
        date.innerText = `${dateVal.day}, ${dateVal.month} ${dateVal.date}`
    },
    startClock() {
        this.setTime();
		setInterval(this.setTime, 1000);
    },
    hide() {
        lockScreen.classList.add('hide');
        backgroundScreen.classList.add('blur');
    },
    show() {
        lockScreen.classList.remove('hide');
        backgroundScreen.classList.remove('blur');
        // Close all menus
        Menus.closeAllMenus();
    }
}

LockDialog.start();