"use strict";

const { alertServerError } = require("./assets/server_error");
process.on("uncaughtException", (err) => process.argv.includes("--deploy") && alertServerError(err));

const express = require("express");
const bodyParser = require("body-parser");
const logger = require("./assets/logger");
const { checkApiKey, validBody, getApiCode, logNewRequest, checkRoute } = require("./assets/api_funcs");
const { points } = require("./assets/points");
const { CouchDB } = require("./assets/couchdb");

logger.log("Api script starting...");
/**
 * Welcome to the api script!
 * This script will serve as a simple api for the Campus42 applications
 * Currently it can handle analytics events and errors by inserting them intoa mongo db with the information
 * @params If you're only testing the script, enter "node index.js --testing" in cli, that will deactivate the mongo db insert
 * When starting this script pass the path to the api keys as a third argument as this => --path_to_keys={path}
 *
 * IMPORTANT!!
 * All routes must be defined in the routes.json file under assets
 */

/* Start the express app and specify parsers for json and url */
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/* Specify port to run on */
const port = 8923;

/**
 * Normal events that happen on mobile app
 * Such as screen change, join action etc.
 * Error will be handled under error link
 * Api keys must be sent like /?api_key=API_KEY in the request url
 */
app.all("*", async (req, res, next) => {
  logNewRequest(req); // Log it
  const validKey = checkApiKey(req.query.api_key); // Check validity of api key
  const validRoute = checkRoute(req.url.split("?")[0]);

  if (validKey) {
    if (validRoute) next();
    else return res.status(404).send(getApiCode("404"));
  } else return res.status(401).send(getApiCode("401"));
});

app.post("/analytics/event/", async (req, res, next) => {
  // Insert event into mongo db
  if (await validBody(req.body))
    return CouchDB.insertAnalytics(req.body)
      .then(() => res.status(201).send(getApiCode("201")))
      .catch(() => res.status(500).send(getApiCode("500")))
      .finally(next);
  else return res.status(400).send(getApiCode("400"));
});

app.post("/analytics/error/", async (req, res, next) => {
  logger.error(req.body);
  if (await validBody(req.body))
    return CouchDB.insertAnalytics(req.body, true)
      .then(() => res.status(201).send(getApiCode("201")))
      .catch(() => res.status(500).send(getApiCode("500")))
      .finally(next);
  else return res.status(400).send(getApiCode("400"));
});

app.post("/points/trigger/", async (req, res, next) => {
  return points
    .onTrigger(req)
    .then((response) => res.status(200).send(response))
    .catch(() => res.status(500).send(getApiCode("500")));
});

app.post("/bubbles/copy", async (req, res, next) => {
  return CouchDB.copyBubbleDoc(req.body)
    .then(() => res.status(201).send(getApiCode("201")))
    .catch(() => res.status(500).send(getApiCode("500")))
    .finally(next);
});

app.listen(port, () => {
  logger.log("Started api and listening to port " + port);
  logger.log({ msg: "Started api and listening to port " + port, timestamp: Date.now() });
});
