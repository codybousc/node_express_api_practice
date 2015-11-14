//BASE SETUP

//=============================================================

var User = require('./app/models/user');

//connect to database (hosted on modulus.io)

mongoose.connect('mongodb://<user>:<pass>@apollo.modulusmongo.net:27017/urezIv7i');

//CALL THE PACKAGES-------------------------
var express    = require('express');
var app        = express();
var bodyParser = require('body-parser');
var morgan     = require('morgan');
var mongoose   = require('mongoose');
var port       = process.env.PORT || 8080;

// APP CONFIGURATION
//use body parser so we can grab info from POST requests
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

//Configure our app to handle CORS requests
//Allows requests from other domains preventing CORS errors
//This allows any domain to access the API
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type, \Authorization');
  next();
});

//log all requests to the console
app.use(morgan('dev'));

//ROUTES FOR THE API
//================================================
var apiRouter = express.Router();

//MIDDLEWARE TO USE FOR ALL requests
//=================================================
appRouter.use(function(req, res, next) {
  //do logging
  console.log('Someone just visited the app!');

  //more middleware to come

  //this is where we'll authenticate users

  next();

});

//basic route for the home page
app.get('/', function(req, res) {
  res.send('Welcome to the home page!');
});

//get an instance of the express router
var apiRouter = express.Router();

//test route to make sure everything is working
//accessed at GET http://localhost:8080/apiRouter
apiRouter.get('/', function(req, res) {
  res.json({message: 'Yep, up and running!'});
});

//more API ROUTES


//REGISTER ROUTES
//all routes will be prefixed with /API
app.use('/api', apiRouter);

//START THE SERVER
//=============================================
app.listen(port);
console.log('Magic happens on port ' + port);
