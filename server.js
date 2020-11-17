'use strict';
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');




/** this project needs a db !! **/ 
// mongoose.connect(process.env.DB_URI);


// mongoose.connect(process.env.DB_URI);
const URI='mongodb+srv://pgcjameskim:xsncr471@cluster0-s8pey.mongodb.net/<dbname>?retryWrites=true&w=majority'
process.env.URI=URI
mongoose.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true }); 
mongoose.set('useFindAndModify', false)
app.use(cors());

/** this project needs to parse POST bodies **/
// you should mount the body-parser here

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});


const apiRouter = require('./app');
app.use('/api/exercise', apiRouter);


// //Not found middleware
app.use((req, res, next) => {
  return next({status: 404, message: 'not found'})
})



// Error Handling middleware
app.use((err, req, res, next) => {
  let errCode, errMessage

  if (err.errors) {
    // mongoose validation error
    errCode = 400 // bad request
    const keys = Object.keys(err.errors)
    // report the first validation error
    errMessage = err.errors[keys[0]].message
  } else {
    // generic or custom error
    errCode = err.status || 500
    errMessage = err.message || 'Internal Server Error'
  }
  res.status(errCode).type('txt')
    .send(errMessage)
})






const portNum = process.env.PORT || 3000;

// Listen for requests
app.listen(portNum, () => {
  console.log(`Listening on port ${portNum}`);
});

module.exports = app; // For testing