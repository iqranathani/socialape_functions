const functions = require('firebase-functions');
const admin = require('firebase-admin');

const express = require('express');
const app = express();

//deploy
// admin.initializeApp()

// serve

var serviceAccount = require("../functions/privateKey.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://socialape2-500b1.firebaseio.com"
  });


app.get('/screams',(request,response) => {
    admin.firestore().collection('screams').get()
    .then((data)=>{
        let screams = []
        data.forEach((doc)=>{
            screams.push({
                screamId:doc.id,
                body:doc.data().body,
                userHandler:doc.data().userHandler,
                createdAt:doc.data().createdAt
            });
        });
        return response.json(screams)
    })
    .catch((err)=>
    console.error(err))
})

app.post('/scream',(request, response) => {
   
        const newScream={
            body: request.body.body,
            userHandler:request.body.userHandler,
            createdAt:admin.firestore.Timestamp.fromDate(new Date())
        };

        admin.firestore().collection('screams').add(newScream)
        .then(doc => {
            response.json({ message:`document ${doc.id} created successfuly`})
        })
        .catch(err=>{
            response.status(500).json({error:'something went wrong'})
            console.error(err)
        })
   });

exports.api = functions.https.onRequest(app)