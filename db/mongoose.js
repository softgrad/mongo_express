var mongoose   = require('mongoose'),
    config     = require('config'),
    connection = mongoose.connection,
    uri = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || config.get('mongoose:uri');

mongoose.connect(uri, config.get('mongoose:options'));
connection.on('error', console.error.bind(console, 'connection error:'));

module.exports = mongoose;
