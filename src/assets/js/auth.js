const { JSDOM } = require("jsdom");
const { window } = new JSDOM("");
const $ = require("jquery")(window);

const { API } = require("./constant");

const isAuthenticated = (preloaderWindow) => {
  return preloaderWindow.webContents
    .executeJavaScript("({...localStorage});", true)
    .then((localStorage) => {
      console.log(localStorage);
      return localStorage.userId;
    });
};

const login = (email, password, loginWindow, createMainWindow) => {
  $.ajax({
    url: `${API}/login.php`,
    type: "POST",
    data: {
      login_email: email,
      login_pass: password,
    },
    success: function (res) {
      console.log(res);
      if (res != 0) {
        res = JSON.parse(res);

        const code = `localStorage.setItem("userId", ${res.user_id})`;
        loginWindow.webContents.executeJavaScript(code, true);

        setTimeout(() => {
          createMainWindow();
          loginWindow.close();
        }, 1000);
      } else {
        const code = `var elem = document.querySelector('.err-message');
        elem.innerHTML = "Incorrect Credentials";`;
        loginWindow.webContents.executeJavaScript(code, true);
      }
    },
  });
};

const logout = () => {};

module.exports = { isAuthenticated, login, logout };
