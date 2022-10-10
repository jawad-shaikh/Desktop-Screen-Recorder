const { ipcRenderer } = require("electron");

const startRecording = document.getElementById("startRecording");
const stopRecording = document.getElementById("stopRecording");
const availableScreens = document.getElementById("availableScreens");

availableScreens.addEventListener("click", () => {
  ipcRenderer.send("set-options");
});

ipcRenderer.on("set-options", async (event, sourceId) => {
  console.log("called");
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        mandatory: {
          chromeMediaSource: "desktop",
          chromeMediaSourceId: sourceId,
          minWidth: 1280,
          maxWidth: 1280,
          minHeight: 720,
          maxHeight: 720,
        },
      },
    });

    handleStream(stream);
  } catch (e) {
    handleError(e);
  }
});

function handleStream(stream) {
  const video = document.querySelector("video");
  video.srcObject = stream;
  video.onloadedmetadata = (e) => video.play();
}

function handleError(e) {
  console.log(e);
}
