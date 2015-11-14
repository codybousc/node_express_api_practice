//BASE SETUP
//============================================================

//=========================================================

var User = require('./app/models/user');


//CALL THE PACKAGES-------------------------
var express    = require('express');
var app        = express();
var bodyParser = require('body-parser');
var morgan     = require('morgan');
var mongoose   = require('mongoose');
var port       = process.env.PORT || 8080;

//connect to database (hosted on MongoLab)
mongoose.connect('mongodb://cody:1234@ds053764.mongolab.com:53764/nodeapi');

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
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type, Authorization');
  next();
});

//log all requests to the console
app.use(morgan('dev'));

//ROUTES FOR THE API
//================================================
var apiRouter = express.Router();

//MIDDLEWARE TO USE FOR ALL requests
//=================================================
apiRouter.use(function(req, res, next) {
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

//USERS ROUTES ( ROUTES THAT END IN /users)

apiRouter.route('/users')

  //create a user
  .post(function(req, res) {
      //create a new instance of the user model
      var user = new User();

      //set the users info (comes from request)
      user.name = req.body.name;
      user.username = req.body.username;
      user.password = req.body.password;

      //save the user and check for errors
      user.save(function(err) {
        if (err) res.send(err);

        res.json({message: 'User Created!'});
      });
    })

      //get all the users
      .get(function(req, res) {
          User.find(function(err, users) {
              if (err) res.send(err);

              //return the users
                res.json(users);
          });
      })




//REGISTER ROUTES
//all routes will be prefixed with /API
app.use('/api', apiRouter);

//START THE SERVER
//=============================================
app.listen(port);
console.log('Magic happens on port ' + port);
