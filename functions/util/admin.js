const admin = require('firebase-admin');
// const functions = require('firebase-functions');
//deploy
   admin.initializeApp()
 const db = admin.firestore()

// const serviceAccount = require("../../functions/privateKey.json");
// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
//     databaseURL: "https://socialape2-500b1.firebaseio.com"
//   });

module.exports = {admin ,db}