var HttpError = require('error/http-error');

module.exports = function (req, res, next) {
  if (!req.session.user) {
    // return next(new HttpError(401, "Вы не авторизованы"));
    return res.redirect('/login');
  }

  next();
};
