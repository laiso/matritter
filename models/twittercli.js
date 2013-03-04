var env = process.env.NODE_ENV || 'development'
    , config = require('./../config')[env]
    , twitter = require('twitter');

module.exports = function(user){
  return new twitter({
    consumer_key: config.twitter.clientID,
    consumer_secret: config.twitter.clientSecret,
    access_token_key: user.token,
    access_token_secret: user.tokenSecret,
    rest_base: 'https://api.twitter.com/1.1'
  });
};
