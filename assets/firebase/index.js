var admin = require("firebase-admin");

var serviceAccount = require("../ServiceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://unibike.firebaseio.com",
});

exports.db = admin.firestore();
exports.messaging = admin.messaging();
exports.auth = admin.auth();
exports.admin = admin;
