// Setup express
var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var flash = require('connect-flash');
var cookieParser = require('cookie-parser');
var bcrypt = require('bcryptjs');
var sessions = require('express-session');
var expressValidator = require('express-validator');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var routes = require('./app/routes/index');
var users = require('./app/routes/users');

// Init app
var app = express();

// View Engine
app.set('view engine', 'jade');
app.set('views', [__dirname + '/app/views', __dirname + '/app/views/auth']);

// Points to where our static files going to be
app.use(express.static(__dirname + '/app/public'));

// BodyParser and Cookie parser Middleware(Setup code)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

if (app.get('env' === 'development')) {
  app.locals.pretty = true;
}

// Mongodb credentials
var config = require('./config');

// Session Setup
app.use(sessions({
  secret: 'sdsdsfsa7df934q3094sdfasdf0q3',
  saveUninitialized: true,
  resave: true,

  /*
  cookieName: 'session',
  secret: 'sdsdsfsa7df934q3094sdfasdf0q3',
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 60 * 1000,
  httpOnly: true, // dont let browser javascript access cookies ever
  //secure: true, // only use cookies over https
  ephemeral: true, // delete this cookie when the browser is closed  */
}));

// Passport init
app.use(passport.initialize());
app.use(passport.session());

// Express validator
app.use(expressValidator({
  errorFormatter: function(params, msg, value) {
    var namespace = params.split('.'), root = namespace.shift(), formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg : msg,
      value : value
    };
  }
}));

// Connect Flash
app.use(flash());

// Global vars
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg')
  res.locals.error_msg = req.flash('error_msg')
  res.locals.error = req.flash('error')
  next();
})

app.use('/', routes);
app.use('/users', users);

// Set port
app.set('port', (process.env.PORT || 8080));
app.listen(app.get('port'), function() {
  console.log('Server started on port: ' + app.get('port'));
});

// Setup mongoose (Normally diffirent setup ups are on diffirent files)

////////////////////////////////////////////////////// MONGODB - saves data in the database and posts data to the browser

var mongoURI = ( process.env.PORT ) ? config.creds.mongoose_auth_jitsu : config.creds.mongoose_auth_local;
mongoose.connect(mongoURI);

var Schema = mongoose.Schema

// Create a schema for our data
var UserSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: String,
  email: { type: String, required: true },
  password: { type: String, required: true }
});
UserSchema.path('email').validate(function(value, done) {
  this.model('User').count({ email: value }, function(err, count) {
    if (err) {
      return done(err);
    } 
    // If `count` is greater than zero, "invalidate"
    done(!count);
  });
}, 'Email already exists');
mongoose.model('User', UserSchema); 
var UserMongooseModel = mongoose.model('User');

// Create a schema for our data
var ProjectSchema = new Schema({
  name: String,
  date: Date,
  description: String
});
// Use the schema to register a model
mongoose.model('Project', ProjectSchema); 
var ProjectMongooseModel = mongoose.model('Project'); // just to emphasize this isn't a Backbone Model


// Routes 
app.get('/projects', function(req ,res) {
  ProjectMongooseModel.find(function(err, docs) {
    docs.forEach(function(item) {
      console.log('Received a get request for _id: ' +item);
    });
    res.send(docs);
  });
});

app.post('/projects', function(req, res) {
  console.log('Received a post projectMongooseModel');
  for (key in req.body) {
    console.log(key+ ': ' +req.body[key]);
  }
  var projectMongooseModel = new ProjectMongooseModel(req.body);
  projectMongooseModel.save(function(err, doc) {
    res.send(doc);
  });
});

app.delete('/projects/:id', function(req, res) {
  console.log('Received a delete request for _id: ' +req.params.id);
  ProjectMongooseModel.remove({_id: req.params.id}, function(err) {
    res.send({_id: req.params.id});
  });
}); 

