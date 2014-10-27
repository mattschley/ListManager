var Twit = require ('twit');
var Metrics = require('./metrics');

  var T = new Twit({
      consumer_key:         'rVbhHqZ2ohpqfG1LfIFGUYqPj', 
      consumer_secret:      'jsA6co3nRkFMSfJbUcFIP2JnxZflOXnJB3EiokJrqqst7Kazq9', 
      access_token:         '180828652-NGg0NjgZLw0i3u7qS7OUlDREewv1D8dDcjyqOCEg', 
      access_token_secret:  'AaMVy2p1ebA8NPgFOnLJWRKSri0tmJvZuBfJxqZN1B1qq'
  });

module.exports = function(app) {

  app.use(function(req, res, next){
    console.log('%s %s', req.method, req.url);
    next();
  });

  app.get('/', function(req, res){
    //list id for cg3ntry/northwestern: 172176744

    var listData;
    var userData;

    T.get('lists/members', {slug: 'northwestern', owner_screen_name: 'cg3ntry', count: 5000}, function(err, data, response){
    
      listData = data;  

      T.get('users/show', {screen_name: 'cg3ntry'}, function(err, data, response){
        
        userData = data;
        listData.user_info = userData;

        var dataWithMetrics = new Metrics(listData);
        
        res.locals = {listName: "Northwestern", userName: "cg3ntry", userData: dataWithMetrics.users};
        res.render('index', {
          title: 'Home',
          partials: {}
        });
      })
    });
  });
} 
