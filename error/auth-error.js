var path = require('path');
var util = require('util');
var http = require('http');

function AuthError(message) {
  Error.apply(this, arguments);
  Error.captureStackTrace(this, AuthError);

  this.message = message;
}

util.inherits(AuthError, Error);

AuthError.prototype.name = 'AuthError';

module.exports = AuthError;
