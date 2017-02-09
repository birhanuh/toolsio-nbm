var express = require('express');
var router = express.Router();

// Get Register
router.get('/register', function(req, res) {
  res.render('auth/register.jade');
});

// Get Login
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
    console.log('PASSED', errors);
  } else {
    console.log('PASSED');
  }
});


module.exports = router;