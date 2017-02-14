var express = require('express');
var router = express.Router();

// Get Homepage
router.get('/', function(req, res) {
  res.render('index', {});
});

router.get('/dashboard', ensureAuthenticated, function(req, res) {
  res.render('dashboard.jade');
});

function ensureAuthenticated(req, res, next) {
  if(req.isAuthenticated()) {
    return next();
  } else {
    res.redirect('/users/login');
  }
}

module.exports = router;