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

let mainWindow;
let loginWindow;
let signupWindow;

const createmainWindow = () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  mainWindow.loadFile("index.html");
};

const createLoginWindow = () => {
  loginWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  loginWindow.loadFile("login.html");
};

const createSignupWindow = () => {
  signupWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  signupWindow.loadFile("signup.html");
};

app.whenReady().then(() => {
  createmainWindow();
  // createLoginWindow();
  // createSignupWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createmainWindow();
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
    url: "https://app.recod.io/api/login.php",
    type: "POST",
    data: { login_email: email, login_pass: password },
    success: function (res) {
      loginWindow.webContents.send("LOGIN_RESPONSE", res);
    },
  });
});

ipcMain.on("SIGNUP", async (event, username, email, password) => {
  $.ajax({
    url: "https://app.recod.io/api/register.php",
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
  writeFile(path.join(__dirname, "files/abc.mp4"), buffer, () =>
    console.log("video saved successfully!")
  );
});

async function selectSource(source) {
  mainWindow.webContents.send("SET_SOURCE", source.id);
}
