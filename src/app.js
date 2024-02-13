if (process.env.NODE_ENV !== 'production'){
  require('dotenv').config() 
}
const cors = require("cors");
const express = require("express");
require("../config/dbConnection");
const passport = require('passport')

const app = express();

const user = require('../routes/userRoute')
const profile = require('../routes/profileRoutes')

const port = process.env.PORT || 5000;

app.use(
  cors({
    origin: ["http://localhost:3000", "*"],  
    credentials: true,
    exposedHeader: ["accessToken", "accesstoken", 'Access-Control-Allow-Origin'], 
  })
);
app.use(function (req, res, next) {
  res.header('Content-Type', 'application/json');
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// app.use(express.urlencoded({ extended: false }))
app.use(express.json());

app.use('/', user);
app.use('/', profile);

app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong!";
  return res.status(errorStatus).send(errorMessage);
});
app.listen(port, console.log('working on port '+port))

module.exports = app;