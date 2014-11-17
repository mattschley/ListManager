var Twit = require ('twit');
var async = require ('async');
var Metrics = require('./metrics');
var Statuses = require('./statuses');
var tweetDB = require('./models/tweet.js');
var mongoose = require('mongoose');
var dictionary = require('./dictionary.js')
var Mentions = require('./mentions.js')

//https://github.com/ttezel/twit
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

mongoose.connect('mongodb://admin:eecs338@ds051990.mongolab.com:51990/heroku_app30534609');

function addToDB (userName, listName, statusData, cb){
  var tweet = new tweetDB();
  tweet.listusername = userName;
  tweet.listname = listName;
  tweet.username = statusData.user.screen_name;
  tweet.tweetid = statusData.id;
  tweet.tweet = statusData.text;
  tweet.tweeted_at = statusData.created_at;
  tweet.urls = statusData.entities.urls;
  tweet.mentions = statusData.entities.user_mentions;
  tweet.favorites = statusData.favorite_count;
  tweet.retweets = statusData.retweet_count;
  tweet.save(function(err){
  if(err)
      console.log ("TWEET POSTING ERROR: "+err);
  }
  else{
    cb(null);
  });
}

module.exports = function(app) {

  app.use(function(req, res, next){
    console.log('%s %s', req.method, req.url);
    next();
  });

  app.get('/', function(req, res){
    var userName = 'ninatypewriter';
    var listName = 'Microsoft';

    var listData;
    var userData;
    var statusData;
    
    var d = new Date();
    var daysAgo = d.setDate(d.getDate() - 2);

    var actions = {

      getUserInfo: function(cb){
        T.get('users/show', {screen_name: userName}, function(err, data, response){

        }
      },

      getCurrentMongoTimeline: function(cb){
        tweetDB.find({listusername: userName, listname: listName}).where('tweeted_at').gt(daysAgo).exec(function(err, data){
          if(err){
            console.log("error getting first mongo tweets: "+err);
          }
          var i;
          var latestTweet =0;
          for(i=0; i < data.length; i++){
            if(data[i].tweetid > latestTweet){
              latestTweet = data[i].tweetid;
            }
          }
          var results = {
            tweetData: data,
            latestTweetID: latestTweet
          }
          cb(null, results);
        });
      },

      updateMongoTimeline: [
        "getCurrentMongoTimeline", function(cb, results){
          var latestMongoTweet = results.getCurrentMongoTimeline.latestTweetID;
          var mongoTweetData = results.getCurrentMongoTimeline.tweetData;
          var count = mongoTweetData.length;
          var maxID = null;
          async.whilst(
            function () { return count < 500; },
            function (callback) {
              T.get('lists/statuses', {slug: listName, owner_screen_name: userName, max_id: maxID}, function(err, data, response){
                if (err){
                  console.log("error getting tweets from twitter: "+err);
                }
                else{
                  async.each(data, addToDB.bind(null, userName, listName), function (err){
                    if(err){
                      console.log("Async error: "+err);
                    }
                    else{
                      maxID = data[data.length-1].id;
                      count += data.length;
                    }
                  });
                }
              });
            },
            function (err) {
                return cb(err);
            }
          );
        }
      ],

      fetchMongoTimeline: [   
        "updateMongoTimeline", function(cb){
          tweetDB.find({listusername: userName, listname: listName}).sort('tweetid').limit(500).exec(function(err, data){
            if(err){
              console.log("there was an error");
            }
            else{
              console.log('there was data');
              console.log(data);
            }
            return cb(null, data);
          });

        }
      ]å
    }

    async.auto(actions, function(err, results){
      if(err){
        console.log("ASYNC AUTO ERR: "+err);
      }
      else{
        console.log("RESULTS\n\n");
        console.log(results);
      }

    })




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
