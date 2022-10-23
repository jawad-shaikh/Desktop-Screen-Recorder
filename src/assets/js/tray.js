const { Menu, Tray } = require("electron");
const { iconPath } = require("./constant");
const { getInputSources, selectSource } = require("./video");

const makeTray = (mainWindow) => {
  let tray = new Tray(iconPath);

  const availableSources = getInputSources();

  availableSources.then((sources) => {
    const contextMenu = Menu.buildFromTemplate([
      {
        label: "Show / Hide",
        click: () => {
          mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show();
        },
      },
      {
        type: "separator",
      },
      {
        label: "Start Recording",
        click: () => {
          const code = `document.getElementById("startRecording").click()`;
          mainWindow.webContents.executeJavaScript(code, true);
        },
      },
      {
        label: "Stop Recording",
        click: () => {
          const code = `document.getElementById("stopRecording").click()`;
          mainWindow.webContents.executeJavaScript(code, true);
        },
      },
      {
        type: "separator",
      },
      {
        role: "quit",
      },
    ]);

    tray.setToolTip("Recod.");
    tray.setContextMenu(contextMenu);
  });
};

module.exports = {
  makeTray,
};
