var mongoose = require('mongoose')
  ,Schema = mongoose.Schema;

var Counter = new Schema({
  _id: String,
  next: {type: Number, default: 1}
});

Counter.statics.incrementId = function (counter, callback) {
  return this.findByIdAndUpdate(counter, { $inc: { next: 1 } }, {new: true, upsert: true, select: {next: 1}}, callback);
};

module.exports = mongoose.model('Counter', Counter);
