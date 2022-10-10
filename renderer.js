const startRecording = document.getElementById("startRecording");
const stopRecording = document.getElementById("stopRecording");
const getSorces = document.getElementById("getSorces");

getSorces.addEventListener("click", () => {
  electronAPI.getSorces();
});

startRecording.addEventListener("click", () => {
  electronAPI.startRecording();
});

stopRecording.addEventListener("click", () => {
  electronAPI.stopRecording();
});
