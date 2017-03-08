import express from 'express'
import bcrypt from 'bcrypt'
import { Validation } from '../src/utils'
import isEmpty from 'lodash/isEmpty'

import User from '../models/user'

let router = express.Router();

function validateInput(data, otherValidation) {
  let { errors } = otherValidation(data)

  return User.findAsync({ email: data.email }).then(user => {
    if (user) { 
      if (user[0].email === data.email) { errors.email = 'There is user with such email' }
    }

    return {
      errors,
      isValid: isEmpty(errors)
    }
  })
}

// Register User
router.post('/register', function(req, res) {
  validateInput(req.body, Validation.validateInput).then(({ errors, isValid }) => {
    if (isValid) {
      //res.json({ success: true })
      const { firstName, lastName, email, password } = req.body
      const password_digest = bcrypt.hashSync(password, 10)

      var newUser = new User({
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password_digest
      });

      newUser.save()
        .then(user => res.json({ success: true }))
        .catch(err => res.status(500).json({ error: err }))

    } else {  
      res.status(400).json(errors)
    } 
  })
  
})

module.exports = router

/**
var express = require('express');
var router = express.Router();

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/user');

// GET Register
router.get('/register', function(req, res) {
  res.render('auth/register');
});

// GET Login
router.get('/login', function(req, res) {
  res.render('auth/login');
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
  req.checkBody('email', 'Email is required').notEmpty();
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
        return done(null, false, { message: 'Unknown email.'});
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
*/

  // var firstName = data.body.firstName;
  // var lastName = data.body.lasttName;
  // var email = data.body.email;
  // var password = data.body.password;
  // var password2 = data.body.password2;

  // // Validation
  // data.checkBody('firstName', 'First name is required').notEmpty();
  // data.checkBody('lastName', 'Last name is required').notEmpty();
  // data.checkBody('email', 'Email is required').notEmpty();
  // data.checkBody('email', 'Wrong Email format').isEmail();
  // data.checkBody('password', 'Password is required').notEmpty();
  // data.checkBody('password2', 'Password do not match').equals(data.body.password);

  // let errors = data.validationErrors();