const { iconPath } = require("./constant");
const { Notification } = require("electron");

const callNotification = (title, body) => {
  const notif = {
    title: title,
    body: body,
    icon: iconPath,
  };

  new Notification(notif).show();
};

module.exports = {
  callNotification,
};
