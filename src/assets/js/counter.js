/* initialization of different variables 
to be used in Count-Up App*/
const timerElement = document.querySelector(".real-timer");
const blinkBall = document.querySelector(".blink-ball");
const messageElement = document.querySelector(".message-box small");
const start = document.querySelector(".video-start");
const stop = document.querySelector(".video-pause");

let clearTime;
let seconds = 0,
  minutes = 0,
  hours = 0,
  secs,
  mins,
  gethours;

function recordingTime() {
  if (seconds === 60) {
    seconds = 0;
    minutes = minutes + 1;
  }
  mins = minutes < 10 ? "0" + minutes + ": " : minutes + ": ";

  if (minutes === 60) {
    minutes = 0;
    hours = hours + 1;
  }

  gethours = hours < 10 ? "0" + hours + ": " : hours + ": ";
  secs = seconds < 10 ? "0" + seconds : seconds;
  timerElement.innerHTML = gethours + mins + secs;

  seconds++;
  clearTime = setTimeout("recordingTime( )", 1000);
}
function startTime() {
  blinkBall.classList.add("active");
  if (seconds === 0 && minutes === 0 && hours === 0) {
    recordingTime();
  }
}
start.addEventListener("click", () => {
  if (start.hasAttribute("notavail")) {
    messageBox(true);
  } else {
    startTime();
    start.setAttribute("notavail", "");
    stop.removeAttribute("notavail");
  }
});

stop.addEventListener("click", () => {
  if (stop.hasAttribute("notavail")) {
    messageBox(false);
  } else {
    stop.setAttribute("notavail", "");
    start.removeAttribute("notavail", "");
    stopTime();
    blinkBall.classList.remove("active");
  }
});

function stopTime() {
  /* check if seconds, minutes and hours are not equal to 0 */
  if (seconds !== 0 || minutes !== 0 || hours !== 0) {
    let time = gethours + mins + secs;
    seconds = 0;
    minutes = 0;
    hours = 0;
    secs = "0" + seconds;
    mins = "0" + minutes + ": ";
    gethours = "0" + hours + ": ";
    timerElement.innerText = "00: 00: 00";
    clearTimeout(clearTime);
  }
}

function messageBox(message) {
  if (message) {
    messageElement.innerText = "Please Stop the Current Recording First!";
  } else {
    messageElement.innerText = "Please Start The Recording First!";
  }
  messageElement.parentElement.classList.add("active");
  setTimeout(() => {
    messageElement.parentElement.classList.remove("active");
  }, 2000);
}
