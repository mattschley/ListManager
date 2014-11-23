var Twit = require ('twit');
var async = require ('async');
var Metrics = require('./metrics');
var Statuses = require('./statuses');
var tweetDB = require('./models/tweet.js');
var mongoose = require('mongoose');
var dictionary = require('./dictionary.js');
var Mentions = require('./mentions.js');

//https://github.com/ttezel/twit

var CONSUMERKEY =  'GryVkSV5M6j1a9BK2KU2tJ7QP';
var CONSUMERSECRET = 'sOhrQiTvKkLjR9mkKU5sUD2x3hP4TT7vsUKMZJ6uMyqTpKtFbm';
var ACCESSTOKEN =  '2857431705-ZNX4nNcx6laZJozJpVYhjXvQmJawBXm3VV2xlLO';
var ACCESSTOKENSECRET = 'ibnHThzj1SZo0Zhl0gRn3v6Ny3cL0wVCenJlHvcKXzoTC';

var T = new Twit({
    consumer_key:            CONSUMERKEY, 
    consumer_secret:        CONSUMERSECRET, 
    access_token:              ACCESSTOKEN,
    access_token_secret:  ACCESSTOKENSECRET
});

mongoose.connect('mongodb://admin:eecs338@ds051990.mongolab.com:51990/heroku_app30534609');

function addToDB (userName, listName, statusData, cb) {
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
  tweet.save( function(err) {
    if(err){
 //       console.log("error posting: " + err)
        cb(null);
    }
    else{
      cb(null);
    }
  });
}

