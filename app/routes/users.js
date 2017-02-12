var express = require('express');
var router = express.Router();

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/user');

// GET Register
router.get('/register', function(req, res) {
  res.render('auth/register.jade');
});

// GET Login
router.get('/login', function(req, res) {
  res.render('auth/login.jade');
});

// Register User
router.post('/register', function(req, res) {
  var firstName = req.body.firstName;
  var lastName = req.body.lasttName;
  var email = req.body.email;
  var password = req.body.password;
  var password2 = req.body.password2;

  // Validation
  req.checkBody('firstName', 'First name is required').notEmpty();
  req.checkBody('lastName', 'Last name is required').notEmpty();
  req.checkBody('email', 'Email is required').isEmail();
  req.checkBody('password', 'Password is required').notEmpty();
  req.checkBody('password2', 'Password do not match').equals(req.body.password);

  var errors = req.validationErrors();

  if (errors) {
    res.render('register', {
      errors: errors
    });
  } else {
    var newUser = new User({
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password
    });

    User.createUser(newUser, function(err, user) {
      if(err) throw err;
      console.log(user);
    });

    req.flash('success_msg', 'You are registered and can now login.');

    res.redirect('/users/login');
  }
});

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
  function(username, password, done) {
    console.log("LocalStrategy working...");
    User.getUserByEmail(username, function(err, user) {
      if (err) throw err; 
      if (!user) {
        return done(null, false, { message: 'Incorrect email.'});
      }
      
      User.comparePassword(password, user.password, function(err, isMatch) {
        if(err) throw err;
        
        if(isMatch){
          return done(null, user);
        } else {
          return done(null, false, {message: 'Invalid password'});
        }
    });
  });
}));

passport.serializeUser(function(user, done) {
  done(null, user.id); 
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });   
});      

// POST login                  
router.post('/login', passport.authenticate('local', {successRedirect: '/dashboard', 
  failureRedirect: '/users/login', failureFlash: true}), 
  function(req, res) {
    req.flash('success_msg', 'You are logged');
    res.redirect('/dashboard');
});

router.get('/logout', function(req, res) {
  req.logout();  
  req.flash('success_msg', 'You are logged out');
  res.redirect('/');
});

module.exports = router;