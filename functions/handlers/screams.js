
const {db} = require('../util/admin');

exports.getAllScreams = (request,response) => {
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
  }


exports.postOneScream = (request, response) => {
    if(request.body.body.trim() === ''){
        return res.status(403).json(err); 
    }
         const newScream={
             body: request.body.body,
             userHandler:request.user.handle,
             createdAt:new Date().toISOString()
         };
 
         db.collection('screams').add(newScream)
         .then(doc => {
             response.json({ message:`document ${doc.id} created successfuly`})
         })
         .catch(err=>{
             response.status(500).json({error:'something went wrong'})
             console.error(err)
         })
    }