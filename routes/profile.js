var express = require('express'),
  router = express.Router(),
  User = require('models/user'),
  checkAuth = require('middleware/check-auth');

router.get('/', checkAuth, function(req, res) {
  res.render('profile', { title: 'Express | Profile' });
});

module.exports = router;
