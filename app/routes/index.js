var express = require('express');
var router = express.Router();

// Get Homepage
router.get('/', function(req, res) {
  res.render('index', {title: "Express"});
});

router.get('/dashboard', ensureAuthenticated, function(req, res) {
  res.render('dashboard');
});

router.get('/projects/new', function(req, res) {
  res.render('projects/form', null);
});

function ensureAuthenticated(req, res, next) {
  if(req.isAuthenticated()) {
    return next();
  } else {
    res.redirect('/users/login');
  }
}

module.exports = router;