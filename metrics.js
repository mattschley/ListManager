/*

  MAKE FUNCTIONS UP HERE

*/
function logUsers(){

for(i=0; i<listMemberData.users.length; i++){
	console.log(listMemberData.users[i]);	
}

}

module.exports = function(listMemberData){
 
var userList = listMemberData.users; 

var user = userList[0];
var location = userList[0].location;
var followers_count = userList[0].followers_count;
var following = userList[0].friends_count;
var ff_ratio = followers_count/following;
var created_at = userList[0].created_at;
var verified = userList[0].verified; 
var listed_count = userList[0].listed_count; 
var statuses_count = userList[0].statuses_count; 
var status = userList[0].status; 
var last_tweet_time_date = userList[0].status.created_at;

listMemberData.users[0].metrics = {"ff_ratio" : ff_ratio};
listMemberData.users[0].metrics = {"verified" : verified};
listMemberData.users[0].metrics = {"last_active" : last_tweet_time_date};
listMemberData.users[0].metrics = {"num_lists_on" : listed_count };
listMemberData.users[0].metrics = {"how_often_tweet" : "tbd"};

// console.log(location);
// console.log(ff_ratio);
// console.log(created_at);
// console.log(verified);
// console.log(listed_count);
// console.log(statuses_count); 
// console.log(last_tweet_time_date);
console.log(user);
  /*
    CALL FUNCTIONS HERE
  */

}