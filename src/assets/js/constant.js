const path = require("path");
const { Notification } = require("electron");

const API = "https://app.recod.io/api";
const iconPath = path.join(__dirname, "../../assets/img/extra.png");

const callNotification = (title, body) => {
  const notif = {
    title: title,
    body: body,
    icon: iconPath,
  };

  new Notification(notif).show();
};

module.exports = { API, iconPath, callNotification };