module.exports = function(app) {

  app.use(function(req, res, next){
    console.log('%s %s', req.method, req.url);
    next();
  });

  app.get('/api_status', function(req, res){
    T.get('application/rate_limit_status', function(err, data, response){
      res.send(data);
    });
  });

  app.post('/adduser', function(req, res){
    var listName = req.body.list;
    var ownerName = req.body.owner;
    var userName = req.body.user;

    T.post('lists/members/create', {slug: listName, owner_screen_name: ownerName, screen_name: userName}, function(err, data, response){
      if(err){
        console.log("ERROR: "+err);
     //   console.log(response);
      }
      else{
        console.log("IT WORKED!");
        res.send(data)
      }
    });
  });

  app.post('/removeuser', function(req, res){
    var listName = req.body.list;
    var ownerName = req.body.owner;
    var userName = req.body.user;

    T.post('lists/members/destroy', {slug: listName, owner_screen_name: ownerName, screen_name: userName}, function(err, data, response){
      if(err){
        console.log("ERROR: "+err);
     //   console.log(response);
      }
      else{
        console.log("IT WORKED!");
        res.send(data)
      }
    });
  });

  app.get('/', function(req, res) {
    res.render('home', {
      title: 'Welcome!',
      partials: {}
    });
  });

  app.post('/', function(req, res){
    var userName = req.body.user;
    var listName = req.body.list;
    var dictionaryWords = req.body.words;
    dictionaryWords = dictionaryWords.replace(/\s+/g, '');

    res.redirect('/'+userName+'/'+listName+"?words="+dictionaryWords);
  })

  app.get('/:user/:list', function(req, res){
    var userName = req.params.user;
    var listName = req.params.list;

    var dictionaryWords = req.query.words;

    var listData;
    var userData;
    var statusData;
    
    var d = new Date();
    var daysAgo = d.setDate(d.getDate() - 2);

    var actions = {

      //WORKS
      getUserInfo: function(cb){  

        console.log("RUNNING getUsersInfo");

        T.get('lists/members', {slug: listName, owner_screen_name: userName, count: 5000}, function(err, data, response){
          if(err){
            console.log("users/show error: "+err);
          }
          else{
            console.log("FINISHING getUsersInfo");
            cb(null, data);
          }
        });
      },

        //WORKS
      getCurrentMongoTimeline: function(cb){  

        console.log("RUNNING getCurrentMongoTimeline");

        tweetDB.find({listusername: userName, listname: listName}).where('tweeted_at').gt(daysAgo).exec(function(err, data){
          if(err){
            console.log("error getting first mongo tweets: "+err);
          }
          console.log("no error");
          var i;
          var latestTweet = 0;
          for(i=0; i < data.length; i++){
            if(data[i].tweetid > latestTweet){
              latestTweet = data[i].tweetid;
            }
          }
          var results = {
            tweetData: data,
            latestTweetID: latestTweet
          }
          console.log("FINISHING getCurrentMongoTimeline");
          cb(null, results);
        });
      },

      // WORKS, FOR SINGLE INSERTION
      updateMongoTimeline: [
        "getCurrentMongoTimeline", function(cb, results){ 

          console.log("RUNNING updateMongoTimeline");

          var latestMongoTweet = results.getCurrentMongoTimeline.latestTweetID;
          var mongoTweetData = results.getCurrentMongoTimeline.tweetData;

          T.get('lists/statuses', {slug: listName, owner_screen_name: userName, count: 1000}, function(err, data, responses){
            if(err){
              console.log('cant even find one tweet');
            }
            else{
              console.log("got tweets!");
              async.each(data, function(tweet, callback){
                addToDB(userName, listName, tweet, callback);
              }, function(err){
                if(err){
                  console.log("adding to DB error: "+err);
                }
                else{
                  console.log("FINISHING updateMongoTimeline");
                 cb(null);
                }
              });
            }
          });
        }  
      ], 

      //WORKS
      fetchMongoTimeline: [   
        "updateMongoTimeline", function(cb){

          console.log("RUNNING fetchMongoTimeline");

          tweetDB.find({listusername: userName, listname: listName}).sort('-tweetid').limit(500).exec(function(err, data){
            if(err){
              console.log("there was an error");
            }
            else{
              console.log('there was data');
            }
            return cb(null, data);
          });
        }
      ],

      doMetrics: [
        "getUserInfo", function(cb, results){
          console.log("at doMetrics");

          async.each(results.getUserInfo.users, function(info, callback){
            info = new Metrics(info, callback);
          }, function(err){
            if(err){
              console.log("metrics error: "+err);
            }
            else{
              console.log("FINISHING doMetrics");
             cb(null);
            }
          });
        }
      ],

      getMentions: [
        "fetchMongoTimeline", "getUserInfo", function(cb, results) {
          console.log("RUNNING getMentions");

          return Mentions(results.getUserInfo, results.fetchMongoTimeline, cb);
        }
      ],

      getDictionary: [
        "fetchMongoTimeline", "getUserInfo", function(cb, results) {
          console.log("RUNNING getDictionary");

          return dictionary(dictionaryWords,results.getUserInfo, results.fetchMongoTimeline, cb);
        }
      ]

    }

    async.auto(actions, function(err, results){
      if(err){
        console.log("ASYNC AUTO ERR: "+err);
      }
      else{
        console.log("RESULTS\n\n");

        var canWrite = false;
        if(userName == "funnelist338"){
          canWrite = true;
        }

        res.locals = {
          timeline: results.fetchMongoTimeline,
          users: results.getUserInfo.users,
          mentions: results.getMentions.slice(0, 20),
          ownername: userName,
          listname: listName,
          canwrite: canWrite
        };
          res.render('index', {
          title: '@' + userName + '/' + listName,
          partials: {}
        });
      }
    })
  });
} 



              /*
                WORKING ON GETTING ALL THE TWEETS WITHIN  A CERTAIN TIME PERIOD...MORE OR LESS PAGING

              var count = mongoTweetData.length;
              var maxID = data[0].id;
              var sinceID = latestMongoTweet;
              async.whilst(
                function () { return count < 500; }, 
                function (callback) {

                  console.log("calling lists/statuses, maxID="+maxID);
                  console.log("listName: "+listName + ", userName: "+userName);

                  T.get('lists/statuses', {slug: listName, owner_screen_name: userName, max_id: maxID, since_id: sinceID, count: 200}, function(err, data, response){
                    if (err){              
                      console.log("error getting tweets from twitter: "+err);
                      callback(err);
                    }
                    else{
                      if (data.length !=0){
                        console.log("got data of length: "+data.length);
                        async.each(data, addToDB.bind(null, userName, listName), function (err){
                          if(err){
                            console.log("Async error: "+err);
                          }
                          maxID = data[data.length-1].id - 1;
                          count += data.length;
                        });
                        callback(null);
                      }
                      else{
                        console.log("Data was of length 0");
                      }
                    }
                  });
                },
                function (err) {
                    console.log("FINISHING getCurrentMongoTimeline");
                    return cb(err);
                }
              );
            }
          });
        }
      ], */
