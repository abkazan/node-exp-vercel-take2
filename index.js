// Import packages
const express = require("express");
const home = require("./routes/home");
const admin = require("firebase-admin");

// Middlewares
const app = express();
app.use(express.json());
const serviceAccount = {
    "type": "service_account",
    "project_id": process.env.PROJECT_ID,
    "private_key_id": process.env.PRIVATE_KEY_ID,
    "private_key": process.env.PRIVATE_KEY,
    "client_email": process.env.CLIENT_EMAIL,
    "client_id": process.env.CLIENT_ID
};

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: process.env.STORAGE_BUCKET,
});

// Routes
app.use("/home", home);

app.get("/", (req, res) => {
    res.send("The Worldliest of hello's!");
});

app.get("/api", (req, res) => {
    const db = admin.firestore();
    const docRef = db.collection('test').doc('testData');

    docRef.get()
        .then((doc) => {
            if (doc.exists) {
                const data = doc.data();
                res.json({ "data": data });
            } else {
                res.json({ "data": [] });
            }
        })
        .catch((error) => {
            console.log('Error getting document:', error);
            res.status(500).json({ "error": "Internal Server Error" });
        });

});

// connection
const port = process.env.PORT || 9001;
app.listen(port, () => console.log(`Listening to port ${port}`));
