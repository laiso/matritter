var request = require('supertest')
  , expect = require('chai').expect
  , app = require('../../app');


describe('route-map', function(){
  describe("ログインしていない",function(){
    describe('GET /api/v1/friends', function(){
      it("フォロワーが取得できないエラーが返ってくる", function(done){
        request(app)
          .get('/api/v1/friends')
          .end(function(err, res){
            expect(res.status).equal(200);
            expect(res.body.success).equal(false);
            done();
          });
      })
    })

    describe('GET /api/v1/user', function(){
      it("ユーザーが検索できないエラーが返ってくる", function(done){
        request(app)
          .get('/api/v1/user')
          .end(function(err, res){
            expect(res.status).equal(200);
            expect(res.body.success).equal(false);
            done();
          });
      })
    })

    describe('POST /api/v1/map', function(){
      it("Mapを投稿できないエラーが返ってくる", function(done){
        request(app)
          .post('/api/v1/map')
          .end(function(err, res){
            expect(res.status).equal(200);
            expect(res.body.success).equal(false);
            done();
          });
      })
    })

    describe('POST /api/v1/map/delete', function(){
      it("Mapを削除できないエラーが返ってくる", function(done){
        request(app)
          .post('/api/v1/map/delete')
          .end(function(err, res){
            expect(res.status).equal(200);
            expect(res.body.success).equal(false);
            done();
          });
      })
    })

  })
})