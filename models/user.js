var crypto = require('crypto'),
    async = require('async'),
    AuthError = require('error/auth-error');

var mongoose = require('db/mongoose'),
  Schema = mongoose.Schema;

var schema = new Schema({
  login: {
    type: String,
    unique: true,
    required: true
  },
  hashedPassword: {
    type: String,
    required: true
  },
  salt: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  photo: {
    type: String
  },
  age: {
    type: Number,
    required: true
  },
  location: {
    type: String
  },
  info: {
    type: String
  },
  interests: {
    type: []
  },
  created: {
    type: Date,
    default: Date.now
  }
});

schema.methods.encryptPassword = function(password) {
  return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
};

schema.virtual('password')
  .set(function(password) {
    this._plainPassword = password;
    this.salt = Math.random() + '';
    this.hashedPassword = this.encryptPassword(password);
  })
  .get(function() { return this._plainPassword; });


schema.methods.checkPassword = function(password) {
  return this.encryptPassword(password) === this.hashedPassword;
};

schema.statics.authorize = function(username, password, callback) {
  var User = this;

  async.waterfall([
    function(callback) {
      User.findOne({login: username}, callback);
    },
    function(user, callback) {
      if (user && user.checkPassword(password)) {
        callback(null, user);
      } else {
        callback(new AuthError("incorrect username or password"));
      }
    }
  ], callback);
};

module.exports = mongoose.model('User', schema);
