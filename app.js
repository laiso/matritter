var express = require('express')
  , fs = require('fs')
  , http = require('http')
  , path = require('path')
  , env = process.env.NODE_ENV || 'development'
  , config = require('./config')[env]
  , passport = require('passport')
  , TwitterStrategy = require('passport-twitter').Strategy
  , RedisStore = require('connect-redis')(express)
  , mongoose = require('mongoose');


mongoose.connect(config.db);
var models_path = __dirname + '/models'
fs.readdirSync(models_path).forEach(function (file) {
  require(models_path+'/'+file)
});


passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

passport.use(new TwitterStrategy({
    consumerKey: config.twitter.clientID,
    consumerSecret: config.twitter.clientSecret,
    callbackURL: config.twitter.callbackURL
  },
  function(token, tokenSecret, profile, done) {
    var User = mongoose.model('User');
    User.findOrCreate(profile._json, function (err, user) {
      user.token = token;
      user.tokenSecret = tokenSecret;

      return done(err, user);
    });
  }
));


var app = express();
app.configure(function() {
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.methodOverride());

  var redisUri = require('url').parse(config.redis);
  var redisParams = {
    host: redisUri.hostname,
    port: redisUri.port
  };
  if(redisUri.auth){
    redisParams.pass = redisUri.auth.split(':')[1];
  }
  app.use(express.session({
    secret: config.session.secret,
    store: new RedisStore(redisParams),
    cookie: {maxAge: false}
  }));

  app.use(passport.initialize());
  app.use(passport.session());

  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

var routes = require('./routes')
  , map = require('./routes/map')
  , api = require('./routes/api');

app.get('/', routes.index);
app.get('/map', map.edit);
app.get('/map/:id', map.show);

app.get('/api/v1/friends', api.friends);
app.get('/api/v1/user', api.searchUser);
app.post('/api/v1/map', api.saveMap);
app.post('/api/v1/map/delete', api.deleteMap);


app.get('/', function(req, res){
  res.send({ user: req.user });
});

app.get('/auth/twitter',
  passport.authenticate('twitter'),
  function(req, res){
  });

app.get('/auth/twitter/callback',
  passport.authenticate('twitter', { failureRedirect: '/' }),
  function(req, res) {
    res.redirect('/map');
  });

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

module.exports = app;