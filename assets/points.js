const date = require("./date");
const {
  POINT_EVENTS,
} = require("../../Server Side Functions/assets/points/POINT_EVENTS");
const firebaseFuncs = require("./firebase/functions");
const { CouchDB } = require("./couchdb");
const logger = require("./logger");

const points = {
  onTrigger: async function (req) {
    var { type, campus_key, uid } = req.body;
    var { points, response, criteria } = POINT_EVENTS[type];

    const signInCheck = await CouchDB.getIfUserHasSignedInToday(uid);
    if (type == "appLogin" && signInCheck.error) throw signInCheck.error;
    if (type == "appLogin" && signInCheck.signedIn) points = 0;

    const societyJoinCheck = await CouchDB.getIfUserHasJoinedSociety(
      campus_key,
      uid,
      req.body.obj_id
    );
    if (societyJoinCheck.hasJoined) {
      response = false;
      points = 0;
    }

    const update = await firebaseFuncs.updateUserPoints(uid, points);
    if (update.error) throw update.error;

    return CouchDB.archiveUserPointTrigger({
      type,
      campus_key,
      uid,
      points,
      obj_id: req.body.obj_id || false,
      timestamp: Date.now(),
    })
      .then((res) => {
        return { response, points, user: update.user };
      })
      .catch((err) => {
        console.warn("Point trigger error", err);
        throw err;
      });
  },
};

exports.points = points;
