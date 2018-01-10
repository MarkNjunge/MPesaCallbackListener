const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors");
const app = require("express")();
const parse = require("./parse");

admin.initializeApp(functions.config().firebase);
const db = admin.database();

app.use(cors({ origin: true }));

app.post("/:token", (req, res) => {
	console.log("Callback received.");

	const callbackData = req.body.Body.stkCallback;

	console.log(JSON.stringify(callbackData));

	const parsedData = parse(callbackData);

	if (parsedData.resultCode == 0) {
		sendNotification(
			"MyDuka",
			"Your transaction was successful.",
			req.params.token
		);
		db.ref("LNM/successful").push(parsedData, error => {
			if (error) {
				console.log(error);
			} else {
				console.log("Transaction saved to database.");
			}
		});
	} else {
		sendNotification(
			"MyDuka",
			"Your transaction was not successful.",
			req.params.token
		);
		db.ref("LNM/failed").push(parsedData, err => {
			if (err) {
				console.log(err);
			} else {
				console.log("Transaction saved to database.");
			}
		});
	}
	res.send("Completed");
});

function sendNotification(title, body, token) {
	const payload = { notification: { title, body } };
	return admin.messaging().sendToDevice(token, payload);
}

exports.callback_url = functions.https.onRequest(app);

exports.hello = functions.https.onRequest((request, response) => {
	response.send("Hello from Firebase!");
});
