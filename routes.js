var Twit = require ('twit');
var Metrics = require('./metrics');
var CONSUMERKEY =  'tDz1k6Vf4G9ZTfKC1oLBh6m4N';
var CONSUMERSECRET = 'c0qfELVCgiHmJr4Uf1eCclLoGknTDFdh4drAhv1zd90IGlQhWc';

  var T = new Twit({
      consumer_key:         CONSUMERKEY, 
      consumer_secret:     CONSUMERSECRET, 
      access_token:         '180828652-NGg0NjgZLw0i3u7qS7OUlDREewv1D8dDcjyqOCEg', 
      access_token_secret:  'AaMVy2p1ebA8NPgFOnLJWRKSri0tmJvZuBfJxqZN1B1qq'
  });

//https://github.com/ttezel/twit

module.exports = function(app) {

  app.use(function(req, res, next){
    console.log('%s %s', req.method, req.url);
    next();
  });

  app.get('/', function(req, res){
    //list id for cg3ntry/northwestern: 172176744

    var userName = 'funnelist338';
    var listName = 'Northwestern';

    var listData;
    var userData;

    T.get('lists/members', {slug: listName, owner_screen_name: userName, count: 5000}, function(err, data, response){
    
      if(err){
        console.log("ERR IS: "+err);
      }

      listData = data;  

      T.get('users/show', {screen_name: userName}, function(err, data, response){
        
        userData = data;
        listData.user_info = userData;

        var dataWithMetrics = new Metrics(listData);

        for (var i=0; i < dataWithMetrics.users.length; i++){
          console.log(dataWithMetrics.users[i].screen_name);
          console.log(dataWithMetrics.users[i].metrics);
          console.log("\n");
        }
        
        res.locals = {listName: listName, userName: userName, userData: dataWithMetrics.users};
        res.render('index', {
          title: 'Home',
          partials: {}
        });
      })
    });
  });

  // app.get('/add', function (req, res){

  //   T.post('lists/members/create', {slug: 'finance', user_id: 'aginganinja', owner_screen_name: 'funnelist338'}, function(err, data, response){

  //     if (err){
  //       console.log("ERROR: "+err);
  //       return;
  //     }
  //     res.locals = {};
  //     res.render('index', {
  //       title: 'Home',
  //       partials: {}
  //     });

  //   });
  // });

} 
