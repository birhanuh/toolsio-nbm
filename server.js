// Setup express
var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var sessions = require('client-sessions');

// Create a varibale that we can run express from
var app = express();

app.set('view engine', 'jade');

if (app.get('env' === 'development')) {
  app.locals.pretty = true;
}

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));

app.set('views', [__dirname + '/app/public', __dirname + '/app/public/auth']);

// Mongodb credentials
var config = require('./config');

// Points to where our static files going to be
app.use(express.static(__dirname + '/app/public'));
app.use(bodyParser.json());
var port = 8080;

app.listen(port);

console.log('server on port: ' + port);

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

// Session Setup
app.use(sessions({
  cookieName: 'session',
  secret: 'sdsdsfsa7df934q3094sdfasdf0q3',
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 60 * 1000,
}));

// Auth routes
app.get('/', function(req, res) {
  res.render('index.jade');
});

app.get('/register', function(req, res) {
  res.render('register.jade');
});
app.post('/register', function(req, res) {
  var user = new UserMongooseModel({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password,
  });
  user.save(function(err) {
    if (err) {
      var err = 'User not saved!'
      if (err.code === 11000) {
        err = 'Email is already taken, enter another email';   
      }  
      req.session.user = user; // set-cookie: session=qeu233re341234, set-cookie: session={ email: '...', password: '...' }
      res.render('register.jade', { error: err});
    } else {
      res.redirect('/dashboard');
    }
  })
});

app.get('/login', function(req, res) {
  res.render('login.jade');
});
app.post('/login', function(req, res) {
  UserMongooseModel.findOne({ email: req.body.email }, function(arr, user) {
    if (!user) {
      res.render('login.jade', { error: 'Invalid email or password.'});
    } else {
      if (req.body.password === user.password) {
        req.session.user = user;
        res.redirect('/dashboard');
      } else {
        res.render('login.jade', { error: 'Invalid email or password.'});
      }
    }
  });
});

app.get('/dashboard', function(req, res) {
  if (req.session && req.session.user) {
    UserMongooseModel.findOne( {email: req.session.user.email }, function(err, user) {
      if (!user) {
        req.session.reset();
        res.redirect('/login');
      } else {
        res.locals.user = user;
        res.render('dashboard.jade');
      }
    });
  } else {
    res.redirect('/login');
  }
});

app.get('/logout', function(req, res) {
  res.redirect('/');
});

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

