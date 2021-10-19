/**
 * Welcome to the CouchDB page
 * Here I'll outline how to use this component
 *
 * In mongodb, we can use colections within a database
 * to separate information into suitable "columns". To achieve
 * the same result here each document inserted into CouchDB must
 * have 'collection' as a field to indicate which collection the doc
 * belongs to.
 *
 * Each "collection" will have their own format, which will be
 * outlined at their respective functions.
 *
 * If there are any questions, just contact me (github/JesLied)
 */

var nano;
var _nano = require("nano");

if (process.argv.includes("--remote"))
  nano = _nano("https://s7l3twrb98q.p50.rt3.io");
else nano = _nano("http://localhost:5984");

const date = require("../date");
const logger = require("../logger");
const { points } = require("../points");

const db = nano.db.use("campus42");

exports.CouchDB = {
  //////// ANALYTICS /////////
  insertAnalytics: async function (body, isError = false) {
    /**
     * @format { platform, app_version, data, platform, type }
     */
    const collection = "analytics." + (isError ? "errors" : "events");
    return db
      .insert({ collection, ...body })
      .then((res) => {
        return true;
      })
      .catch((err) => {
        logger.error(err);
        return false;
      });
  },

  //////// CAMPUS POINTS ////////
  getCampusPoints: async function () {},

  /////// USER POINTS ////////
  archiveUserPointTrigger: async function ({
    type,
    campus_key,
    uid,
    points,
    timestamp,
    obj_id,
  }) {
    const collection = "user_points.archive";
    return db.insert({
      collection,
      type,
      campus_key,
      uid,
      points,
      timestamp,
      obj_id,
    });
  },
  getIfUserHasSignedInToday: async function (uid) {
    const startOfDay = date.getStartOfDay();
    return db
      .find({
        selector: {
          type: { $eq: "appLogin" },
          uid: { $eq: uid },
          timestamp: { $gte: startOfDay.getTime() },
        },
        limit: 1,
      })
      .then(({ docs }) => {
        return { signedIn: docs.length > 0, error: false };
      })
      .catch((err) => {
        return { error: err, signedIn: false };
      });
  },
  getIfUserHasJoinedSociety: async function (campus_key, uid, obj_id) {
    return db
      .find({
        selector: {
          collection: "user_points.archive",
          type: "confirmedSociety",
          campus_key: campus_key,
          uid: uid,
          obj_id: obj_id,
        },
      })
      .then(({ docs }) => {
        return { hasJoined: docs.length > 0 && obj_id };
      })
      .catch((err) => {
        return { error: err };
      });
  },
  /////// OTHER ///////
  copyBubbleDoc: async function (body) {
    const bubble = body.bubble;
    if (!bubble.id) throw new Error("No id passed");
    const docId = "bubbles/" + bubble.id;

    // Get the existing document if it exists
    const currentDoc = await db
      .get(docId)
      .then(({ _rev }) => {
        return { _rev };
      })
      .catch((err) => {
        return { _rev: false };
      });

    const insertData = {
      bubble,
      _id: docId,
      collection: "bubble_copy",
    };
    if (currentDoc._rev) insertData._rev = currentDoc._rev;
    return db.insert(insertData);
  },
};
exports.db = db;
