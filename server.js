// Setup express
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var flash = require('connect-flash');
var cookieParser = require('cookie-parser');
var bcrypt = require('bcryptjs');
var sessions = require('express-session');
var expressValidator = require('express-validator');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var logger = require('morgan');

var routes = require('./app/routes/index');
var api = require('./app/routes/api');

// Init app
var app = express();

// Mongodb credentials
var config = require('./config');

// View Engine
//app.set('view engine', 'jade');
app.set('view engine', 'hjs');
// app.engine('html', require('ejs').renderFile);
//app.engine('jsx', require('express-react-views').createEngine());
app.set('views', [__dirname + '/app/views', __dirname + '/app/views/auth', __dirname + '/app/views/projects']);

// BodyParser and Cookie parser Middleware(Setup code)
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
// Points to where our static files going to be on development env
if (app.get('env') === 'development') { 
  app.use(express.static(path.join(__dirname + '/app/public')));
}  

if (app.get('env') === 'development') {
  app.locals.pretty = true;
}

app.use('/', routes);
app.use('/api', api);

// Catch 404 and forward to error handler 
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

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
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
})

// Set port
app.set('port', (process.env.PORT || 8080));
app.listen(app.get('port'), function() {
  console.log('Server started on port: ' + app.get('port'));
});

// Setup mongoose (Normally diffirent setup ups are on diffirent files)

////////////////////////////////////////////////////// MONGODB - saves data in the database and posts data to the browser

var mongoURI = ( process.env.PORT ) ? config.creds.mongoose_auth_jitsu : config.creds.mongoose_auth_local;
mongoose.connect(mongoURI, function(err, res) {
  if (err) {
    console.log('DB CONNECTION FAILED: '+err)
  } else {
    console.log('DB CONNECTION SUCCESS: '+mongoURI)
  }
});

