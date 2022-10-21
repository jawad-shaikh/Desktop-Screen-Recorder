const path = require("path");
const { desktopCapturer } = require("electron");
const { v4: uuidv4 } = require("uuid");
const { writeFile, createReadStream } = require("fs");
const FormData = require("form-data");
const fetch = require("node-fetch");

const { API } = require("./constant");
const { callNotification } = require("./constant");
const { from } = require("form-data");

const getInputSources = async () => {
  const inputSources = await desktopCapturer.getSources({
    types: ["window", "screen"],
  });

  return inputSources;
};

const selectSource = (source, mainWindow) => {
  mainWindow.webContents.send("SET_SOURCE", source.id);
};

const setSourceAsEntireScreen = (mainWindow) => {
  const availableSources = getInputSources();
  availableSources.then((sources) => {
    selectSource(sources[0], mainWindow);
  });
};

const saveRecording = (buffer, userId) => {
  const uniqueId = uuidv4();
  const vidPath = path.join(__dirname, `../../../files/${uniqueId}.mp4`);

  writeFile(vidPath, buffer, () => {
    var form = new FormData();

    form.append("title", "sth");
    form.append("userId", userId);
    form.append("file", createReadStream(vidPath));

    fetch(`${API}/saveRecording.php`, { method: "POST", body: form })
      .then((res) => {
        return res.text();
      })
      .then(function (json) {
        console.log(json);
        callNotification("Recod", "Video saved successfully");
      });
  });
};

module.exports = {
  getInputSources,
  selectSource,
  setSourceAsEntireScreen,
  saveRecording,
};
