var Friend = require('./../models/friend').Friend
  ,mongoose = require('mongoose')
  ,Map = mongoose.model('Map');

exports.index = function(req, res){
  Map.getAvaliables(req, function(err, maps){
    res.render('index', { maps: maps , user: req.user});
  });
};