var tweetDB = require('./models/tweet.js');
module.exports = function(listData, timelineData, callback){

	var tweet_data = timelineData;	 
	var mentionedUsers = [];
	var nameCount = 0; 
	var listUsers = [];
	var mentionedTweets = [];
	
	for (i=0; i < listData.users.length; i++){
		listUsers.push(listData.users[i].screen_name);
	}
	
	for(j=0; j < tweet_data.length; j++){
	  var jsonMentions = tweet_data[j].mentions;

	  if (jsonMentions.length > 0){
	  	var mentionedTweet = tweet_data[j].tweet;
	  }
	
	  for(k=0; k < jsonMentions.length; k++){
	  	var x = jsonMentions[k].screen_name;
	  	
	  	if (listUsers.indexOf(x) < 0){

	  		if (x in mentionedUsers){
	  			mentionedUsers[x]++;
	  		}
	  		else {
	  			mentionedUsers[x] = 1;
	  		}

	  		if (x in mentionedTweets){
	  			mentionedTweets[x].push(mentionedTweet);
	  		}
	  		else {
	  			mentionedTweets[x] = [mentionedTweet];
	  		}
	  	}	
	  }
	}

	var sortedMentions = [];
	for (var name in mentionedUsers){
		sortedMentions.push({'username': name, 'count': mentionedUsers[name], 'mentioned tweets': mentionedTweets[name]})
	}
		
	sortedMentions.sort(function(a, b) {return b.count - a.count})
	console.log(sortedMentions);


	callback(null, sortedMentions);
}
