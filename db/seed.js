var mongoose = require('db/mongoose');
var async = require('async');

async.series([
  open,
  dropDatabase,
  requireModels,
  createUsers
], function (err) {
  if (err) {
    console.log(err);
  } else {
    console.log('succes');
  }
  mongoose.disconnect();
});

function open(callback) {
  mongoose.connection.on('open', callback);
}

function dropDatabase(callback) {
  var db = mongoose.connection.db;
  db.dropDatabase(callback);
}

function requireModels(callback) {
  require('models/user');

  async.each(Object.keys(mongoose.models), function (modelName, callback) {
    mongoose.models[modelName].ensureIndexes(callback);
  }, callback);
}

function createUsers(callback) {
  var users = [{
    login: 'demo',
    password: 'demo',
    name: "Tatiana Karanova",
    photo: "photo2.jpg",
    age: 27,
    location: "Moscow, Russia",
    info: "Photograph",
    interests: ['art', 'nature', 'fashion']
  }, {
    login: 'alex',
    password: '123',
    name: "Alex Smith",
    photo: "photo1.jpg",
    age: 24,
    location: "Moscow, Russia",
    info: "Artist",
    interests: ['food', 'sex', 'rock & roll']
  }, {
    login: 'admin',
    password: 'password',
    name: "Alisa Snow",
    photo: "photo3.jpg",
    age: 21,
    location: "Moscow, Russia",
    info: "Freelancer",
    interests: ['ice', 'white', 'cold']
  }];

  async.each(users, function (userData, callback) {
    var user = new mongoose.models.User(userData);
    user.save(callback);
  }, callback);
}
