var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ListSchema = new Schema({
  username: String,
  tweet: String, 
  tweeted_at: Date
});

module.exports = mongoose.model('List', ListSchema);