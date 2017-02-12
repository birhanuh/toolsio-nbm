var express = require('express');
var router = express.Router();

// GET Projects
router.get('/', function(req, res, next) {
  res.render('Projects/index.jade');
});

module.exports = router;