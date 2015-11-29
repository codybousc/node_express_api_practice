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
var jwt        = require('jsonwebtoken');
var port       = process.env.PORT || 8080;

var superSecret = 'ilovescotchscotchyscotchscotch';

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

//ROUTE FOR AUTHENTICATING USERS
//Json web token created here and returned to user
apiRouter.post('/authenticate', function(req, res) {

  //find the user
  //selct the name username and password explicitly
  User.findOne({
    username: req.body.username
  }).select('name username password').exec(function(err, user) {
    if (err) throw err;

    //no user with that username was found
    if(!user) {
      res.json({
        success: false,
        message: 'Authentication failed. User not found.'
      });
    }
    else if (user) {
      //check if password matches
      var validPassword = user.comparePassword(req.body.password);
      if(!validPassword) {
        res.json({
          success: false,
          message: 'Invalid Password. '
        });
      }
      else {
        //if user is found and password is correct
        //create a token
        var token = jwt.sign({
          name: user.name,
          username: user.username
        }, superSecret, {
          expiresInMinutes: 2880 //48 hours
        });

        //return the information including the token as JSON
        res.json({
          success: true,
          message: 'Enjoy your token!',
          token: token
        });
      }
    }
  })
});

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
//==============================================================
//USERS ROUTES
//on routes that end in /users

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
    }) //WAS GETTING AN ERROR 'UNEXPECTED .' WHEN I HAD A SEMICOLON HERE

      //get all the users
      .get(function(req, res) {
          User.find(function(err, users) {
              if (err) res.send(err);

              //return the users
                res.json(users);
          });
      })

//on routes that end in /users/:user_id

apiRouter.route('/users/:user_id')

    //get the user with that id
    //(accessed at GET http://localhost:8080/api/users/:user_id)
    .get(function(req, res) {
        User.findById(req.params.user_id, function(err, user) {
            if (err) res.send(err);

            //return specificified user
            res.json(user);
        });
    })

    //update a user with specified id
    .put(function(req, res) {

        //use our user model to find the user we want
        User.findById(req.params.user_id, function(err, user) {
            if(err) res.send(err);

            //update the users info only if it's new
            if(req.body.name) user.name = req.body.name;
            if(req.body.username) user.username = req.body.username;
            if(req.body.password) user.password = req.body.password

            //save the user
            user.save(function(err) {
                if(err) res.send(err );

                //return a message
                res.json({message: "User Updated!"})
            });
        });
    })

    //delete a user with specified id
    .delete(function(req, res) {
      User.remove({
        _id: req.params.user_id
      }, function(err, user) {
          if(err) return res.send(err);

          res.json({message: 'Successfully deleted'});
      });
    });



//REGISTER ROUTES
//all routes will be prefixed with /API
app.use('/api', apiRouter);

//START THE SERVER
//=============================================
app.listen(port);
console.log('Magic happens on port ' + port);
