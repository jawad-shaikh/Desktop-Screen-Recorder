const path = require("path");
const { writeFile } = require("fs");
const {
  app,
  BrowserWindow,
  desktopCapturer,
  ipcMain,
  Menu,
} = require("electron");

let mainWindow;
const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  mainWindow.loadFile("index.html");
};

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

ipcMain.on("GET-SOURCES", async () => {
  const inputSources = await desktopCapturer.getSources({
    types: ["window", "screen"],
  });

  const videoOptionsMenu = Menu.buildFromTemplate(
    inputSources.map((source) => {
      return {
        label: source.name,
        click: () => selectSource(source),
      };
    })
  );

  videoOptionsMenu.popup();
});

ipcMain.on("SAVE-RECORDING", (event, buffer) => {
  writeFile(path.join(__dirname, "files/abc.mp4"), buffer, () =>
    console.log("video saved successfully!")
  );
});

async function selectSource(source) {
  mainWindow.webContents.send("SET_SOURCE", source.id);
}
