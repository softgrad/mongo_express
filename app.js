var express = require('express'),
  session = require('express-session'),
  errorHandler = require('errorhandler'),
  MongoStore = require('connect-mongo')(session),
  path = require('path'),
  favicon = require('static-favicon'),
  logger = require('morgan'),
  cookieParser = require('cookie-parser'),
  bodyParser = require('body-parser'),
  config = require('config'),
  mongoose = require('db/mongoose'),
  HttpError = require('error/http-error');

var profile = require('./routes/profile'),
  login = require('./routes/login'),
  logout = require('./routes/logout'),
  feed = require('./routes/feed'),
  search = require('./routes/search');

var app = express();

app.set('port', process.env.PORT || config.get('port'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());

if (app.get('env') === 'development') {
  app.use(logger('dev'));
} else {
  app.use(logger('default'));
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(session({
  secret: config.get('session:secret'),
  cookie: config.get('session:cookie'),
  name: config.get('session:name'),
  store: new MongoStore({
    mongoose_connection: mongoose.connection
  })
}));
app.use(require('middleware/send-http-error'));
app.use(require('middleware/load-user'));

app.use(require('less-middleware')(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', feed);
app.use('/feed', feed);
app.use('/profile', profile);
app.use('/login', login);
app.use('/logout', logout);
app.use('/search', search);

/// error handlers
app.use(function (err, req, res, next) {
  if (typeof err == 'number') { // next(404);
    err = new HttpError(err);
  }

  if (err instanceof HttpError) {
    res.sendHttpError(err);
  } else {
    if (app.get('env') == 'development') {
      errorHandler()(err, req, res, next);
    } else {
      console.log(err);
      err = new HttpError(500);
      res.sendHttpError(err);
    }
  }
});

module.exports = app;
