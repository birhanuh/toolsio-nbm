var express = require('express');
var router = express.Router();

// Get Homepage
router.get('/register', function(req, res) {
  res.render('auth/register.jade');
});

// Login
router.get('/login', function(req, res) {
  res.render('auth/login.jade');
});

module.exports = router;