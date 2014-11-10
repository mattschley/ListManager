var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TweetSchema = new Schema({
  username: String,
  listname: String,
  tweet: String, 
  tweeted_at: Date, 
  urls: Array, 
  mentions: Array, 
  favorites: Number, 
  retweets: Number
});

module.exports = mongoose.model('Tweet', TweetSchema);