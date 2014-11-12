/*

  MAKE FUNCTIONS UP HERE

*/

module.exports = function(listMemberData){
 
var userList = listMemberData.users; 
var d = new Date();
for(i=0; i<userList.length; i++){
	var user = userList[i];
	var location = userList[i].location;
	var followers_count = userList[i].followers_count;
	var following = userList[i].friends_count;
	var ff_ratio = (followers_count/following).toFixed(1);
	var created_at = userList[i].created_at;
	var created_at_object = new Date(created_at); 
	var verified = userList[i].verified; 
	var listed_count = userList[i].listed_count; 
	var statuses_count = userList[i].statuses_count; 
	var status = userList[i].status; 
	var last_tweet_time_date = userList[i].status.created_at;
	var days_active = d - created_at_object;
	var seconds = days_active*0.001;
	var minutes = seconds/60;
	var hours = minutes/60;
	var days = hours/24;
	var frequency = statuses_count/days;
	var dictionaryHits = 0;
	// add metric data to metrics attribute in JSON object

	listMemberData.users[i].metrics = {"followers": followers_count, "following": following, "ff_ratio": ff_ratio, "verified" : verified, "last_active" : last_tweet_time_date, "num_lists_on" : listed_count, "how_often_tweet" : "tbd", 
	"created_at": created_at, "location": location, "statuses_count": statuses_count, "frequency" : frequency, "dictionaryHits" : dictionaryHits };

}

return listMemberData;


  /*
    CALL FUNCTIONS HERE
  */

}