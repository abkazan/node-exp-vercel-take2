// Import packages
const express = require("express");
const home = require("./routes/home");
const admin = require("firebase-admin");

// Middlewares
const app = express();

const serviceAccount = {
    projectId: process.env.PROJECT_ID,
    privateKeyId: process.env.PRIVATE_KEY_ID,
    privateKey: process.env.PRIVATE_KEY,
    clientEmail: process.env.CLIENT_EMAIL,
    clientId: process.env.CLIENT_ID
};

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: process.env.STORAGE_BUCKET,
});
app.use(express.json());
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
