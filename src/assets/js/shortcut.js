const { globalShortcut } = require("electron");
const { callNotification } = require("./notification");

const toggleRecordingState = (mainWindow) => {
  let isRecording = false;
  globalShortcut.register("CommandOrControl+R", () => {
    if (isRecording) {
      isRecording = false;
      const code = `document.getElementById("stopRecording").click()`;
      mainWindow.webContents.executeJavaScript(code, true);
      callNotification("Recod", "Video Recording Started.");
    } else {
      isRecording = true;
      const code = `document.getElementById("startRecording").click()`;
      mainWindow.webContents.executeJavaScript(code, true);
      callNotification("Recod", "Video Recording Stoped.");
    }
  });
};

module.exports = {
  toggleRecordingState,
};
