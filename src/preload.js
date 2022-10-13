const { contextBridge, ipcRenderer } = require("electron");

let mediaRecorder;
let recordedChunks = [];

contextBridge.exposeInMainWorld("electronAPI", {
  getSorces: () => ipcRenderer.send("GET-SOURCES"),
  startRecording: () => mediaRecorder.start(),
  stopRecording: () => mediaRecorder.stop(),
  login: (email, password) => ipcRenderer.send("LOGIN", email, password),
  signup: (username, email, password) =>
    ipcRenderer.send("SIGNUP", username, email, password),
});

ipcRenderer.on("LOGIN_RESPONSE", async (event, res) => {
  if (res == 0) {
    console.log("incorrect creds");
  } else {
    console.log("logged in");
    res = JSON.parse(res);
    localStorage.setItem("userId", res.user_id);
  }
});

ipcRenderer.on("SIGNUP_RESPONSE", async (event, res) => {
  if (res == 0) {
    console.log("email already exists");
  } else {
    console.log("logged in");
    res = JSON.parse(res);
    localStorage.setItem("userId", res.user_id);
  }
});

ipcRenderer.on("SET_SOURCE", async (event, sourceId) => {
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

  const options = { mimeType: "video/webm; codecs=vp9" };
  mediaRecorder = new MediaRecorder(stream, options);

  mediaRecorder.ondataavailable = handleDataAvailable;
  mediaRecorder.onstop = handleStop;
}

function handleError(e) {
  console.log(e);
}

function handleDataAvailable(e) {
  console.log("video data available");
  recordedChunks.push(e.data);
}

async function handleStop(e) {
  const blob = new Blob(recordedChunks, {
    type: "video/webm; codecs=vp9",
  });

  const buffer = Buffer.from(await blob.arrayBuffer());
  ipcRenderer.send("SAVE-RECORDING", buffer);
}