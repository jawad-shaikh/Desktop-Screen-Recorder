const { JSDOM } = require("jsdom");
const { window } = new JSDOM("");
const $ = require("jquery")(window);

const { API } = require("./constant");
const { app } = require("electron");

const isAuthenticated = (preloaderWindow, callback) => {
  preloaderWindow.webContents
    .executeJavaScript("({...localStorage});", true)
    .then((localStorage) => {
      console.log(localStorage);
      callback(localStorage.userId); // "number" if exists, or "undefined"
    });
};

const login = (email, password, callback) => {
  $.ajax({
    url: `${API}/login.php`,
    type: "POST",
    data: {
      login_email: email,
      login_pass: password,
    },
    success: function (res) {
      callback(res); // "0" if incorrect creds, or json
    },
  });
};

const logout = (mainWindow) => {
  const code = `localStorage.removeItem("userId")`;
  mainWindow.webContents.executeJavaScript(code, true);

  setTimeout(() => {
    app.quit();
  }, 2000);
};

const loginFailed = (loginWindow) => {
  const code = `var elem = document.querySelector('.err-message');
                elem.innerHTML = "Incorrect Credentials";`;
  loginWindow.webContents.executeJavaScript(code, true);
};

module.exports = { isAuthenticated, login, logout, loginFailed };
