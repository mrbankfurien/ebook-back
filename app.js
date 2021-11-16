const express = require("express") ;
const bodyParser = require("body-parser") ;
const userRoute = require('./routes/user');
const posterRoute = require('./routes/poster');
const posterPublicRoute = require('./routes/public-post');

//require('dotenv').config() ;


const app = express() ;


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });


  app.use(bodyParser.json()) ;


  app.use("/api/user" , userRoute) ;
  app.use("/api/poster" , posterRoute) ;
  app.use("/api/public-poster" , posterPublicRoute) ;


  module.exports = app ;
