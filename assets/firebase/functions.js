const logger = require("../logger");
const { db, auth, admin } = require("./index");
const $ = require("../../../Server Side Functions/assets/points/formulas");
const date = require("../date");

const firebaseFuncs = {
  incrementFieldValue: async function (path, field, value) {
    return db
      .doc(path)
      .update({
        [field]: admin.firestore.FieldValue.increment(value),
      })
      .then((res) => {
        logger.log({
          msg: `Successfully incremented field value at ${field} in ${path}`,
          timestamp: Date.now(),
          data: {
            path: path,
            field: field,
            value: value,
          },
        });
        return {
          response: {
            timestamp: res.writeTime,
            value: value,
            path: path,
            field: field,
          },
        };
      })
      .catch((err) => {
        logger.error({
          msg: `Could not incremenet field value`,
          timestamp: Date.now(),
          data: { err: err },
        });
        return { error: err };
      });
  },
  updateUserPoints: async function (uid, newPoints) {
    const userDoc = await firebaseFuncs.getDoc(`/users/${uid}`, true);
    if (userDoc.error || !userDoc.doc.points) return { error: userDoc.error || "No user points found" };

    const points = (userDoc.doc.points || 0) + newPoints;
    const newLevel = $.getLevel(points);
    const period_points = (userDoc.doc.period_points || 0) + newPoints;

    userDoc.doc.points = points;
    userDoc.doc.level = newLevel;
    userDoc.doc.period_points = period_points;

    const update = await firebaseFuncs.updateDoc(`/users/${uid}`, { points, period_points, level: newLevel });
    if (update.error) return { error: update.error };
    else return { user: userDoc.doc };
  },
  updateDoc: async function (path, update) {
    return db
      .doc(path)
      .update(update)
      .then((res) => {
        return { response: res };
      })
      .catch((err) => {
        return { error: err };
      });
  },
  getDoc: async function (path, dontThrow = false) {
    return db
      .doc(path)
      .get()
      .then((doc) => {
        return { doc: doc.data() };
      })
      .catch((err) => {
        if (dontThrow) return { error: err };
        else throw err;
      });
  },
};

module.exports = firebaseFuncs;
