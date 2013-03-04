var mongoose = require('mongoose')
  , config = require('../config')["test"]
  , expect = require('chai').expect;

mongoose.connect(config.db);
var Map = require('../models/map');

describe('Models.Map', function(){
  describe('#new', function(){
    it("", function(done){
      var m = new Map({});
      expect(m).equal();
    })
  })

  describe.skip('+create', function(){
    it("", function(done){
      Map.create({owner: {id: 1}}, function(err, map){
        expect(map).to.be.a('object');
        done();
      });
    })
  })

  describe.skip('+getAvaliables', function(){
    it("", function(){
      Map.getAvaliables(function(result){
        expect(result).equal();
        done();
      });
    })
  });
});
