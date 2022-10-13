const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");

const startRecording = document.getElementById("startRecording");
const stopRecording = document.getElementById("stopRecording");
const getSorces = document.getElementById("getSorces");

if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const loginEmail = document.getElementById("loginEmail").value;
    const loginPassword = document.getElementById("loginPassword").value;

    electronAPI.login(loginEmail, loginPassword);
  });
}

if (signupForm) {
  signupForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const signupUsername = document.getElementById("signupUsername").value;
    const signupEmail = document.getElementById("signupEmail").value;
    const signupPassword = document.getElementById("signupPassword").value;

    electronAPI.signup(signupUsername, signupEmail, signupPassword);
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
