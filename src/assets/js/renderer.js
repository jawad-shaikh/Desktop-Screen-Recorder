const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");

const startRecording = document.getElementById("startRecording");
const stopRecording = document.getElementById("stopRecording");
const getSorces = document.getElementById("getSorces");

const minimizeWindow = document.getElementById("minimizeWindow");
const closeWindow = document.getElementById("closeWindow");
const maximizeWindow = document.getElementById("maximizeWindow");

if (minimizeWindow) {
  minimizeWindow.addEventListener("click", () => {
    electronAPI.minimize();
  });
}

if (closeWindow) {
  closeWindow.addEventListener("click", () => {
    electronAPI.close();
  });
}

if (maximizeWindow) {
  maximizeWindow.addEventListener("click", () => {
    electronAPI.toggleMaximize();
  });
}

if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    electronAPI.login(email, password);
  });
}

if (getSorces) {
  getSorces.addEventListener("click", () => {
    electronAPI.getSorces();
  });
}

if (startRecording) {
  startRecording.addEventListener("click", () => {
    electronAPI.startRecording();
  });
}

if (stopRecording) {
  stopRecording.addEventListener("click", () => {
    electronAPI.stopRecording();
  });
}
