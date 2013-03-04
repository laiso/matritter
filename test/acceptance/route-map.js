var request = require('supertest')
  , expect = require('chai').expect
  , app = require('../../app');


describe('route-map', function(){
  describe('GET /', function(){
    it("Topページにアクセスできる", function(done){
      request(app)
        .get('/')
        .end(function(err, res){
          expect(res.status).equal(200);
          done();
        });
    })
  })

  describe('GET /map', function(){
    it("/map は認証が必要なのでリダイレクトされる", function(done){
      request(app)
        .get('/map')
        .end(function(err, res){
          expect(res.status).equal(302);
          done();
        });
    })
  })

  describe('GET /map/1', function(){
    it('/map/1 はまだ存在しないので404エラー', function(done){
      request(app)
        .get('/map/1')
        .end(function(err, res){
          expect(res.status).equal(404);
          done();
        });
    })
  })
})
