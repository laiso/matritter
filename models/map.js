var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , User = require('./user')
  , Counter = require('./counter');

var Map = new Schema({
  cid: Number,
  title: String,
  labels: Object,
  users: Array,
  ownerId: Number,
  enable: {type: Boolean, default: true}
});

Map.statics.create = function(obj, callback){
  var map = new this(obj);
  map.ownerId = obj.owner.id;

  Counter.incrementId('Map', function(err, result){
    if(err) console.log(err);

    map.cid = result.next;
    map.save(function(err, store){
      if(err) console.log(err);

      callback(err, store);
    });
  });
}

Map.statics.getAvaliables = function(params, callback){
  this.find({enable: true})
    .sort({ $natural: -1 })
    .limit(30)
    .exec(function(err, result){
      callback(err, result);
    });
}

Map.methods.delete = function(callback){
  this.update({enable: false}, callback);
}

Map.methods.getOwner = function(callback){
  User.findOne({id: this.ownerId}, callback);
};

module.exports = mongoose.model('Map', Map);
