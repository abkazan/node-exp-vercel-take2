// Import packages
const express = require("express");
const home = require("./routes/home");
const admin = require("firebase-admin");
const bodyParser = require('body-parser');
/* const serviceAccount = require('./!important/database-bb490-firebase-adminsdk-4r6l5-af4d5fe47b.json');
 */// Middlewares
const app = express();
/* const testEnv = () => {
    console.log('Testing the environment ', process.env.PRIVATE_KEY);
    
};
testEnv(); */

const serviceAccount = {
    "type": "service_account",
    "project_id": process.env.PROJECT_ID,
    "private_key_id": process.env.PRIVATE_KEY_ID,
    "private_key": process.env.PRIVATE_KEY.split(String.raw`\n`).join('\n'),
    "client_email": process.env.CLIENT_EMAIL,
    "client_id": process.env.CLIENT_ID,
    "auth_uri": process.env.AUTH_URI,
    "token_uri": process.env.TOKEN_URI,
    "auth_provider_x509_cert_url": process.env.AUTH_PROVIDER_CERT,
    "client_x509_cert_url": process.env.CLIENT_CERT,
    "universe_domain": process.env.UNICERSE_DOMAIN
};

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: process.env.STORAGE_BUCKET,
});

app.use(bodyParser.json());

// Routes
app.use("/home", home);

app.get("/", (req, res) => {
    res.send("The Worldliest of hello's!");
});

app.get("/api", (req, res) => {
    console.log('made it here in api :)');
    const db = admin.firestore();
    const docRef = db.collection('test').doc('testData');

    docRef.get().then((doc) => {
        console.log('we out here...');
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
