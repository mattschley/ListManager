var tweetDB = require('./models/tweet.js');
var fs = require('fs');

module.exports = function(dictionaryWords,listData, timelineData, cb){

var array = CSVToArray(dictionaryWords,",");
console.log(array);
// for(i=0; i<array.length; i++){
//   if(typeof array[i]=='undefined'){
//     array[i] = 'XGHBYJ';
//   }
// }
console.log(array[0][0]);
var tweet_data = timelineData; 
var username = tweet_data[1].username;
var tweet_content = tweet_data[1].tweet.toString(); 
//console.log(username);
//console.log(tweet_content);
var screen_name = listData.users[10].screen_name;
var length = tweet_data.length; 
for(i=0; i < length; i++){
  var test = tweet_data[i].tweet.toString(); 
  if(test.indexOf(array[0][0]) > -1 ||test.indexOf(array[0][1]) > -1 ||test.indexOf(array[0][2]) > -1|| test.indexOf(array[0][3]) > -1|| test.indexOf(array[0][4]) > -1){
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
  cb(null);

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

function CSVToArray( strData, strDelimiter ){
        // Check to see if the delimiter is defined. If not,
        // then default to comma.
        strDelimiter = (strDelimiter || ",");

        // Create a regular expression to parse the CSV values.
        var objPattern = new RegExp(
            (
                // Delimiters.
                "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +

                // Quoted fields.
                "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +

                // Standard fields.
                "([^\"\\" + strDelimiter + "\\r\\n]*))"
            ),
            "gi"
            );


        // Create an array to hold our data. Give the array
        // a default empty first row.
        var arrData = [[]];

        // Create an array to hold our individual pattern
        // matching groups.
        var arrMatches = null;


        // Keep looping over the regular expression matches
        // until we can no longer find a match.
        while (arrMatches = objPattern.exec( strData )){

            // Get the delimiter that was found.
            var strMatchedDelimiter = arrMatches[ 1 ];

            // Check to see if the given delimiter has a length
            // (is not the start of string) and if it matches
            // field delimiter. If id does not, then we know
            // that this delimiter is a row delimiter.
            if (
                strMatchedDelimiter.length &&
                strMatchedDelimiter !== strDelimiter
                ){

                // Since we have reached a new row of data,
                // add an empty row to our data array.
                arrData.push( [] );

            }

            var strMatchedValue;

            // Now that we have our delimiter out of the way,
            // let's check to see which kind of value we
            // captured (quoted or unquoted).
            if (arrMatches[ 2 ]){

                // We found a quoted value. When we capture
                // this value, unescape any double quotes.
                strMatchedValue = arrMatches[ 2 ].replace(
                    new RegExp( "\"\"", "g" ),
                    "\""
                    );

            } else {

                // We found a non-quoted value.
                strMatchedValue = arrMatches[ 3 ];

            }


            // Now that we have our value string, let's add
            // it to the data array.
            arrData[ arrData.length - 1 ].push( strMatchedValue );
        }

        // Return the parsed data.
        return( arrData );
    }