var tweetDB = require('./models/tweet');

/*
here for present and future helper functions
*/

module.exports = {
  addToDB: function (userName, listName, statusData, cb) {
    var tweet = new tweetDB();
    tweet.listusername = userName;
    tweet.listname = listName;
    tweet.username = statusData.user.screen_name;
    tweet.tweetid = statusData.id;
    tweet.tweet = statusData.text;
    tweet.tweeted_at = statusData.created_at;
    tweet.urls = statusData.entities.urls;
    tweet.mentions = statusData.entities.user_mentions;
    tweet.favorites = statusData.favorite_count;
    tweet.retweets = statusData.retweet_count;
    tweet.save( function(err) {
      if(err){
  //        console.log("error posting: " + err)
          cb(null);
      }
      else{
        cb(null);
      }
    });
  }
}