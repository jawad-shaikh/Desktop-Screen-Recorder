require("dotenv").config();
const { JSDOM } = require("jsdom");
const { window } = new JSDOM("");
const $ = require("jquery")(window);
const path = require("path");
const { writeFile, createReadStream } = require("fs");
const { v4: uuidv4 } = require("uuid");
const FormData = require("form-data");
const {
  app,
  BrowserWindow,
  desktopCapturer,
  ipcMain,
  Menu,
  Notification,
  Tray,
} = require("electron");

const { API } = require("./consonant");

let mainWindow;
let loginWindow;
let signupWindow;
let preloaderWindow;
let userId;
let tray = null;
let iconPath = path.join(__dirname, "/assets/img/extra.png");

const createMainWindow = () => {
  mainWindow = new BrowserWindow({
    width: 915,
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
  createPreloaderWindow();

  setTimeout(() => {
    preloaderWindow.webContents
      .executeJavaScript("({...localStorage});", true)
      .then((localStorage) => {
        console.log(localStorage);
        if (localStorage.userId != null) {
          userId = localStorage.userId;
          preloaderWindow.close();
          createMainWindow();
        } else {
          preloaderWindow.close();
          createLoginWindow();
        }
      });

    tray = new Tray(iconPath);
    tray.setToolTip("Recod");
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
  $.ajax({
    url: `${API}/login.php`,
    type: "POST",
    data: { login_email: email, login_pass: password },
    success: function (res) {
      console.log(res);
      if (res != 0) {
        loginWindow.webContents.send("LOGIN_RESPONSE", res);
        createMainWindow();
        loginWindow.close();
      } else {
        const code = `var elem = document.querySelector('.err-message');
        elem.innerHTML = "Incorrect Credentials";`;
        loginWindow.webContents.executeJavaScript(code, true);

        loginWindow.webContents.send("LOGIN_RESPONSE", res);
      }
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

function callNotification() {
  const notif = {
    title: "Recod",
    body: "Video saved successfully",
    icon: iconPath,
  };

  new Notification(notif).show();
}

ipcMain.on("SAVE-RECORDING", (event, buffer) => {
  const uniqueId = uuidv4();

  writeFile(path.join(__dirname, `../files/${uniqueId}.mp4`), buffer, () => {
    callNotification();

    // let form = new FormData();
    // const vidPath = path.join(__dirname, `../files/${uniqueId}.mp4`);

    // form.append("file", createReadStream(vidPath));
    // form.append("title", "sth");
    // form.append("userId", userId);

    // setTimeout(() => {
    //   console.log(form);
    //   $.ajax({
    //     url: `${API}/saveRecording.php`,
    //     type: "POST",
    //     data: form,
    //     processData: false,
    //     contentType: false,
    //     success: function (res) {
    //       console.log(res);
    //       callNotification();
    //     },
    //   });
    // }, 3000);
  });
});

function selectSource(source) {
  const code =
    "var icon = document.querySelector('.j-icon'); if(icon) icon.remove();";
  mainWindow.webContents.executeJavaScript(code, true);

  mainWindow.webContents.send("SET_SOURCE", source.id);
}

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
