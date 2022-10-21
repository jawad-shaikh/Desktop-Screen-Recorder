const { Menu, Tray } = require("electron");
const { iconPath } = require("./constant");
const { getInputSources, selectSource } = require("./video");

const makeTray = (mainWindow) => {
  let tray = null;
  tray = new Tray(iconPath);

  const availableSources = getInputSources();

  availableSources.then((sources) => {
    const contextMenu = Menu.buildFromTemplate([
      {
        label: "Start Recording",
        click: () => {
          selectSource(sources[0], mainWindow);
          mainWindow.webContents.send("JUST_START_RECORDING");
        },
      },
      {
        label: "Stop Recording",
        click: () => {
          mainWindow.webContents.send("JUST_STOP_RECORDING");
        },
      },
    ]);

    tray.setToolTip("Recod.");
    tray.setContextMenu(contextMenu);
  });
};

module.exports = {
  makeTray,
};
