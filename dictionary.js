var tweetDB = require('./models/tweet.js');
var fs = require('fs');
module.exports = function(listData, timelineData){

var tweet_data = timelineData; 
var username = tweet_data[1].username;
var tweet_content = tweet_data[1].tweet.toString(); 
//console.log(username);
//console.log(tweet_content);
var screen_name = listData.users[10].screen_name;
var length = tweet_data.length; 
for(i=0; i < length; i++){
  var test = tweet_data[i].tweet.toString(); 
  if(test.indexOf('golf') > -1 ||test.indexOf('pga') > -1 ||test.indexOf('swing') > -1|| test.indexOf('course') > -1){
    var relevant_tweet = tweet_data[i];
    var relevant_user_id = relevant_tweet.username;
    for(j=0; j < listData.users.length; j++){
    	if(listData.users[j].screen_name == relevant_user_id){
    		var count = listData.users[j].metrics.dictionaryHits; 
    		//console.log(count); 
    		var count = count + 1;  
    		//console.log("count is:"+count+ "for user:"+listData.users[j].screen_name+"and relev:"+relevant_user_id);
    		listData.users[j].metrics.dictionaryHits = count; 
    	}
    }

  } 

}
//console.log(tweet_data);
//console.log("number of tweets is:" + length);
//console.log(listData.users[1]);
//console.log(cat);
//console.log(listData);
// for(j=0; j < listData.users.length; j++){
//     		var count = listData.users[j].metrics.dictionaryHits;
//     		var name = listData.users[j].screen_name; 
//     		console.log("User "+ name +" has "+count+" dictionaryHits"); }
//console.log(JSON.stringify(listData));
// listData contains num of DictionaryHits... would be nice to add specific hits 
}