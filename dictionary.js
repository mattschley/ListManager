/*
Given a set of dictionary words, this finds the number of times each twitter profile has used them.
NOTE: as a last second-change to the project that put the dictionary word input into the frontend,
we ended up adapting this code into a frontend javascript function. We're keeping this here, however,
in case a future programmer converts that into an AJAX request.
*/

var tweetDB = require('./models/tweet.js');

module.exports = function(dictionaryWords,listData, timelineData, cb){

    var array = CSVToArray(dictionaryWords,",")[0];
    console.log(array);
    var tweet_data = timelineData; 

    var length = tweet_data.length; 
    for(i=0; i < length; i++){

        var test = tweet_data[i].tweet.toString().toLowerCase(); 

        for (var j = 0; j < array.length; j++){
            if(test.indexOf(array[j].toLowerCase() > 0)){
                var relevant_tweet = tweet_data[i];
                var relevant_user_id = relevant_tweet.username;
                for(j=0; j < listData.users.length; j++){
                    if(listData.users[j].screen_name == relevant_user_id){
                        var count = listData.users[j].metrics.dictionaryHits; 
                        var count = count + 1;  
                        listData.users[j].metrics.dictionaryHits = count; 
                    }
                }
            }
        }
    }
    cb(null);
}


/*
Found here: http://stackoverflow.com/questions/1293147/javascript-code-to-parse-csv-data
*/
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