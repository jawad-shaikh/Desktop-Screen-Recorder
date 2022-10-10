const { app, BrowserWindow, desktopCapturer, ipcMain } = require("electron");

let mainWindow;

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  mainWindow.loadFile("index.html");
};

app.on("ready", createWindow);

ipcMain.on("set-options", async (event) => {
  const cc = await desktopCapturer.getSources({ types: ["window", "screen"] });

  //   mainWindow.webContents.on("did-finish-load", () => {
  //     mainWindow.webContents.send("set-option", "item");
  //   });

  //   mainWindow.webContents.send("set-options", "sources");
  //   for (const source of sources) {
  //     // if (source.name === "desktop-screen-recorder") {
  //     //   mainWindow.webContents.send("set", source.id);
  //     mainWindow.webContents.send("set-options", source.id);
  //     //   return;
  //     // }
  //   }
});
