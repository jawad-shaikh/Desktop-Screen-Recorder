require("dotenv").config();
const { JSDOM } = require("jsdom");
const { window } = new JSDOM("");
const $ = require("jquery")(window);
const path = require("path");
const { writeFile } = require("fs");
const {
  app,
  BrowserWindow,
  desktopCapturer,
  ipcMain,
  Menu,
} = require("electron");

const { API } = require("./consonant");

let mainWindow;
let loginWindow;
let signupWindow;
let preloaderWindow;

const createMainWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  mainWindow.loadFile(path.join(__dirname, "index.html"));
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

  loginWindow.loadFile(path.join(__dirname, "login.html"));
};

const createSignupWindow = () => {
  signupWindow = new BrowserWindow({
    width: 302,
    height: 502,
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  signupWindow.loadFile(path.join(__dirname, "signup.html"));
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

  preloaderWindow.loadFile(path.join(__dirname, "preloader.html"));
};

app.whenReady().then(() => {
  createMainWindow();
  // createLoginWindow();
  // createSignupWindow();
  // createPreloaderWindow();

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
  $.ajax({
    url: `${API}/login.php`,
    type: "POST",
    data: { login_email: email, login_pass: password },
    success: function (res) {
      loginWindow.webContents.send("LOGIN_RESPONSE", res);
    },
  });
});

ipcMain.on("SIGNUP", async (event, username, email, password) => {
  $.ajax({
    url: `${API}/register.php`,
    type: "POST",
    data: { user_name: username, user_email: email, user_pass: password },
    success: function (res) {
      console.log(res);
      signupWindow.webContents.send("SIGNUP_RESPONSE", res);
    },
  });
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
  writeFile(path.join(__dirname, "../files/abc.mp4"), buffer, () =>
    console.log("video saved successfully!")
  );
});

async function selectSource(source) {
  mainWindow.webContents.send("SET_SOURCE", source.id);
}
