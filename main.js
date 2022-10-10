const { app, BrowserWindow, desktopCapturer } = require("electron");
const path = require("path");

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

setTimeout(() => {
  desktopCapturer
    .getSources({ types: ["window", "screen"] })
    .then(async (sources) => {
      console.log(sources);
      for (const source of sources) {
        if (
          source.name ===
          "main.js - Desktop-Screen-Recorder g - Visual Studio Code"
        ) {
          mainWindow.webContents.send("SET_SOURCE", source.id);
          return;
        }
      }
    });
}, 3000);
