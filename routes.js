var Twit = require ('twit');
var Metrics = require('./metrics');
var Statuses = require('./statuses');
var tweetDB = require('./models/tweet.js');
var mongoose = require('mongoose');

var CONSUMERKEY =  'tDz1k6Vf4G9ZTfKC1oLBh6m4N';
var CONSUMERSECRET = 'c0qfELVCgiHmJr4Uf1eCclLoGknTDFdh4drAhv1zd90IGlQhWc';
var ACCESSTOKEN =  '180828652-NGg0NjgZLw0i3u7qS7OUlDREewv1D8dDcjyqOCEg';
var ACCESSTOKENSECRET = 'AaMVy2p1ebA8NPgFOnLJWRKSri0tmJvZuBfJxqZN1B1qq';
var T = new Twit({
    consumer_key:            CONSUMERKEY, 
    consumer_secret:        CONSUMERSECRET, 
    access_token:              ACCESSTOKEN,
    access_token_secret:  ACCESSTOKENSECRET
});
//https://github.com/ttezel/twit

mongoose.connect('mongodb://admin:eecs338@ds051990.mongolab.com:51990/heroku_app30534609');


module.exports = function(app) {

  app.use(function(req, res, next){
    console.log('%s %s', req.method, req.url);
    next();
  });

  // app.get('/'){
    
  //   landing page
    
  // }

  app.get('/', function(req, res){
    var userName = 'ninatypewriter';
    var listName = 'Microsoft';
    /*
      ^^^^ going to get refactored ^^^^
    */
    var listData;
    var userData;
    var statusData;

    var d = new Date();
    var daysAgo = d.setDate(d.getDate() - 2);

    /*
      GET TO 500 TWEETS?
  
    */


    var addToDB = function(listname, username, max_ID){
      T.get('lists/statuses', {slug: listname, owner_screen_name: username, include_rts: false, max_id: max_ID, count: 300}, function(err, statusData, response){
        if(err){
          console.log("ERR IS HERE: "+err);
        }

        var oldestTweetId = max_ID;
        var oldestTweetedAt = null;
        var oldestTweet = null;

        console.log(statusData.length);

        for(var i = 0; i < statusData.length; i++){
          var tweet = new tweetDB();
          tweet.listusername = username;
          tweet.listname = listname;
          tweet.username = statusData[i].user.screen_name;
          tweet.tweetid = statusData[i].id;
          tweet.tweet = statusData[i].text;
          tweet.tweeted_at = statusData[i].created_at;
          tweet.urls = statusData[i].entities.urls;
          tweet.mentions = statusData[i].entities.user_mentions;
          tweet.favorites = statusData[i].favorite_count;
          tweet.retweets = statusData[i].retweet_count;
          // tweet.save(function(err){
          // if(err)
          //     console.log ("TWEET POSTING ERROR");
          // });
          if (oldestTweetId > statusData[i].id){
            oldestTweetId = statusData[i].id;
            oldestTweetedAt = statusData[i].created_at;
            oldestTweet = statusData[i];

          }
        }
        console.log({oldestId: oldestTweetId, oldestDate: oldestTweetedAt});
        return {oldestId: oldestTweetId, oldestDate: oldestTweetedAt};
      });
    }


    tweetDB.find({listusername: userName, listname: listName}).where('tweeted_at').gt(daysAgo).exec(function(err, data){
      if(err){
        console.log("there was an error");
      }
      if (data.length == 0){
        console.log('there was no data');

        var x = addToDB(listName, userName, 532989025553248256);

      }
      else{
        console.log('there was data');
        console.log(data);
      }

    });

    // T.get('lists/members', {slug: listName, owner_screen_name: userName, count: 5000}, function(err, data, response){
    
    //   if(err){
    //     console.log("ERR IS: "+err);
    //   }

    //   listData = data;  

    //   T.get('users/show', {screen_name: userName}, function(err, data, response){
    //     userData = data;
    //     listData.user_info = userData;
    //     var dataWithMetrics = new Metrics(listData);
        
    //     tweetDB.find().lean().exec( function(err, data) {
    //       if(err)
    //         console.log('err accessing tweetdb');
          
    //       var timelineData = data;
          
    //       res.locals = {
    //         timeline: timelineData,
    //         users: dataWithMetrics.users
    //       };
    //       res.render('index', {
    //         title: '@' + userName + '/' + listName,
    //         partials: {}
    //       });
    //     });
    //   })
    // });
  });


  app.get('/update', function(req, res){

    var userName = 'funnelist338';
    var listName = 'Golf';

    T.get('lists/statuses', {slug: listName, owner_screen_name: userName, include_rts: true, count: 100}, function(err, data, response){
      if(err){
        console.log("ERR IS HERE: "+err);
      }
      statusData = data;  

      //console.log(JSON.stringify(statusData));   
      
      console.log(statusData.length);
      console.log(statusData[0].user.screen_name);
      console.log(statusData[statusData.length - 1]);

      for(var i = 0; i < statusData.length; i++){
        var tweet = new tweetDB();
        tweet.listusername = userName;
        tweet.listname = listName;
        tweet.username = statusData[i].user.screen_name;
        tweet.tweetid = statusData[i].id;
        tweet.tweet = statusData[i].text;
        tweet.tweeted_at = statusData[i].created_at;
        tweet.urls = statusData[i].entities.urls;
        tweet.mentions = statusData[i].entities.user_mentions;
        tweet.favorites = statusData[i].favorite_count;
        tweet.retweets = statusData[i].retweet_count;

        console.log(tweet+"\n\n\n");
        
        tweet.save(function(err){
        if(err)
            console.log ("TWEET POSTING ERROR");
        });
      }

      console.log("FINISHED ADDING ALL THE TWEETS");    
      res.locals = {user_data: "updated tweets"}
      res.render('list', {
        title: 'Home',
        partials: {}
      });    

    });
  });
} 
