var tweetDB = require('./models/tweet.js');
module.exports = function(listData, timelineData, callback){

	var tweet_data = timelineData;	 
	var mentionedUsers = [];
	var nameCount = 0; 
	var listUsers = [];
	
	for (i=0; i < listData.users.length; i++){
		listUsers.push(listData.users[i].screen_name);
	}
	
	for(j=0; j < tweet_data.length; j++){
	  var jsonMentions = tweet_data[j].mentions;
	  
	  for(k=0; k < jsonMentions.length; k++){
	  	var x = jsonMentions[k].screen_name;
	  	
	  	if (listUsers.indexOf(x) < 0){
	  		
	  		if (x in mentionedUsers){
	  			mentionedUsers[x]++;
	  		}
	  		else {
	  			mentionedUsers[x] = 1;
	  		}
	  	}	
	  }
	}
	
	var sortedMentions = [];
	for (var name in mentionedUsers){
		sortedMentions.push({'username': name, 'count': mentionedUsers[name]})
	}
	
	sortedMentions.sort(function(a, b) {return b.count - a.count})


	callback(null, sortedMentions);
}
