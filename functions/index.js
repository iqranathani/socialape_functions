const functions = require('firebase-functions');
const {getAllScreams,postOneScream} = require('./handlers/screams');
const {signup,login,uploadImage} = require('./handlers/users')
// const {firebaseConfig} = require('./util/config')
const FBAuth = require('./util/fbAuth')

const app = require('express')();
// const firebase = require('firebase')
// firebase.initializeApp(firebaseConfig)


//Scream routes
app.get('/screams',getAllScreams)
app.post('/createScream',FBAuth,postOneScream);

//users route
   app.post('/signup',signup)
   app.post('/login',login)
   app.post('/uploadImage',FBAuth,uploadImage)

exports.api = functions.https.onRequest(app)