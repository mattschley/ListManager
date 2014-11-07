/*

  MAKE FUNCTIONS UP HERE

*/
var fs = require('fs');
module.exports = function(statusData){
 
var statuses = statusData; 
var count = 0; 
console.log(statusData);
console.log(statusData.length);
for(i=0; i<statusData.length; i++){
	// var user = userList[i];
	// var location = userList[i].location;
	// var followers_count = userList[i].followers_count;
	// var following = userList[i].friends_count;
	// var ff_ratio = followers_count/following;
	// var created_at = userList[i].created_at;
	// var created_at_object = new Date(created_at); 
	// var verified = userList[i].verified; 
	// var listed_count = userList[i].listed_count; 
	// var statuses_count = userList[i].statuses_count; 
	// var status = userList[i].status; 
	// var last_tweet_time_date = userList[i].status.created_at;
	// var days_active = d - created_at_object;
	// var seconds = days_active*0.001;
	// var minutes = seconds/60;
	// var hours = minutes/60;
	// var days = hours/24;
	// var frequency = statuses_count/days;
	// // add metric data to metrics attribute in JSON object
count = count + 1;
	// listMemberData.users[i].metrics = {"followers": followers_count, "following": following, "ff_ratio": ff_ratio, "verified" : verified, "last_active" : last_tweet_time_date, "num_lists_on" : listed_count, "how_often_tweet" : "tbd", 
	// "created_at": created_at, "location": location, "statuses_count": statuses_count, "frequency" : frequency};

}
fs.writeFile("../statuses.txt", "Hey there!", function(err) {
    if(err) {
        console.log(err);
    } else {
        console.log("The file was saved!");
    }
}); 

console.log(count);

  /*
    CALL FUNCTIONS HERE
  */

}