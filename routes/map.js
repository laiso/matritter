var mongoose = require('mongoose')
  , Map = mongoose.model('Map')
  , User = require('./../models/user');

exports.show = function(req, res){
  Map.findOne({cid: req.params.id, enable: true}, function(err, m){
    if(!m){
      res.send(404, "エラー: マップが見つかりませんでした。");
      return;
    }
    m.getOwner(function(err, owner){
      m.owner = owner;
      var isOwner = (req.user && owner.id === req.user.id);
      res.render('map/show', {map: m, user: req.user, isOwner: isOwner});
    });
  });
};

exports.edit = function(req, res){
  if(!req.user){
    res.redirect('/auth/twitter');
    return;
  }

  if(!req.title) req.title = "";
  if(!req.labels){
    req.labels = {top: '', bottom:'', left: '', right: ''};
  }

  res.render('map/edit', {
    title: req.title,
    labels: req.labels,
    user: req.user
  });
};

exports.save = function(req, res){
  res.send('save');
};