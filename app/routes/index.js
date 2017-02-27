import express from 'express';
import path from 'path'
let router = express.Router();

// Get Homepage
router.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'index.html'));
});
// router.get('/', function(req, res) {
//   res.render('index', {title: "Express"});
// });

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
    req.flash('error_msg', 'You are not logged in');
    res.redirect('/users/login');
  }
}

module.exports = router;