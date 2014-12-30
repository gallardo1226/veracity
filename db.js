var mongoose = require('mongoose');

if (process.env.ENV === 'development')
	uri = 'mongodb://localhost:27017/veracity';
else
  uri = 'mongodb://heroku_app32220259:6livjuh743c00eertbsg1tpi03@ds061360.mongolab.com:61360/heroku_app32220259';
mongoose.connect(uri);

module.exports = {
	connection: mongoose.connection,
  User: require('./models/user'),
  Article: require('./models/article')
};