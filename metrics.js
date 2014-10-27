/*

  MAKE FUNCTIONS UP HERE

*/

module.exports = function(listMemberData){
 
var userList = listMemberData.users; 

for(i=0; i<userList.length; i++){
	var user = userList[i];
	var location = userList[i].location;
	var followers_count = userList[i].followers_count;
	var following = userList[i].friends_count;
	var ff_ratio = followers_count/following;
	var created_at = userList[i].created_at;
	var verified = userList[i].verified; 
	var listed_count = userList[i].listed_count; 
	var statuses_count = userList[i].statuses_count; 
	var status = userList[i].status; 
	var last_tweet_time_date = userList[i].status.created_at;

	// add metric data to metrics attribute in JSON object
	listMemberData.users[i].metrics = {"ff_ratio": ff_ratio, "verified" : verified, "last_active" : last_tweet_time_date, "num_lists_on" : listed_count, "how_often_tweet" : "tbd"};

}
console.log(userList);
  /*
    CALL FUNCTIONS HERE
  */

}