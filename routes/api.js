var Friend = require('./../models/friend').Friend
  ,mongoose = require('mongoose')
  ,twittercli = require('./../models/twittercli')
  ,Map = mongoose.model('Map');

exports.searchUser = function(req, res){
  if(!req.user){
    return res.send({success: false, error: "ログインしていません"});
  }

  var twitter = twittercli(req.user);
  twitter.get('/users/search.json', {q: req.query.q, count: 5}, function(data) {
    if(data.length == undefined){
      return res.send({success: false, error: "データがありません"});
    }
    res.send(data);
  });
};

exports.friends = function(req, res){
  if(!req.user){
    return res.send({success: false, error: "ログインしていません"});
  }

  var twitter = twittercli(req.user);
  twitter.get('/friends/list.json', {count: 5}, function(data) {
    if(data.length == undefined){
      return res.send({success: false, error: "データがありません"});
    }
    res.send(data);
  });
};

exports.saveMap = function(req, res){
  if(!req.user){
    return res.send({success: false, error: "ログインしていません"});
  }

  req.body.owner = req.user;
  Map.create(req.body, function(err, result){
    res.send({success: !err, map: result});
  });
};

exports.deleteMap = function(req, res){
  if(!req.user){
    return res.send({success: false, error: "ログインしていません"});
  }

  Map.findOne({cid: req.body.id, ownerId: req.user.id}, function(err, map){
    if(err && !map){
      return res.send({success: flase, error: err});
    }
    map.delete(function(err){
      res.send({success: !err});
    });
  });
};