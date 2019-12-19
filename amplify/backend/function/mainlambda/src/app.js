
const express = require('express');
const bodyParser = require('body-parser');
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware');
const cors = require('cors');

// declare a new express app
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(awsServerlessExpressMiddleware.eventContext());

// Enable CORS for all methods
app.use(cors());

/*app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});*/



// route to services
const service = require('./SquidDataService.js');
app.use('/', service.routes);



app.listen(3000, function() {
  console.log("App started");
});


module.exports = app
