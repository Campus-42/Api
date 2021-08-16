const Airtable = require("airtable");
const logger = require("./logger");

const API_KEY = "keyIUNtxniyBauoVn";

const fcm = new Airtable({ apiKey: API_KEY }).base("appOXVfqFCJGee5KS");
const emails = new Airtable({ apiKey: API_KEY }).base("apphtMo2vEtgp6IQg");
const tags = new Airtable({ apiKey: API_KEY }).base("appHe5CWHGqSHbejn");

exports.getTokens = async function (uid = String) {
  return fcm("FCM Tokens")
    .select({
      filterByFormula: `{uid} = \"${uid}\"`,
    })
    .all()
    .then(async (res) => {
      const tokens = [];
      res.forEach((elem) => {
        if (!tokens.includes(elem.fields)) tokens.push(elem.fields);
      });
      return tokens;
    })
    .catch((err) => {
      logger.error("Could not get uid tokens from airtable", err);

      return [];
    });
};
