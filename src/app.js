require('dotenv').config();
const cors = require("cors");
const express = require("express");
require("../config/dbConnection");
const passport = require('passport');
const cookieParser = require('cookie-parser');
const bodyParser = require("body-parser");
const app = express();
const user = require('../routes/userRoute');
const profile = require('../routes/profileRoute');
const website = require('../routes/websiteRoute');

const port = process.env.PORT || 5000;

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());


// List of allowed origins
app.use(
  cors({
    origin: ['http://localhost:3000', "https://t-dashboard-frontend.vercel.app"],  
    credentials: true,
    exposedHeader: ["accessToken", "adminToken", 'Access-Control-Allow-Origin'], 
  })
);
app.use(function (req, res, next) {
  res.header('Content-Type', 'application/json');
  res.header("Access-Control-Allow-Credentials", true);
  // res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// // app.use(express.urlencoded({ extended: false }))

app.use('/', user);
app.use('/', profile);
app.use('/', website);

app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong!";
  return res.status(errorStatus).send(errorMessage);
});

app.listen(port, () => console.log('working on port ' + port));

module.exports = app;
