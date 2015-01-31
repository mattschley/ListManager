var Twit = require ('twit');
var async = require ('async');
var mongoose = require('mongoose');
var Metrics = require('./metrics');
var tweetDB = require('./models/tweet');
var Suggestions = require('./suggestions');
var helper = require('./helper')

//this is for the funnelist338 account
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

// 'mongodb://admin:eecs338@ds051990.mongolab.com:51990/heroku_app30534609'
mongoose.connect('mongodb://heroku_app33624747:wildcats1@ds039411.mongolab.com:39411/heroku_app33624747');

module.exports = function(app) {

  app.use(function(req, res, next){
    console.log('%s %s', req.method, req.url);
    next();
  });


  //Checks the API rate limit status for your key
  app.get('/api_status', function(req, res){
    T.get('application/rate_limit_status', function(err, data, response){
      res.send(data);
    });
  });

  //Post request for adding a user to a list
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
        res.send(data);
      }
    });
  });

  //Post request for removing a user from a list
  app.post('/removeuser', function(req, res){
    var listName = req.body.list;
    var ownerName = req.body.owner;
    var userName = req.body.user;

    console.log(userName)
    console.log(ownerName)
    console.log(listName)

    T.post('lists/members/destroy', {slug: listName, owner_screen_name: ownerName, screen_name: userName}, function(err, data, response){
      if(err){
        console.log("ERROR: "+err);
     //   console.log(response);
      }
      else{
        console.log("IT WORKED!");
        var oldUserData = data;
        tweetDB.find({listusername: ownerName, listname: listName, username: userName}).remove().exec(function(err, data){
          if(err){
            console.log('ERROR: '+err);
          }
          res.send(data);
        });  
      }
    });
  });


  //homepage
  app.get('/', function(req, res) {
    res.render('home', {
      title: 'Welcome!',
      partials: {}
    });
  });

  //gets the form items and passes it to the right url
  app.post('/', function(req, res){
    var userName = req.body.user;
    var listName = req.body.list;

    res.redirect('/'+userName+'/'+listName);
  })


  //loads the page for a user's list. 
  //e.g. for @funnelist338's list called "Tech-News", itd be "/funnelist338/tech-news"
  app.get('/:user/:list', function(req, res){

    var userName = req.params.user;
    var listName = req.params.list;

    var listData;
    var userData;
    var statusData;
    
    //can change 'days ago' to whatever time period. currently last 4 days
    var d = new Date();
    var daysAgo = d.setDate(d.getDate() - 4);

    //Building a giant object of different functions each with 
    //specified dependencies that will be passed to async.auto
    var actions = {

      //gets the list of users on the list
      getUserInfo: function(cb){  
        T.get('lists/members', {slug: listName, owner_screen_name: userName, count: 5000}, function(err, data, response){
          if(err){
            console.log("users/show error: "+err);
          }
          else{
            cb(null, data);
          }
        });
      },

      //gets the latest tweets from the lists' timeline and adds it to the mongo db
      updateMongoTimeline:  function(cb, results){ 

        T.get('lists/statuses', {slug: listName, owner_screen_name: userName, count: 1000}, function(err, data, responses){
          if(err){
            console.log('cant even find one tweet');
            console.log(err);
          }
          else{
            //adds all the tweets to the mongoDB asynchronously
            async.each(data, function(tweet, callback){
              helper.addToDB(userName, listName, tweet, callback);
            }, function(err){
              if(err){
                console.log("adding to DB error: "+err);
              }
              else{
               cb(null);
              }
            });
          }
        });
      },   

      //gets the full list of tweets from the timeline 
      fetchMongoTimeline: [   
        "updateMongoTimeline", function(cb){

          tweetDB.find({listusername: userName, listname: listName}).where('tweeted_at').gt(daysAgo).sort('-tweetid').limit(500).exec(function(err, data){
            if(err){
              console.log("there was an error");
            }
            return cb(null, data);
          });
        }
      ],

      //calculates the metrics for the users on the list
      doMetrics: [
        "getUserInfo", function(cb, results){
          //again, done asynchronously
          async.each(results.getUserInfo.users, function(info, callback){
            info = new Metrics(info, callback);
          }, function(err){
            if(err){
              console.log("metrics error: "+err);
            }
            else{
             cb(null);
            }
          });
        }
      ],

      //sees who is mentioned on the timeline that isnt on the list
      getMentions: [
        "fetchMongoTimeline", "getUserInfo", function(cb, results) {
          return Suggestions(results.getUserInfo, results.fetchMongoTimeline, cb);
        }
      ]
    }


    //run all the functions in actions, asynchronously unless otherwise specified
    async.auto(actions, function(err, results){
      if(err){
        console.log("ASYNC AUTO ERR: "+err);
      }
      else{

        //since only @funnelist338 works for the prototype, dont offer
        //adding/removing for other users since it wont work otherwise
        var canWrite = false;
        if(userName == "funnelist338"){
          canWrite = true;
        }

        //build the template data to be passed to our Mustache template
        res.locals = {
          timeline: results.fetchMongoTimeline,
          users: results.getUserInfo.users,
          mentions: results.getMentions.slice(0, 20),
          ownername: userName,
          listname: listName,
          canwrite: canWrite
        };
          res.render('dashboard', {
          title: '@' + userName + '/' + listName,
          partials: {}
        });
      }
    })
  });
}