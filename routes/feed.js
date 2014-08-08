var express = require('express');
var router = express.Router();
var User = require('models/user');

router.get('/', function(req, res) {
  User.find({}, function(err, data) {
    if (err) return next(err);
    res.render('feed', { title: 'Express | Feed', users: data });
  });
});

module.exports = router;
