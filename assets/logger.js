const colors = require("colors");
const winston = require("winston")

var LOG_PREFIX = () =>
  "[" +
  new Date().toTimeString().substring(0, 8) +
  "." +
  new Date().getMilliseconds() +
  "]";

const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.printf(({ message, level }) => {
      console.log(`[${message.timestamp}] ${message.msg}${message.data != undefined ? ": " + JSON.stringify(message.data) : ""}`);
      
      return `[${message.timestamp}] ${message.msg}${message.data != undefined ? ": " + JSON.stringify(message.data) : ""}`;
    })
  ),
  transports: [, new winston.transports.Console(), new winston.transports.File({ filename: "logs/combined.log" })],
});

logger.log = function () {
  console.log(LOG_PREFIX(), ...arguments);
};
logger.warn = function () {
  console.log(colors.yellow(LOG_PREFIX()), ...arguments);
};
logger.error = function () {
  console.log(colors.red(LOG_PREFIX()), ...arguments);
};
logger.debug = function () {
  if (process.argv.includes("--debug"))
    console.log(colors.green(LOG_PREFIX()), ...arguments);
};

module.exports = logger;
