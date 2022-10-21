const path = require("path");
const { app, BrowserWindow, ipcMain, Menu } = require("electron");

const { makeTray } = require("./assets/js/tray");
const {
  isAuthenticated,
  login,
  logout,
  loginFailed,
} = require("./assets/js/auth");
const {
  getInputSources,
  selectSource,
  setSourceAsEntireScreen,
  saveRecording,
} = require("./assets/js/video");

let userId;

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
    isAuthenticated(preloaderWindow, function (id) {
      if (id == undefined) {
        createLoginWindow();
        preloaderWindow.close();
        return;
      }
      userId = id;
      createMainWindow();
      preloaderWindow.close();
      setSourceAsEntireScreen(mainWindow);
      makeTray();
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
  login(email, password, function (res) {
    console.log("login output: ", res);
    if (res == 0) {
      loginFailed(loginWindow);
      return;
    }
    res = JSON.parse(res);
    userId = res.user_id;
    const code = `localStorage.setItem("userId", ${res.user_id})`;
    loginWindow.webContents.executeJavaScript(code, true);

    createMainWindow();
    setSourceAsEntireScreen(mainWindow);
    makeTray(mainWindow);

    setTimeout(() => {
      loginWindow.close();
    }, 1500);
  });
});

ipcMain.on("GET-SOURCES", async () => {
  const availableSources = getInputSources();

  availableSources.then((sources) => {
    let videoOptionsMenu = Menu.buildFromTemplate(
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
