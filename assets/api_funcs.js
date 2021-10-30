const { lookup } = require("geoip-lite");
const logger = require("./logger");
const ApiCodes = require("./api_codes.json");
const Routes = require("./routes.json");

/**
 * Get the api keys
 */
const path = process.argv
  .filter((elem) => elem.includes("--path_to_keys="))[0]
  .split("--path_to_keys=")[1];
const ApiKeys = require(path);

/**
<<<<<<< HEAD
 * Validate the api key provided
=======
 * Validate the api api key provided
>>>>>>> de6d09b9d12999121f1580a3c731fe4531e8d152
 */
exports.checkApiKey = (key) => ApiKeys[key] !== undefined && ApiKeys[key].valid;

/**
 * Check if the post request has all the required object keys/children
 */
const keys = ["timestamp", "data", "type", "platform"];
exports.validBody = async (body) =>
  keys.every((k) => Object.keys(body).includes(k)) || body.type == "breadcrumb";

exports.getApiCode = (status) => {
  /**
   * Get the specified api code and automatically log it
   */
  const ret = ApiCodes[status.toString()];
  ret.status = status;
  ret.timestamp = Date.now();
  parseInt(status) >= 400 ? logger.error(ret.msg) : logger.log(ret.msg);
  return ret;
};

/**
 * Log the necessary components of the new requests
 */
exports.logNewRequest = function (req) {
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  var ipLocation = lookup(ip) || false;
  if (ipLocation) ipLocation = `${ipLocation.city}, ${ipLocation.country}`;

  logger.log(`Received [${req.body.type}] at ${req.url.split("?")[0]}`);
  logger.log(`Request ip is [${ip}] at ${ipLocation}`);
};

/**
 * Check validity of route and if not return 404
 */
exports.checkRoute = function (route) {
  return Routes.includes(route.trim());
};
