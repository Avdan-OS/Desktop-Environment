var time = document.getElementById("time");
var clocks = document.getElementsByClassName("clock");
var timeMidday = document.getElementById("time-midday");
var dates = document.getElementsByClassName("date");

var time12hButton = document.getElementById("time-12h-format-button");
var time24hButton = document.getElementById("time-24h-format-button");

const TIME_FORMAT = {
  "12": 0,
  "24": 1
}

var _clockInterval = null;
var _timeFormat = localStorage.getItem('time-format') || TIME_FORMAT['12'];

function _padZero(data) {
  return String(data).padStart(2, "0");
}

function _getTime(is12) {
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

function _getDate() {
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

var Clock = {
  start() {
    this.startClock();

    time12hButton.addEventListener('click', () => {
      this.setFormat(TIME_FORMAT['12']);
    });
    time24hButton.addEventListener('click', () => {
      this.setFormat(TIME_FORMAT['24']);
    });

    this.checkFormat(_timeFormat);
  },

  setClock() {
    // Time
    let timeVal = _getTime(_timeFormat == TIME_FORMAT['12']);
    let midday = (timeVal.midDay) ? timeVal.midDay : '';
    time.innerText = `${timeVal.hour}:${timeVal.minute}`;
    Array.from(clocks).forEach((clock) => {
      clock.innerText = `${timeVal.hour}:${timeVal.minute}${String(midday).padStart(3, ' ')}`;
    })
    timeMidday.innerText = midday;

    // Date
    let dateVal = _getDate();
    Array.from(dates).forEach((date) => {
      date.innerText = `${dateVal.day}, ${dateVal.month} ${dateVal.date}`
    })
  },
  startClock() {
    this.setClock();
		this._clockInterval = setInterval(this.setClock, 1000);
  },
  stopClock() {
    clearInterval(this._clockInterval);
  },
  setFormat(format) {
    this.stopClock();

    _timeFormat = format;
    localStorage.setItem('time-format', format);

    this.checkFormat(format);
    this.startClock();
  },
  checkFormat(format) {
    if (format == TIME_FORMAT['12']) {
      time12hButton.classList.add('active');
      time24hButton.classList.remove('active');
    } else {
      time12hButton.classList.remove('active');
      time24hButton.classList.add('active');
    }
  }
}

Clock.start();