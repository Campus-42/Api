const { db, messaging } = require("./firebase");
const airtable = require("./airtable");
const logger = require("./logger");

exports.alertServerError = async function (err) {
  logger.error("\n\nServer error detected",err);

  const admins = await db
    .collection("users")
    .where("campus42_admin", "==", true)
    .get()
    .then((querySnapShot) => {
      const users = [];
      querySnapShot.forEach((user) => {
        var obj = user.data();
        obj.uid = user.id;
        users.push(obj);
      });
      return { users: users };
    })
    .catch((err) => {
      return { error: err };
    });

  if (admins.error) throw admins.error;
  else {
    const tokens = [];
    await Promise.all(
      admins.users.map(async (user) =>
        airtable
          .getTokens(user.uid)
          .then(
            async (tks) =>
              await Promise.all(tks.map((elem) => tokens.push({ token: elem.token, name: `${user.first_name} ${user.last_name}` })))
          )
      )
    );

    return tokens.map(async (token) => {
      const payload = {
        notification: {
          title: "🔴 Server is down 🔴",
          body: JSON.stringify(err),
        },
        android: {
          notification: {
            sound: "default",
            click_action: "Open",
          },
        },
        apns: {
          payload: {
            aps: {
              sound: "default",
              click_action: "Open",
            },
          },
        },
        token: token.token,
      };
      return messaging
        .send(payload)
        .then(() => {
          logger.log("Sent server error notification to: " + token.name, token.token);
          return;
        })
        .catch((err) => {
          logger.error("Could not send server error notification to: " + token, err);
          return;
        });
    });
  }
};
