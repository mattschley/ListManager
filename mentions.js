var tweetDB = require('./models/tweet.js');
module.exports = function(timelineData){

	var tweet_data = timelineData;	 
	var length = tweet_data.length; 
	var mentionedUsers = [];
	var nameCount = 0; 
	for(i=0; i < length; i++){
	  var jsonMentions = tweet_data[i].mentions;
	  // console.log(tweet_data[i].isretweetof);
	  for(j=0; j < jsonMentions.length; j++){
	  	// console.log(jsonMentions[j]);
	  	var x = jsonMentions[j].screen_name;
	  	if (x in mentionedUsers){
	  		mentionedUsers[x]++;
	  	}
	  	else {
	  		mentionedUsers[x] = 1;
	  	}
	  }
	 }
	var sortedMentions = [];
	for (var name in mentionedUsers){
		sortedMentions.push([name, mentionedUsers[name]])
	}
	sortedMentions.sort(function(a, b) {return b[1] - a[1]})
	console.log("Mentions:");
	console.log(sortedMentions);




}
