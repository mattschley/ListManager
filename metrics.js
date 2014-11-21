/*

  MAKE FUNCTIONS UP HERE

*/

module.exports = function(listMemberData, callback){
 
var userList = listMemberData; 
var d = new Date();

  var user = userList;
  var location = userList.location;
  var followers_count = userList.followers_count;
  var following = userList.friends_count;
  var ff_ratio = (followers_count/following).toFixed(1);
  var created_at = userList.created_at;
  var created_at_object = new Date(created_at); 
  var verified = userList.verified; 
  var listed_count = userList.listed_count; 
  var statuses_count = userList.statuses_count; 
  var status = userList.status; 
  var last_tweet_time_date = userList.status.created_at;
  var days_active = d - created_at_object;
  var seconds = days_active*0.001;
  var minutes = seconds/60;
  var hours = minutes/60;
  var days = hours/24;
  var frequency = statuses_count/days;
  var dictionaryHits = 0;
  // add metric data to metrics attribute in JSON object

  listMemberData.metrics = {"followers": followers_count, "following": following, "ff_ratio": ff_ratio, "verified" : verified, "last_active" : last_tweet_time_date, "num_lists_on" : listed_count, 
  "created_at": created_at, "location": location, "statuses_count": statuses_count, "frequency" : frequency, "dictionaryHits" : dictionaryHits };

  callback(null);


  /*
    CALL FUNCTIONS HERE
  */

}