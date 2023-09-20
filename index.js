// Import packages
const express = require("express");
const home = require("./routes/home");
const admin = require("firebase-admin");

// Middlewares
const app = express();
/* const testEnv = () => {
    console.log('Testing the environment ', process.env.PRIVATE_KEY);
    
};
testEnv(); */

const serviceAccount = {
    projectId: process.env.PROJECT_ID,
    privateKeyId: process.env.PRIVATE_KEY_ID,
    privateKey: process.env.PRIVATE_KEY.replace(/\\n/g, '\n'),
    clientEmail: process.env.CLIENT_EMAIL,
    clientId: process.env.CLIENT_ID
};

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: process.env.STORAGE_BUCKET,
});
console.log('app initialized');
app.use(express.json());
// Routes
app.use("/home", home);

app.get("/", (req, res) => {
    res.send("The Worldliest of hello's!");
});

app.get("/api", (req, res) => {
    console.log('made it here in api :)');
    const db = admin.firestore();
    const docRef = db.collection('test').doc('testData');
    console.log('made it here in api again :)');
    docRef.get()
        .then((doc) => {
            if (doc.exists) {
                console.log('we out here...');
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
