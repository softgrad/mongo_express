var express = require('express'),
  router = express.Router(),
  User = require('models/user'),
  HttpError = require('error/http-error'),
  AuthError = require('error/auth-error');

router.get('/', function (req, res) {
  res.render('login', {
    title: 'Express | login'
  });
});

router.post('/', function (req, res, next) {
  var username = req.body.login;
  var password = req.body.password;

  User.authorize(username, password, function (err, user) {
    if (err) {
      if (err instanceof AuthError) {
        return next(new HttpError(403, err.message));
      } else {
        return next(err);
      }
    }

    req.session.user = user._id;
    res.send({});

  });

});

module.exports = router;
