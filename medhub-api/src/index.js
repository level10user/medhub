import express from "express";
import path from "path";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import Promise from "bluebird";

import User from "./models/User";
import Claims from "./models/Claims";
import Profile from "./models/Profile";
// import auth from "./routes/auth";

dotenv.config();

const app = express();
app.use(bodyParser.json());

mongoose.Promise = Promise;
mongoose.connect(process.env.MONGODB_URL);

// app.use('/api/auth', auth);


app.post('/api/auth', (req,res) => { 
  const credentials  = req.body;
  User.findOne({ email: credentials.email }).then(user => {
    if (user && user.isValidPassword(credentials.password)) {
        res.json({ user: user.toAuthJSON() });
   } 
   else {
     res.status(400).json({ errors: { global: "Invalid credentials" } });
   }
  });
})

app.post('/profile/create', (req,res) => { 
  const userEmail  = req.body.email;
  const data  = req.body;
  User.findOne( { email:  userEmail }).then(profile => {
    if (profile) {
        res.json({ profile: profile.getProfile() });
     } 
    else {
        Profile.create(data);
        res.json({ Profile : { global: "Profile Created " } });
    }
  });
})

app.post('/profile/update', (req,res) => { 
  const updateUser  = req.body;
  User.findOneAndUpdate( 
    { email:  updateUser.email } , 
    { $set: { name: 
              { firstname :  req.body.firstname, lastname :  req.body.lastname } , 
            address: 
              { address1 : updateUser.address1 , address2 : updateUser.address2 , state : updateUser.st , zip : updateUser.zip},
            contactMethod : 
              { preferredContactMethod : updateUser.preferredContactMethod, cellphone : updateUser.cellphone, homephone : updateUser.homephone}
            } 
    },
    { new: true }
    )
  .then(user => {
    if (user) {
          res.json({ user:  user.toCurrentUser() });
     } 
    else {
       res.status(400).json({ errors: { global: "Profile Not Found" } });
    }
  });
})

app.post('/profile', (req,res) => { 
  const userEmail  = req.body.email;
  User.findOne( { email:  userEmail }).then(user => {
    if (user) {
        res.json({ user: user.toCurrentUser() });
     } 
    else {
       res.status(400).json({ errors: { global: "Profile Not Found" } });
    }
  });
})

app.get('/api/claims', (req,res) => {
  Claims.find().then ( claims =>{
    res.json( { claims });
  })
})

app.get('/*',(req,res) => {
	res.sendFile(path.join(__dirname, "index.html"));
})

app.listen(8080, () => console.log("Running on localhost 8080 "));