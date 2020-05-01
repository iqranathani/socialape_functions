const functions = require('firebase-functions');
const admin = require('firebase-admin');


var firebaseConfig = {
    apiKey: "AIzaSyBtuvBtjIeXMXpGkBWsYMw32zZcPhoZtMY",
    authDomain: "socialape2-500b1.firebaseapp.com",
    databaseURL: "https://socialape2-500b1.firebaseio.com",
    projectId: "socialape2-500b1",
    storageBucket: "socialape2-500b1.appspot.com",
    messagingSenderId: "733948957809",
    appId: "1:733948957809:web:08d200c81ea41b2c89f7d0"
  }; 
// const express = require('express');
const app = require('express')();
const firebase = require('firebase')
firebase.initializeApp(firebaseConfig)
//deploy
// admin.initializeApp()

// serve

var serviceAccount = require("../functions/privateKey.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://socialape2-500b1.firebaseio.com"
  });



  const db = admin.firestore()



app.get('/screams',(request,response) => {
  db.collection('screams').orderBy('createdAt','desc').get()
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
            createdAt:new Date().toISOString()
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

   //signup

   const isEmpty = (string) =>{
       if(string.trim() === '') return true;
       else return false
   }
   const isEmail = (email) => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
 
    return reg.test(email) == 0;
   }

   app.post('/signup',(request,response)=>{
       let token,userId;
       const newUser = {
        email:request.body.email,
        password:request.body.password,
        confirmPassword:request.body.confirmPassword,
        handle:request.body.handle
       }

       let errors = {}

       if (isEmpty(newUser.email)){
           errors.email='Must not be empty'
       }else if (isEmail(newUser.email)){
           errors.email ='Must be a valid email address'
       }

       if (isEmpty(newUser.password)) errors.password='Must not be empty'
       if (newUser.password !== newUser.confirmPassword) errors.confirmPassword ='Passwords must match'
       if (isEmpty(newUser.handle)) errors.handle='Must not be empty'
       
       if(Object.keys(errors).length > 0) return response.status(400).json(errors);


        db.doc(`/users/${newUser.handle}`).get()
        .then(doc=>{
            if(doc.exists){
                return response.status(400).json({handle :"this handle is already taken"})
            }
            else{
                return  firebase.auth().createUserWithEmailAndPassword(newUser.email,newUser.password)
            }
        }).then(data=>{
            userId = data.user.uid
          return data.user.getIdToken()

        }).then(idToken=>{

            token=idToken;
            const userCredentials = {
                handle:newUser.handle,
                email:newUser.email,
                createdAt:new Date().toISOString(),
                userId
            }
            return db.doc(`/users/${newUser.handle}`).set(userCredentials);
        }).then(()=>{
            return response.status(201).json({token})
        })
        .catch(err=>{
            console.error(err)
            if(err.code ==="auth/email-already-in-use"){
                return response.status(400).json({email:"Email is already in use"})
            }
            else{
                return response.status(500).json({error:err.code})
            }
          
        })

   })


   app.post('/login',(request,response)=>{
       const user={
           email:request.body.email,
           password:request.body.password
       }
       let errors={}
       if(isEmpty(user.email)) errors.email ='Must not be empty'
       if(isEmpty(user.password)) errors.password ='Must not be empty'
       if(Object.keys(errors).length > 0 ) return response.status(400).json(errors)

       firebase.auth().signInWithEmailAndPassword(user.email,user.password)
       .then((data)=>{
           return data.user.getIdToken();
       }).then((token)=>{
           return response.json({token});
       }).catch(err=>{
           console.error(err);
           return response.status(500).json({error:err.code})
       })
   })
exports.api = functions.https.onRequest(app)