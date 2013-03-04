var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

var User = new Schema({
  id: Number,
  name: String,
  profile_image_url: String,
  screen_name: String,
  token: String,
  tokenSecret: String
});

User.statics.findOrCreate = function(profile, done){
  var self = this;
  var query = this.findOne({ 'id': profile.id });
  query.exec(function (err, oldUser) {
    if(oldUser) {
      console.log(oldUser);
      done(null, oldUser);
    } else {
      var newUser = new self(profile);
      newUser.save(function(err) {
        if(err) {throw err;}
        console.log(newUser);
        done(null, newUser);
      });
    }
  });
};

module.exports = mongoose.model('User', User);
