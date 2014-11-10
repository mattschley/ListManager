/*

  MAKE FUNCTIONS UP HERE

*/
var fs = require('fs');

module.exports = function(statusData){

var statuses = statusData; 
var count = 0;  
var statuses_string = JSON.stringify(statusData);
//console.log(statusData);
//console.log(statusData.length);
for(i=0; i<statusData.length; i++){
	
  var test = statusData[i].text.toString(); 
  if(test.indexOf('golf') > -1){
    var relevant_tweet = statusData[i];
    console.log(relevant_tweet);
    count = count + 1;
    console.log("printed:"+count);
  } 
  
}
fs.writeFile("statuses.txt", statusData, function(err) {
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