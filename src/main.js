const path = require("path");
const { app, BrowserWindow, ipcMain, Menu } = require("electron");
const fetch = require("node-fetch");

const { isAuthenticated, login } = require("./assets/js/auth");
const {
  getInputSources,
  selectSource,
  saveRecording,
} = require("./assets/js/video");

let userId;
let videoOptionsMenu;

let mainWindow;
let loginWindow;
let preloaderWindow;

const createMainWindow = () => {
  mainWindow = new BrowserWindow({
    width: 915,
    height: 720,
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  mainWindow.loadFile(path.join(__dirname, "./screens/index.html"));
};

const createLoginWindow = () => {
  loginWindow = new BrowserWindow({
    width: 302,
    height: 502,
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  loginWindow.loadFile(path.join(__dirname, "./screens/login.html"));
};

const createPreloaderWindow = () => {
  preloaderWindow = new BrowserWindow({
    width: 402,
    height: 302,
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  preloaderWindow.loadFile(path.join(__dirname, "./screens/preloader.html"));
};

app.whenReady().then(() => {
  createPreloaderWindow();

  setTimeout(() => {
    userId = isAuthenticated(preloaderWindow);
    userId.then((id) => {
      if (id == undefined) {
        createLoginWindow();
        preloaderWindow.close();
      } else {
        createMainWindow();
        preloaderWindow.close();

        const availableSources = getInputSources();
        availableSources.then((sources) => {
          selectSource(sources[0], mainWindow);
        });
      }
    });
  }, 3000);

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

ipcMain.on("LOGIN", async (event, email, password) => {
  login(email, password, loginWindow, createMainWindow);
});

ipcMain.on("GET-SOURCES", async () => {
  const availableSources = getInputSources();

  availableSources.then((sources) => {
    videoOptionsMenu = Menu.buildFromTemplate(
      sources.map((source) => {
        return {
          label: source.name,
          click: () => selectSource(source, mainWindow),
        };
      })
    );
    videoOptionsMenu.popup();
  });
});

ipcMain.on("SAVE-RECORDING", (event, buffer) => {
  saveRecording(buffer, userId);
});

ipcMain.on("MINIMIZE-WINDOW", () => {
  BrowserWindow.getFocusedWindow().minimize();
});

ipcMain.on("MAXIMIZE-WINDOW", () => {
  BrowserWindow.getFocusedWindow().isMaximized()
    ? BrowserWindow.getFocusedWindow().restore()
    : BrowserWindow.getFocusedWindow().maximize();
});

ipcMain.on("CLOSE-WINDOW", () => {
  BrowserWindow.getFocusedWindow().close();
});
