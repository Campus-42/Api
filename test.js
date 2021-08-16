const fetch = require("node-fetch");
const { CouchDB, db } = require("./assets/couchdb");
const { points } = require("./assets/points");

// const qry = {
//   type: "appLogin",
//   campus_key: "campus_test",
//   uid: "VJtZYMTE4LhjmDy7zO6gcPxqYtt2",
// };
// console.log("Sending test fetch");
// fetch("http://192.168.1.165:8000/points/trigger/?api_key=JBJB732jksnkl68HJH", {
//   method: "POST",
//   headers: {
//     "Content-Type": "application/json",
//   },
//   body: JSON.stringify(qry),
// })
//   .then((response) => response.json())
//   .then(console.log)
//   .catch(console.warn)
//   .finally(process.exit);

// CouchDB.getIfUserHasSignedInToday("VJtZYMTE4LhjmDy7zO6gcPxqYtt2").then(console.log).catch(console.warn);

