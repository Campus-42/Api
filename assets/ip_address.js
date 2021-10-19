const { db } = require("./firebase");
const IpMonitor = require("ip-monitor");
const logger = require("./logger");
const ipMonitor = new IpMonitor();

/**
 * A file to allow the listening and update of the server ip to firebase.
 * This way the server will always be reachable.
 */

ipMonitor.on("change", (prevIp, newIp) => {
  // Update the firebase document directly
  db.collection("general")
    .doc("server")
    .update({
      server_url: `http://${newIp}:8923`,
    })
    .then((res) => logger.log(`Updated ip: ${newIp}`))
    .catch((err) => logger.warn(err));
});

ipMonitor.on("error", (err) => console.warn(err));

exports.startIpListener = function () {
  ipMonitor.start();
};
