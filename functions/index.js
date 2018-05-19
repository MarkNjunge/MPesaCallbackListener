const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

const callbackHandler = require("./callbackUrl");

exports.callback_url = functions.https.onRequest(callbackHandler);

exports.hello = functions.https.onRequest((request, response) => {
  response.send("Hello from Firebase!");
});
